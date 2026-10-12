"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent } from "react";
import styles from "@/app/page.module.css";

const TOAST_EVENT = "seblay:toast";
const TOAST_MS = 3000;
const OVERLAY_MS = 4000;
const LOGO_CLICKS = 3;
const LOGO_WINDOW_MS = 1200;
const SEQUENCE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight"];

type Toast = { id: number; message: string; ms: number };

/** Shows a short message at the bottom of the screen (rendered by <EasterEggs />). */
export function showToast(message: string, ms = TOAST_MS) {
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: { message, ms } }));
}

/** Records click times and reports when `count` clicks land within `windowMs`. */
export function useClickBurst(count: number, windowMs: number) {
  const clicks = useRef<number[]>([]);
  return {
    hit() {
      const now = performance.now();
      clicks.current = [...clicks.current.filter((t) => now - t < windowMs), now];
      if (clicks.current.length < count) return false;
      clicks.current = [];
      return true;
    },
    reset() {
      clicks.current = [];
    },
  };
}

function isEditable(target: EventTarget | null) {
  return target instanceof HTMLElement && (target.isContentEditable || target.closest("input, textarea, select") !== null);
}

/** Easter egg #1: the brand link. Three quick clicks reveal a message. */
export function Logo({ className, style }: { className: string; style: CSSProperties }) {
  const burst = useClickBurst(LOGO_CLICKS, LOGO_WINDOW_MS);

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    // Modified clicks keep the browser's own behaviour (new tab, etc.).
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    // Already home: go to the top in place instead of reloading, so the
    // click count survives. Looks the same to the visitor.
    if (window.location.pathname === "/") {
      event.preventDefault();
      if (window.location.hash) history.replaceState(null, "", "/");
      window.scrollTo({ top: 0 });
    }
    if (burst.hit()) showToast("KAMU SEBENARNYA SEDANG MENGHINDARI SESUATU.");
  }

  return (
    <a href="/" className={className} style={style} onClick={handleClick}>
      WALUY.STUDIO
    </a>
  );
}

/** Toast + easter egg #3 (arrow sequence overlay). Mount once, outside `.page`. */
export default function EasterEggs() {
  const [toast, setToast] = useState<Toast | null>(null);
  const [overlay, setOverlay] = useState(0);

  useEffect(() => {
    let id = 0;
    const onToast = (event: Event) => {
      const { message, ms } = (event as CustomEvent<{ message: string; ms: number }>).detail;
      setToast({ id: ++id, message, ms });
    };

    let recent: string[] = [];
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOverlay(0);
      if (event.repeat || isEditable(event.target)) return;
      // Keep the last 8 keys; any wrong key simply breaks the match.
      recent = [...recent, event.key].slice(-SEQUENCE.length);
      if (recent.join() === SEQUENCE.join()) {
        recent = [];
        setOverlay((n) => n + 1);
      }
    };

    window.addEventListener(TOAST_EVENT, onToast);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(TOAST_EVENT, onToast);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <>
      {toast ? (
        // The CSS animation spans the whole visible time; its end removes the toast.
        <p
          key={toast.id}
          className={styles.eggToast}
          style={{ animationDuration: `${toast.ms}ms` }}
          role="status"
          onAnimationEnd={(event) => event.target === event.currentTarget && setToast(null)}
        >
          {toast.message}
        </p>
      ) : null}
      {overlay ? (
        <div
          key={overlay}
          className={styles.eggOverlay}
          style={{ animationDuration: `${OVERLAY_MS}ms` }}
          role="alert"
          onClick={() => setOverlay(0)}
          onAnimationEnd={(event) => event.target === event.currentTarget && setOverlay(0)}
        >
          <p>MODE ALASAN TERLARANG: AKTIF</p>
        </div>
      ) : null}
    </>
  );
}
