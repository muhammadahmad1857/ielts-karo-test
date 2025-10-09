"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AnimatePresence } from "framer-motion";
import MarkdownViewer from "@/components/markdown-viewer";

type Question = {
  id: string;
  part: 1 | 2;
  title: string;
  promptMd: string;
  timeSeconds: number;
  minWords?: number;
  imageSrc?: string;
  imageAlt?: string;
};

type Props = {
  title?: string;
  questions: Question[];
  initialRequirePart1ToUnlock?: boolean;
};

export default function ExamWorkspace({
  title = "Exam",
  questions,
  initialRequirePart1ToUnlock = true,
}: Props) {
  // Partition questions by part
  const questionsByPart = useMemo(() => {
    const p1 = questions.filter((q) => q.part === 1);
    const p2 = questions.filter((q) => q.part === 2);
    return { 1: p1, 2: p2 };
  }, [questions]);

  const [activePart, setActivePart] = useState<1 | 2>(1);
  const [requireP1, setRequireP1] = useState<boolean>(
    initialRequirePart1ToUnlock
  );

  // Index per part
  const [indexByPart, setIndexByPart] = useState<Record<1 | 2, number>>({
    1: 0,
    2: 0,
  });

  const activeList = questionsByPart[activePart];
  const activeIndex = indexByPart[activePart] ?? 0;
  const activeQuestion = activeList[activeIndex];

  // Answers, completion, and autosave
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  // Timer
  const [timeLeft, setTimeLeft] = useState<number>(
    activeQuestion?.timeSeconds ?? 0
  );
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Per-part loading and results
  const [loadingByPart, setLoadingByPart] = useState<Record<1 | 2, boolean>>({
    1: false,
    2: false,
  });
  const [resultByPart, setResultByPart] = useState<
    Record<1 | 2, string | undefined>
  >({ 1: undefined, 2: undefined });

  // Session ID
  const [sessionId] = useState<string>(() => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto)
      return crypto.randomUUID();
    return Math.random().toString(36).slice(2);
  });

  // Reset timer when question changes
  useEffect(() => {
    if (!activeQuestion) return;
    setTimeLeft(activeQuestion.timeSeconds);
  }, [activeQuestion]);

  // Tick
  useEffect(() => {
    if (!activeQuestion) return;
    if (timerRef.current) clearInterval(timerRef.current as unknown as number);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          // Time up: mark as complete and try to move next
          onMarkComplete(activeQuestion.id);
          nextQuestion();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current)
        clearInterval(timerRef.current as unknown as number);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeQuestion]);

  // Local storage autosave (simple, per question)
  useEffect(() => {
    const key = `answer:${activeQuestion?.id}`;
    if (!activeQuestion) return;
    const saved =
      typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
    if (saved && !answers[activeQuestion.id]) {
      setAnswers((a) => ({ ...a, [activeQuestion.id]: saved }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeQuestion]);

  useEffect(() => {
    if (!activeQuestion) return;
    const key = `answer:${activeQuestion.id}`;
    const val = answers[activeQuestion.id] ?? "";
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, val);
    }
  }, [answers, activeQuestion]);

  const setAnswer = useCallback((id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }, []);

  const onMarkComplete = useCallback((id: string) => {
    setCompleted((prev) => new Set(prev).add(id));
  }, []);

  // Part completion
  const isPartComplete = useCallback(
    (part: 1 | 2) => {
      const ids = questionsByPart[part].map((q) => q.id);
      return ids.every((id) => completed.has(id));
    },
    [completed, questionsByPart]
  );

  // Build message for a single part
  const buildPartMessage = useCallback(
    (part: 1 | 2) => {
      const lines: string[] = [];
      const list = questionsByPart[part];
      lines.push(`Part ${part}`);
      list.forEach((q, idx) => {
        const text = answers[q.id] ?? "";
        const wc = (text.trim().match(/\b[\w’'-]+\b/g) || []).length;
        lines.push(`Q${part}.${idx + 1}: ${q.title}`);
        lines.push(`Words: ${wc}${q.minWords ? ` (min ${q.minWords})` : ""}`);
        lines.push(text || "(no answer)");
        lines.push("");
      });
      console.log(list, lines);
      return lines.join("\n");
    },
    [answers, questionsByPart]
  );

  // Submit a single part; include first image in that part if present
  const submitPart = useCallback(
    async (part: 1 | 2) => {
      const endpoint =
        "https://n8n.kognifi.ai/webhook/08031e41-944d-481c-814a-23ac0cb1611f/chat";
      const message = buildPartMessage(part);
      const partImages = questionsByPart[part]
        .map((q) => q.imageSrc)
        .filter(Boolean) as string[];
      const hasImage = partImages.length > 0;

      const doFetch = async () => {
        if (hasImage) {
          const form = new FormData();
          form.append("action", "sendMessage");
          form.append("sessionId", sessionId);
          form.append("chatInput", message);
          try {
            const imgSrc = partImages[0];
            const res = await fetch(imgSrc);
            const blob = await res.blob();
            const fileName = imgSrc.split("/").pop() || "upload.jpg";
            form.append("files", blob, fileName);
          } catch {
            // fall back to JSON if image fetch fails
            return fetch(endpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "sendMessage",
                sessionId,
                chatInput: message,
              }),
            });
          }
          return fetch(endpoint, { method: "POST", body: form });
        }
        return fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "sendMessage",
            sessionId,
            chatInput: message,
          }),
        });
      };

      let resp = await doFetch();
      if (!resp.ok) resp = await doFetch();

      const text = await resp.json();

      return { ok: resp.ok, text: text.output };
    },
    [buildPartMessage, questionsByPart, sessionId]
  );

  // Per-question Next click: if this finishes the part, auto-submit and show loader
  const nextQuestion = useCallback(() => {
    setIndexByPart((s) => {
      const curr = s[activePart];
      const max = Math.max(0, questionsByPart[activePart].length - 1);
      const next = Math.min(max, curr + 1);
      return { ...s, [activePart]: next };
    });
  }, [activePart, questionsByPart]);

  const wordCount = useMemo(() => {
    const text = answers[activeQuestion?.id ?? ""] || "";
    const words = (text.trim().match(/\b[\w’'-]+\b/g) || []).length;
    return words;
  }, [answers, activeQuestion?.id]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  // Memoized progress percentage for timer bar
  const progressPct = useMemo(() => {
    if (!activeQuestion || resultByPart[activePart]) return 0;
    const total = activeQuestion.timeSeconds || 1;
    const pct = (timeLeft / total) * 100;
    return Math.max(0, Math.min(100, pct));
  }, [timeLeft, activeQuestion, resultByPart, activePart]);

  return (
    <div className="mx-auto max-w-[1200px] p-4 sm:p-6">
      {/* Header */}
      <header className="mb-4 flex flex-col gap-3 rounded-lg border bg-card p-3 sm:p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div
            className="h-8 w-8 rounded-md bg-primary/10 ring-1 ring-primary/20"
            aria-hidden
          />
          <div>
            <h1 className="text-balance text-lg font-semibold leading-tight">
              {title}
            </h1>
            <p className="text-xs text-muted-foreground">
              Practice mode with per-question timer
            </p>
          </div>
        </div>

        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          <label className="flex items-center gap-2 text-xs sm:text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 accent-[var(--color-primary)]"
              checked={requireP1}
              onChange={(e) => setRequireP1(e.target.checked)}
              aria-label="Require finishing Part 1 before Part 2"
            />
            <span className="text-muted-foreground">
              Lock Part 2 until Part 1 done
            </span>
          </label>

          <div className="hidden sm:block h-6 w-px bg-border" aria-hidden />
          <div className="text-right">
            <div className={cn("text-xs text-muted-foreground")}>
              Time remaining
            </div>
            <div className="font-mono text-base">
              {resultByPart[activePart] ? "--:--" : formatTime(timeLeft)}
            </div>
          </div>
        </div>
      </header>

      {/* Part switcher */}
      <nav className="mb-3 flex items-center gap-2">
        <PartTab
          label={`Part 1 (${questionsByPart[1].length})`}
          active={activePart === 1}
          onClick={() => setActivePart(1)}
        />
        <PartTab
          label={`Part 2 (${questionsByPart[2].length})`}
          active={activePart === 2}
          disabled={requireP1 && !isPartComplete(1)}
          onClick={() => setActivePart(2)}
        />
        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          <span>Completed:</span>
          <span className="font-medium">
            {
              Array.from(completed).filter((id) =>
                questions.some((q) => q.id === id && q.part === activePart)
              ).length
            }
            /{questionsByPart[activePart].length}
          </span>
        </div>
      </nav>

      {/* Timer progress */}
      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: "100%" }}
          animate={{ width: `${progressPct}%` }}
          transition={{ ease: "easeOut", duration: 0.4 }}
          aria-label="Time progress"
        />
      </div>

      {/* Main content area with per-part loader/result */}
      <AnimatePresence mode="wait">
        {loadingByPart[activePart] ? (
          <motion.div
            key={`loading-${activePart}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-[320px] items-center justify-center rounded-lg border bg-card p-8"
          >
            <div className="flex flex-col items-center gap-3">
              <Spinner className="h-6 w-6 text-primary" />
              <p className="text-sm text-muted-foreground">
                Evaluating Part {activePart}…
              </p>
            </div>
          </motion.div>
        ) : resultByPart[activePart] ? (
          <motion.section
            key={`result-${activePart}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="rounded-lg border bg-card p-4 md:p-5"
          >
            <h2 className="mb-3 text-pretty text-base font-semibold">
              Result • Part {activePart}
            </h2>
            <div className="prose prose-sm md:prose-base max-w-none">
              <MarkdownViewer markdown={resultByPart[activePart] || ""} />
            </div>
            {activePart === 1 ? (
              <div className="mt-4">
                <Button onClick={() => requireP1 && setActivePart(2 as const)}>
                  Go to Part 2
                </Button>
              </div>
            ) : null}
          </motion.section>
        ) : (
          <motion.section
            key={activeQuestion?.id}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            {/* Prompt */}
            <article className="rounded-lg border bg-card p-4 md:p-5">
              <h2 className="mb-3 text-pretty text-base font-semibold">
                {activeQuestion.title}
              </h2>
              <div className="max-h-[50vh] overflow-auto pr-1 md:max-h-[65vh]">
                <MarkdownViewer markdown={activeQuestion.promptMd} />
                {activeQuestion.imageSrc ? (
                  <motion.figure
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    className="mt-3"
                  >
                    <img
                      src={
                        activeQuestion.imageSrc ||
                        "/placeholder.svg?height=240&width=480&query=question-image"
                      }
                      alt={activeQuestion.imageAlt || "Question related image"}
                      className="w-full rounded-md border bg-muted object-contain"
                    />
                    {activeQuestion.imageAlt ? (
                      <figcaption className="mt-1 text-xs text-muted-foreground">
                        {activeQuestion.imageAlt}
                      </figcaption>
                    ) : null}
                  </motion.figure>
                ) : null}
              </div>
            </article>

            {/* Answer editor */}
            <section className="flex h-full flex-col rounded-lg border bg-card">
              <div className="flex items-center justify-between gap-3 border-b p-3">
                <div className="text-xs text-muted-foreground">
                  Question {activeIndex + 1} of {activeList.length}
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {activeQuestion.minWords ? (
                    <span
                      className={cn(
                        "rounded-md px-2 py-1",
                        (answers[activeQuestion.id] ?? "").trim().split(/\s+/)
                          .length >= activeQuestion.minWords
                          ? "bg-muted text-foreground"
                          : "bg-destructive/10 text-destructive"
                      )}
                    >
                      {
                        (answers[activeQuestion.id] ?? "").trim().split(/\s+/)
                          .length
                      }{" "}
                      / {activeQuestion.minWords} words
                    </span>
                  ) : (
                    <span className="rounded-md bg-muted px-2 py-1">
                      {
                        (answers[activeQuestion.id] ?? "").trim().split(/\s+/)
                          .length
                      }{" "}
                      words
                    </span>
                  )}
                </div>
              </div>
              <label htmlFor="answer" className="sr-only">
                Your answer
              </label>
              <textarea
                id="answer"
                className={cn(
                  "min-h-[260px] flex-1 resize-none bg-transparent p-4 font-sans leading-relaxed outline-none",
                  "placeholder:text-muted-foreground/70"
                )}
                placeholder="Start typing your answer here…"
                value={answers[activeQuestion.id] ?? ""}
                onChange={(e) => setAnswer(activeQuestion.id, e.target.value)}
                disabled={timeLeft <= 0}
                aria-describedby="answer-help"
              />
              <div
                id="answer-help"
                className="flex items-center justify-between gap-3 border-t p-3 text-xs text-muted-foreground"
              >
                <span>
                  {timeLeft <= 0
                    ? "Time is up for this question."
                    : "Your work is autosaved locally."}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setAnswer(activeQuestion.id, "")}
                    className="px-3"
                  >
                    Clear
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={async () => {
                      onMarkComplete(activeQuestion.id);
                      const part = activePart;
                      const willBeComplete = questionsByPart[part].every((q) =>
                        q.id === activeQuestion.id ? true : completed.has(q.id)
                      );
                      if (willBeComplete && !resultByPart[part]) {
                        setLoadingByPart((s) => ({ ...s, [part]: true }));
                        const res = await submitPart(part);
                        setResultByPart((s) => ({ ...s, [part]: res.text }));
                        setLoadingByPart((s) => ({ ...s, [part]: false }));
                      } else {
                        nextQuestion();
                      }
                    }}
                    className="px-3"
                  >
                    {activeIndex === activeList.length - 1
                      ? "Mark Done"
                      : "Save & Next"}
                  </Button>
                </div>
              </div>
            </section>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Part footer */}
      <footer className="mt-4 flex flex-col gap-3 rounded-lg border bg-card p-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {activeList.map((q, i) => {
            const isActive = i === activeIndex;
            const isDone = completed.has(q.id);
            return (
              <button
                key={q.id}
                onClick={() =>
                  setIndexByPart((s) => ({ ...s, [activePart]: i }))
                }
                className={cn(
                  "h-8 rounded-md border px-3 text-xs transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted",
                  isDone && !isActive ? "ring-1 ring-primary/30" : ""
                )}
                aria-current={isActive ? "true" : "false"}
                aria-label={`Go to question ${i + 1}${
                  isDone ? ", completed" : ""
                }`}
              >
                {activePart}.{i + 1}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isPartComplete(activePart) ? "default" : "secondary"}
            onClick={async () => {
              // Mark all in part done
              const ids = questionsByPart[activePart].map((q) => q.id);
              setCompleted((prev) => {
                const next = new Set(prev);
                ids.forEach((id) => next.add(id));
                return next;
              });

              // If not already submitted for this part, submit now
              if (!resultByPart[activePart]) {
                setLoadingByPart((s) => ({ ...s, [activePart]: true }));
                const res = await submitPart(activePart);
                setResultByPart((s) => ({ ...s, [activePart]: res.text }));
                setLoadingByPart((s) => ({ ...s, [activePart]: false }));
              }

              // Move to next part if applicable
              if (activePart === 1 && (requireP1 || true)) {
                setActivePart(2);
              }
            }}
          >
            Finish Part {activePart}
          </Button>
        </div>
      </footer>
    </div>
  );
}

function PartTab({
  label,
  active,
  disabled,
  onClick,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-8 rounded-md border px-3 text-xs transition-colors",
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-card",
        disabled ? "opacity-50 cursor-not-allowed" : ""
      )}
      aria-pressed={active ? "true" : "false"}
    >
      {label}
    </button>
  );
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin", className)}
      viewBox="0 0 24 24"
      role="status"
      aria-label="Loading"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}
