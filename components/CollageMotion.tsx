"use client";

import { useEffect } from "react";
import styles from "@/app/page.module.css";

// Cursor-reactive collage pieces, found by their data-motion attribute.
// Values go straight to the elements' `translate` / `rotate` properties
// (which compose with any existing `transform`), so React never re-renders.

const SATURN_MAX = 10; // px
const ARROW_MAX = 5; // px
const ARROW_TILT = 1.5; // deg
const EASE = 0.12; // share of the remaining distance covered per frame
const TV_PROXIMITY = 80; // px around the TV that counts as "near"
const TV_COOLDOWN_MS = 1800;
const HERO_BOTTOM = 998; // design px: where the form section starts

type Motion = { x: number; y: number; r: number };

export default function CollageMotion() {
  useEffect(() => {
    // Desktop canvas + mouse/trackpad only, and never with reduced motion.
    const enabled = window.matchMedia(
      "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    const saturn = document.querySelector<HTMLElement>('[data-motion="saturn"]');
    const arrow = document.querySelector<HTMLElement>('[data-motion="arrow"]');
    const tv = document.querySelector<HTMLElement>('[data-motion="tv"]');
    if (!saturn || !arrow || !tv) return;

    const target = { saturn: { x: 0, y: 0, r: 0 }, arrow: { x: 0, y: 0, r: 0 } };
    const current = { saturn: { x: 0, y: 0, r: 0 }, arrow: { x: 0, y: 0, r: 0 } };
    let frame = 0;
    let tvNear = false;
    let lastGlitch = -Infinity;

    const apply = (el: HTMLElement, m: Motion) => {
      el.style.translate = `${m.x.toFixed(2)}px ${m.y.toFixed(2)}px`;
      el.style.rotate = `${m.r.toFixed(3)}deg`;
    };

    const tick = () => {
      let moving = false;
      for (const key of ["saturn", "arrow"] as const) {
        const c = current[key];
        const t = target[key];
        c.x += (t.x - c.x) * EASE;
        c.y += (t.y - c.y) * EASE;
        c.r += (t.r - c.r) * EASE;
        if (Math.abs(t.x - c.x) + Math.abs(t.y - c.y) + Math.abs(t.r - c.r) > 0.01) moving = true;
        else Object.assign(c, t);
      }
      apply(saturn, current.saturn);
      apply(arrow, current.arrow);
      frame = moving ? requestAnimationFrame(tick) : 0;
    };
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const rest = () => {
      target.saturn = { x: 0, y: 0, r: 0 };
      target.arrow = { x: 0, y: 0, r: 0 };
      tvNear = false;
      wake();
    };

    const onMove = (event: PointerEvent) => {
      if (!enabled.matches || event.pointerType !== "mouse") return rest();
      const { clientX: px, clientY: py } = event;

      // The hero band of the canvas is the interactive area.
      const canvas = saturn.offsetParent?.getBoundingClientRect();
      if (!canvas) return rest();
      const heroBottom = canvas.top + (HERO_BOTTOM * canvas.width) / 1440;
      if (py < canvas.top || py > heroBottom || px < canvas.left || px > canvas.right) return rest();

      // -1…1 across the viewport, so the pieces drift with the pointer.
      const nx = Math.max(-1, Math.min(1, (px / window.innerWidth) * 2 - 1));
      const ny = Math.max(-1, Math.min(1, ((py - canvas.top) / (heroBottom - canvas.top)) * 2 - 1));
      target.saturn = { x: nx * SATURN_MAX, y: ny * SATURN_MAX, r: 0 };
      // Small drift and tilt; the tip still points at the CTA to its right.
      target.arrow = { x: nx * ARROW_MAX, y: ny * ARROW_MAX, r: ny * ARROW_TILT };
      wake();

      // CRT: glitch once on entering the zone around it, then cool down.
      const box = tv.getBoundingClientRect();
      const near =
        px > box.left - TV_PROXIMITY && px < box.right + TV_PROXIMITY &&
        py > box.top - TV_PROXIMITY && py < box.bottom + TV_PROXIMITY;
      if (near && !tvNear && event.timeStamp - lastGlitch > TV_COOLDOWN_MS) {
        lastGlitch = event.timeStamp;
        tv.classList.remove(styles.tvGlitch);
        void tv.offsetWidth; // restart the animation
        tv.classList.add(styles.tvGlitch);
      }
      tvNear = near;
    };

    const endGlitch = () => tv.classList.remove(styles.tvGlitch);

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", rest);
    window.addEventListener("blur", rest);
    tv.addEventListener("animationend", endGlitch);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", rest);
      window.removeEventListener("blur", rest);
      tv.removeEventListener("animationend", endGlitch);
      cancelAnimationFrame(frame);
      for (const el of [saturn, arrow]) {
        el.style.translate = "";
        el.style.rotate = "";
      }
      endGlitch();
    };
  }, []);

  return null;
}
