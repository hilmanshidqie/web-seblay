"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import styles from "@/app/page.module.css";
import { excuseToText, generateExcuse, type Excuse } from "./excuses";
import { showToast, useClickBurst } from "./EasterEggs";
import { place } from "./place";

const LOADING_MS = 2000;
const COPY_FEEDBACK_MS = 1600;
const REVEAL_MS = 500;
// Shown one after another while loading; together they span LOADING_MS.
const LOADING_MESSAGES = [
  "Merumuskan alasan...",
  "Menganalisis situasi...",
  "Menyusun argumen...",
  "Memeriksa tingkat urgensi...",
];
// Breathing room (px) kept between a long excuse and the card's buttons.
const CARD_TEXT_GAP = 8;
// Card width, and how far long text may move up into the blank paper under
// "[ ALASAN HARI INI ]", both in design px.
const CARD_WIDTH = 838;
const CARD_MAX_LIFT = 40;

type Status = "idle" | "loading" | "result";
type CopyState = "idle" | "copied" | "error";

export default function ReasonForm() {
  const [occupation, setOccupation] = useState("");
  const [submittedJob, setSubmittedJob] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [excuse, setExcuse] = useState<Excuse | null>(null);
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const fieldRef = useRef<HTMLTextAreaElement>(null);
  const loadingTimer = useRef<number | undefined>(undefined);
  const copyTimer = useRef<number | undefined>(undefined);
  // Easter egg #4: three clicks on the loading panel within 2s, while loading.
  const loadingClicks = useClickBurst(3, 2000);
  const cardRef = useRef<HTMLElement>(null);
  const cardTextRef = useRef<HTMLDivElement>(null);
  const cardActionsRef = useRef<HTMLDivElement>(null);

  useEffect(
    () => () => {
      window.clearTimeout(loadingTimer.current);
      window.clearTimeout(copyTimer.current);
    },
    [],
  );

  // On the desktop canvas the card has a fixed height. Rather than shrinking a
  // long excuse, grow the card (and push the buttons down) until it clears them.
  useLayoutEffect(() => {
    const card = cardRef.current;
    const text = cardTextRef.current;
    const actions = cardActionsRef.current;
    if (!card || !text || !actions) return;

    const overlap = () =>
      text.getBoundingClientRect().bottom - actions.getBoundingClientRect().top + CARD_TEXT_GAP;

    const fit = () => {
      card.style.setProperty("--lift", "0px");
      card.style.setProperty("--grow", "0px");
      if (overlap() <= 0) return;
      // First use the blank paper under the header label, then grow the card.
      const maxLift = (CARD_MAX_LIFT * card.offsetWidth) / CARD_WIDTH;
      card.style.setProperty("--lift", `${Math.min(Math.ceil(overlap()), maxLift)}px`);
      const rest = overlap();
      if (rest > 0) card.style.setProperty("--grow", `${Math.ceil(rest)}px`);
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(card);
    document.fonts?.ready.then(fit);
    return () => observer.disconnect();
  }, [excuse]);

  // Each new excuse (first result or ALASAN LAIN) eases the whole card up into
  // place. Animating the existing node keeps focus on the button that was used.
  useEffect(() => {
    const card = cardRef.current;
    if (!card || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const reveal = card.animate(
      [
        { opacity: 0, transform: "translateY(16px)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: REVEAL_MS, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" },
    );
    return () => reveal.cancel();
  }, [excuse]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // The pending timer also guards against a second submit landing before re-render.
    if (status === "loading" || loadingTimer.current !== undefined) return;

    const job = occupation.trim();
    if (!job) {
      fieldRef.current?.focus();
      return;
    }

    setStatus("loading");
    loadingClicks.reset();
    setCopyState("idle");
    loadingTimer.current = window.setTimeout(() => {
      loadingTimer.current = undefined;
      setSubmittedJob(job);
      setExcuse(generateExcuse(job));
      setStatus("result");
    }, LOADING_MS);
  }

  // Enter submits; Shift+Enter still inserts a new line.
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  function handleAnother() {
    if (!excuse) return;
    setExcuse(generateExcuse(submittedJob, excuse));
    setCopyState("idle");
  }

  function handleLoadingClick() {
    if (status !== "loading") return;
    if (loadingClicks.hit()) showToast("BAHKAN MESIN INI TAHU KAMU SEDANG MENUNDA.");
  }

  async function handleCopy() {
    if (!excuse) return;
    window.clearTimeout(copyTimer.current);
    try {
      await navigator.clipboard.writeText(excuseToText(excuse));
      setCopyState("copied");
      copyTimer.current = window.setTimeout(() => setCopyState("idle"), COPY_FEEDBACK_MS);
    } catch {
      setCopyState("error");
    }
  }

  const isLoading = status === "loading";
  const isEmpty = occupation.trim() === "";

  return (
    <>
      <form
        id="form-alasan"
        className={`${styles.abs} ${styles.form}`}
        style={place(78, 998, { w: 508, z: 25 })}
        onSubmit={handleSubmit}
        aria-busy={isLoading}
      >
        <h2 className={styles.formTitle}>
          <span className={styles.formTitleSmall}>SEBAGAI APA ANDA</span>
          <span className={styles.formTitleLarge}> DIKANTOR?</span>
        </h2>
        <div className={styles.formBody}>
          <label htmlFor="pekerjaan" className={styles.formNote}>
            *penting, demi ketepatan solusi!
          </label>
          <div className={styles.formRow}>
            <textarea
              ref={fieldRef}
              id="pekerjaan"
              name="pekerjaan"
              className={styles.formField}
              placeholder="Cantumkan pekerjaan anda"
              maxLength={40}
              value={occupation}
              onChange={(event) => setOccupation(event.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              type="submit"
              className={styles.formSubmit}
              disabled={isLoading || isEmpty}
            >
              SUBMIT
            </button>
          </div>
        </div>
      </form>

      {status === "result" && excuse ? (
        <article
          ref={cardRef}
          className={`${styles.abs} ${styles.sized} ${styles.card}`}
          style={place(562, 1026, { w: 838, h: 698, z: 35 })}
          aria-live="polite"
          aria-label="Alasan hari ini"
        >
          <img
            src="/assets/excuse-card.png"
            alt=""
            width={838}
            height={698}
            className={styles.cardPaper}
          />
          <div ref={cardTextRef} className={styles.cardText} style={place(96, 240.28)}>
            <p className={styles.cardMuted}>{excuse.greeting}</p>
            <p className={styles.cardBody}>{excuse.body}</p>
            <p className={`${styles.cardMuted} ${styles.cardClosing}`}>{excuse.closing}</p>
          </div>
          <div ref={cardActionsRef} className={styles.cardActions} style={place(434, 569, { w: 235.308, h: 52.304 })}>
            <div className={styles.cardActionsRow}>
              <button type="button" className={styles.copyButton} onClick={handleCopy}>
                COPY
              </button>
              <button type="button" className={styles.anotherButton} onClick={handleAnother}>
                <span className={styles.anotherPill}>ALASAN LAIN</span>
                <img
                  src="/assets/arrow-right-circle-dark.svg"
                  alt=""
                  width={32}
                  height={32}
                  className={styles.anotherIcon}
                />
              </button>
            </div>
          </div>
          {copyState === "copied" ? (
            <p className={styles.copyFeedback} style={place(450, 628)} role="status">
              Alasan tersalin.
            </p>
          ) : null}
          {copyState === "error" ? (
            <p
              className={`${styles.copyFeedback} ${styles.copyError}`}
              style={place(450, 628)}
              role="alert"
            >
              Gagal menyalin. Silakan salin manual.
            </p>
          ) : null}
        </article>
      ) : (
        <div
          className={`${styles.abs} ${styles.sized} ${styles.loading} ${isLoading ? styles.loadingBusy : ""}`}
          style={place(812, 1052, { w: 477, h: 477, z: 28 })}
          role="status"
          aria-live="polite"
          onClick={handleLoadingClick}
        >
          <img
            src="/assets/loading-ring.svg"
            alt=""
            width={360.75}
            height={360.75}
            className={styles.loadingRing}
          />
          <p className={styles.loadingText}>
            <span>TUNGGU SESAAT</span>
            {/* All lines share one grid cell, so swapping them never resizes the panel. */}
            <span className={styles.loadingLine}>
              <span className={styles.loadingIdle}>ALASAN SEDANG DIPIKIRKAN..</span>
              {LOADING_MESSAGES.map((message, index) => (
                <span
                  key={message}
                  className={styles.loadingMessage}
                  style={{
                    animationDuration: `${LOADING_MS}ms`,
                    animationDelay: `${(index * LOADING_MS) / LOADING_MESSAGES.length}ms`,
                  }}
                  aria-hidden="true"
                >
                  {message}
                </span>
              ))}
            </span>
          </p>
        </div>
      )}
    </>
  );
}
