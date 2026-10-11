"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import styles from "@/app/page.module.css";
import { excuseToText, generateExcuse, type Excuse } from "./excuses";
import { place } from "./place";

const LOADING_MS = 2000;
const COPY_FEEDBACK_MS = 1600;

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

  useEffect(
    () => () => {
      window.clearTimeout(loadingTimer.current);
      window.clearTimeout(copyTimer.current);
    },
    [],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;

    const job = occupation.trim();
    if (!job) {
      fieldRef.current?.focus();
      return;
    }

    setStatus("loading");
    setCopyState("idle");
    loadingTimer.current = window.setTimeout(() => {
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
          <div className={styles.cardText} style={place(96, 240.28)}>
            <p className={styles.cardMuted}>{excuse.greeting}</p>
            <p className={styles.cardBody}>{excuse.body}</p>
            <p className={`${styles.cardMuted} ${styles.cardClosing}`}>{excuse.closing}</p>
          </div>
          <div className={styles.cardActions} style={place(434, 569, { w: 235.308, h: 52.304 })}>
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
        >
          <img
            src="/assets/loading-ring.svg"
            alt=""
            width={360.75}
            height={360.75}
            className={styles.loadingRing}
          />
          <p className={styles.loadingText}>
            TUNGGU SESAAT
            <br />
            ALASAN SEDANG DIPIKIRKAN..
          </p>
        </div>
      )}
    </>
  );
}
