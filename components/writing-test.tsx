// // "use client";

// // import type React from "react";

// // import { useEffect, useMemo, useState } from "react";
// // import { Button } from "@/components/ui/button";
// // import { cn } from "@/lib/utils";
// // import { MarkdownRenderer } from "./markdown-renderer";
// // import { FlipTimer } from "./flip-timer";
// // import Spinner from "./Loader";

// // type Question = {
// //   part: string;
// //   question: string;
// //   word_count: number;
// //   questionImg?: string;
// // };

// // type Props = {
// //   questions: Question[];
// //   time: number; // seconds
// //   examType?: "Academic" | "General" | string;
// // };

// // type PartState = {
// //   text: string;
// //   done: boolean;
// //   warning: string | null;
// //   previewMarkdown: string | null; // local preview (user content) before API
// //   submitting?: boolean;
// //   feedback?: string | null;
// //   error?: string | null;
// // };

// // const API_ENDPOINT =
// //   "https://n8n.kognifi.ai/webhook/08031e41-944d-481c-814a-23ac0cb1611f/chat";

// // function countWords(s: string) {
// //   const t = s.trim();
// //   if (!t) return 0;
// //   return t.split(/\s+/).filter(Boolean).length;
// // }

// // function minWordsFor(partLabel: string) {
// //   // Enforce strict minima regardless of provided word_count
// //   return /part\s*2/i.test(partLabel) ? 200 : 120;
// // }

// // function useCountdown(totalSeconds: number, isLocked: boolean) {
// //   const [left, setLeft] = useState(totalSeconds);
// //   useEffect(() => {
// //     if (isLocked) return;
// //     if (left <= 0) return;
// //     const id = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
// //     return () => clearInterval(id);
// //   }, [left, isLocked]);
// //   return left;
// // }

// // function formatTime(seconds: number) {
// //   const m = Math.floor(seconds / 60);
// //   const s = seconds % 60;
// //   return `${m}:${s.toString().padStart(2, "0")}`;
// // }

// // function buildChatInputForPart(q: Question, answer: string, examType?: string) {
// //   const words = countWords(answer);
// //   return [
// //     "## Part",
// //     `${q.part} ${examType ? `(${examType})` : ""}`.trim(),
// //     "",
// //     "## Question",
// //     q.question,
// //     "",
// //     "## Answer",
// //     answer,
// //     "",
// //     "## Word count",
// //     `word count: ${words}`,
// //   ].join("\n");
// // }

// // export default function WritingTest({ questions, time, examType }: Props) {
// //   const [active, setActive] = useState(0);
// //   const [parts, setParts] = useState<PartState[]>(
// //     () =>
// //       questions.map(() => ({
// //         text: "",
// //         done: false,
// //         warning: null,
// //         previewMarkdown: null,
// //         submitting: false,
// //         feedback: null,
// //         error: null,
// //       })) as PartState[]
// //   );
// //   const [splits, setSplits] = useState<number[]>(() => questions.map(() => 45));

// //   const [failed, setFailed] = useState(false);
// //   const [sessionId] = useState<string>(() => crypto.randomUUID());

// //   const allDone = useMemo(() => parts.every((p) => p.done), [parts]);

// //   const timeLeft = useCountdown(time, failed || allDone);
// //   const total = Math.max(1, time); // avoid div by zero
// //   const progress = Math.max(
// //     0,
// //     Math.min(100, (100 * (total - timeLeft)) / total)
// //   );

// //   useEffect(() => {
// //     if (timeLeft === 0 && !parts.every((p) => p.done)) {
// //       setFailed(true);
// //     }
// //   }, [timeLeft, parts]);

// //   async function submitPart(idx: number) {
// //     const q = questions[idx];
// //     const answer = parts[idx].text;
// //     const chatInput = buildChatInputForPart(q, answer, examType);
// //     const imgPath = q.questionImg || "/images/reference.png";

// //     setParts((prev) => {
// //       const next = [...prev];
// //       next[idx] = { ...next[idx], submitting: true, error: null };
// //       return next;
// //     });

// //     try {
// //       let res: Response;
// //       if (imgPath) {
// //         const form = new FormData();
// //         form.append("action", "sendMessage");
// //         form.append("sessionId", sessionId);
// //         form.append("chatInput", chatInput);
// //         const imgResp = await fetch(imgPath, { cache: "no-store" });
// //         const blob = await imgResp.blob();
// //         const fileName = imgPath.split("/").pop() || "upload.png";
// //         form.append(
// //           "files",
// //           new File([blob], fileName, { type: blob.type || "image/png" })
// //         );
// //         res = await fetch(API_ENDPOINT, { method: "POST", body: form });
// //       } else {
// //         res = await fetch(API_ENDPOINT, {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify({ action: "sendMessage", sessionId, chatInput }),
// //         });
// //       }

// //       let text = await res.json();
// //       if (!res.ok) {
// //         // retry once as plain JSON
// //         const retry = await fetch(API_ENDPOINT, {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify({ action: "sendMessage", sessionId, chatInput }),
// //         }).catch(() => null);
// //         text = retry ? await retry.json() : text || "Submission failed.";
// //         setParts((prev) => {
// //           const next = [...prev];
// //           next[idx] = {
// //             ...next[idx],
// //             feedback: text.output || "Submission failed.",
// //             submitting: false,
// //           };
// //           return next;
// //         });
// //       } else {
// //         setParts((prev) => {
// //           const next = [...prev];
// //           next[idx] = {
// //             ...next[idx],
// //             feedback: text.output || "OK",
// //             submitting: false,
// //           };
// //           return next;
// //         });
// //       }
// //     } catch (e) {
// //       setParts((prev) => {
// //         const next = [...prev];
// //         next[idx] = {
// //           ...next[idx],
// //           error: "Unexpected error during submission.",
// //           submitting: false,
// //         };
// //         return next;
// //       });
// //     }
// //   }

// //   function onMarkDone(idx: number) {
// //     const required = minWordsFor(questions[idx].part);
// //     const words = countWords(parts[idx].text);
// //     if (words < required) {
// //       setParts((prev) => {
// //         const next = [...prev];
// //         next[idx] = {
// //           ...next[idx],
// //           warning: `Minimum ${required} words required to submit.`,
// //         };
// //         return next;
// //       });
// //       return;
// //     }
// //     setParts((prev) => {
// //       const next = [...prev];
// //       next[idx] = {
// //         ...next[idx],
// //         done: true,
// //         warning: null,
// //         previewMarkdown: prev[idx].text,
// //       };
// //       return next;
// //     });
// //     submitPart(idx);
// //   }

// //   function onChangeText(idx: number, val: string) {
// //     setParts((prev) => {
// //       const next = [...prev];
// //       next[idx] = { ...next[idx], text: val, warning: null };
// //       return next;
// //     });
// //   }

// //   function onClear(idx: number) {
// //     setParts((prev) => {
// //       const next = [...prev];
// //       next[idx] = { ...next[idx], text: "", warning: null };
// //       return next;
// //     });
// //   }

// //   function useDragSplit(activeIdx: number) {
// //     const [dragging, setDragging] = useState(false);
// //     const onMouseDown = (e: React.MouseEvent) => {
// //       e.preventDefault();
// //       setDragging(true);
// //     };
// //     useEffect(() => {
// //       function onMove(ev: MouseEvent) {
// //         if (!dragging) return;
// //         const container = document.getElementById(
// //           "done-split-container-" + activeIdx
// //         );
// //         if (!container) return;
// //         const rect = container.getBoundingClientRect();
// //         const x = ev.clientX - rect.left;
// //         const pct = Math.max(25, Math.min(75, (x / rect.width) * 100));
// //         setSplits((prev) => {
// //           const next = [...prev];
// //           next[activeIdx] = pct;
// //           return next;
// //         });
// //       }
// //       function onUp() {
// //         setDragging(false);
// //       }
// //       window.addEventListener("mousemove", onMove);
// //       window.addEventListener("mouseup", onUp);
// //       return () => {
// //         window.removeEventListener("mousemove", onMove);
// //         window.removeEventListener("mouseup", onUp);
// //       };
// //     }, [dragging, activeIdx]);
// //     return { onMouseDown };
// //   }

// //   const current = questions[active];
// //   const state = parts[active];
// //   const requiredWords = minWordsFor(current.part);
// //   const currentCount = countWords(state.text);
// //   const canSubmit = currentCount >= requiredWords && !state.done && !failed;

// //   const { onMouseDown } = useDragSplit(active);

// //   return (
// //     <div className="mx-auto h-screen w-[80vw] max-w-[1024px]">
// //       <header className="flex h-16 items-center justify-between gap-4 rounded-lg border bg-card px-4 shadow-sm">
// //         <h1 className="text-base font-semibold text-primary">Writing Test</h1>
// //         <div className="flex items-center gap-3">
// //           <FlipTimer seconds={timeLeft} progress={progress} />
// //         </div>
// //       </header>

// //       {questions.length > 1 && (
// //         <nav className="mt-3 flex w-full items-center gap-2">
// //           {questions.map((q, i) => {
// //             const done = parts[i]?.done;
// //             return (
// //               <button
// //                 key={q.part}
// //                 type="button"
// //                 onClick={() => setActive(i)}
// //                 className={cn(
// //                   "flex-1 rounded-md px-3 py-1.5 text-sm text-center transition-colors",
// //                   active === i
// //                     ? "bg-primary text-primary-foreground"
// //                     : "bg-secondary text-secondary-foreground hover:bg-accent"
// //                 )}
// //                 aria-current={active === i ? "page" : undefined}
// //               >
// //                 {q.part} {done ? "✓" : ""}
// //               </button>
// //             );
// //           })}
// //           <div className="ml-auto hidden text-xs text-muted-foreground md:block">
// //             Minimum: Part 1 = 120 words • Part 2 = 200 words
// //           </div>
// //         </nav>
// //       )}

// //       <main className="mt-3 grid h-[calc(100vh-6rem)] grid-cols-1 gap-4 md:grid-cols-2">
// //         {/* Prompt panel */}
// //         <section className="flex h-full flex-col overflow-hidden rounded-lg border bg-card p-4 shadow-sm">
// //           <h2 className="mb-2 text-sm font-medium text-muted-foreground">
// //             {current.part} • Read the task
// //           </h2>
// //           <div className="scrollbar-thin flex-1 overflow-auto">
// //             <MarkdownRenderer content={current.question} />
// //             {current.questionImg && (
// //               <div className="mt-4">
// //                 <img
// //                   src={current.questionImg || "/placeholder.svg"}
// //                   alt={`${current.part} prompt image`}
// //                   className="h-auto w-full rounded-md border object-contain"
// //                 />
// //               </div>
// //             )}
// //           </div>
// //         </section>

// //         {/* Work panel */}
// //         <section className="flex h-full flex-col overflow-hidden rounded-lg border bg-card p-4 shadow-sm">
// //           <div className="mb-3 flex items-center justify-between">
// //             <div className="text-sm text-muted-foreground">
// //               Minimum {requiredWords} words
// //             </div>
// //             <div
// //               className={cn(
// //                 "text-sm",
// //                 currentCount >= requiredWords
// //                   ? "text-primary"
// //                   : "text-muted-foreground"
// //               )}
// //               aria-live="polite"
// //             >
// //               {currentCount} / {requiredWords} words
// //             </div>
// //           </div>

// //           {failed ? (
// //             <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-destructive">
// //               You failed the test
// //             </div>
// //           ) : state.done ? (
// //             state.submitting ? (
// //               <div className="flex-1 flex justify-center flex-col items-center overflow-auto rounded-md border bg-popover p-3 text-sm text-muted-foreground">
// //                 Submitting your response for {current.part}…
// //                 <Spinner />
// //               </div>
// //             ) : (
// //               <div
// //                 id={`done-split-container-${active}`}
// //                 className="grid h-full overflow-hidden rounded-md border bg-popover"
// //               >
// //                 {/* Left column: Question + Answer (stack) */}
// //                 {/* <div className="flex min-w-[220px] flex-col gap-3 overflow-auto p-3">
// //                   <div className="rounded-md border bg-background p-3">
// //                     <h3 className="mb-2 text-sm font-medium">Question</h3>
// //                     <p className="text-sm leading-relaxed">
// //                       {current.question}
// //                     </p>
// //                   </div>
// //                   <div className="rounded-md border bg-background p-3">
// //                     <h3 className="mb-2 text-sm font-medium">Answer</h3>
// //                     <MarkdownRenderer content={state.previewMarkdown ?? ""} />
// //                   </div>
// //                 </div>

// //                 <div
// //                   role="separator"
// //                   aria-orientation="vertical"
// //                   onMouseDown={onMouseDown}
// //                   className="mx-[-1px] w-1 cursor-col-resize bg-border"
// //                 /> */}

// //                 {/* Right column: Feedback (bigger by default) */}
// //                 <div className="min-w-[full] overflow-auto p-3">
// //                   <div className="rounded-md border bg-background p-3">
// //                     <h3 className="mb-2 text-sm font-medium">Feedback</h3>
// //                     {state.error ? (
// //                       <p className="text-sm text-destructive">{state.error}</p>
// //                     ) : state.feedback ? (
// //                       <MarkdownRenderer content={state.feedback} />
// //                     ) : (
// //                       <p className="text-sm text-muted-foreground">
// //                         Waiting for feedback…
// //                       </p>
// //                     )}
// //                   </div>
// //                 </div>
// //               </div>
// //             )
// //           ) : (
// //             <>
// //               <label htmlFor="answer" className="sr-only">
// //                 {current.part} answer
// //               </label>
// //               <textarea
// //                 id="answer"
// //                 className="min-h-0 flex-1 resize-none rounded-md border bg-background p-3 text-sm leading-relaxed outline-none ring-0 focus:outline-none"
// //                 placeholder="Start writing here…"
// //                 value={state.text}
// //                 onChange={(e) => onChangeText(active, e.target.value)}
// //                 spellCheck={false}
// //                 autoCorrect="off"
// //                 autoCapitalize="off"
// //                 autoComplete="off"
// //                 inputMode="text"
// //                 data-gramm="false"
// //                 aria-describedby={state.warning ? "warning" : undefined}
// //               />
// //               {state.warning && (
// //                 <p id="warning" className="mt-2 text-sm text-destructive">
// //                   {state.warning}
// //                 </p>
// //               )}
// //               <div className="mt-3 flex items-center justify-end gap-2">
// //                 <Button
// //                   variant="secondary"
// //                   type="button"
// //                   onClick={() => onClear(active)}
// //                   className="min-w-20"
// //                 >
// //                   Clear
// //                 </Button>
// //                 <Button
// //                   type="button"
// //                   onClick={() => onMarkDone(active)}
// //                   disabled={!canSubmit}
// //                   className="min-w-28"
// //                 >
// //                   Mark Done
// //                 </Button>
// //               </div>
// //             </>
// //           )}
// //         </section>
// //       </main>
// //     </div>
// //   );
// // }

// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";
// import { MarkdownRenderer } from "./markdown-renderer";
// import { FlipTimer } from "./flip-timer";
// import Spinner from "./Loader";

// type Question = {
//   part: string;
//   question: string;
//   word_count: number;
//   questionImg?: string;
// };

// type Props = {
//   questions: Question[];
//   time: number; // seconds
//   examType?: "Academic" | "General" | string;
// };

// type PartState = {
//   text: string;
//   done: boolean;
//   warning: string | null;
//   previewMarkdown: string | null;
//   submitting?: boolean;
//   feedback?: string | null;
//   error?: string | null;
// };

// const API_ENDPOINT =
//   "https://n8n.kognifi.ai/webhook/08031e41-944d-481c-814a-23ac0cb1611f/chat";
// // "https://n8n.kognifi.ai/webhook/08031e41-944d-481c-814a-23ac0cb1611f/chat";

// function countWords(s: string) {
//   const t = s.trim();
//   return t ? t.split(/\s+/).filter(Boolean).length : 0;
// }

// function minWordsFor(partLabel: string) {
//   return /part\s*2/i.test(partLabel) ? 200 : 120;
// }

// function buildChatInputForPart(q: Question, answer: string, examType?: string) {
//   const words = countWords(answer);
//   return [
//     "## Part",
//     `${q.part} ${examType ? `(${examType})` : ""}`.trim(),
//     "",
//     "## Question",
//     q.question,
//     "",
//     "## Answer",
//     answer,
//     "",
//     "## Word count",
//     `word count: ${words}`,
//   ].join("\n");
// }

// export default function WritingTest({ questions, time, examType }: Props) {
//   const [active, setActive] = useState(0);
//   const [parts, setParts] = useState<PartState[]>(
//     questions.map(() => ({
//       text: "",
//       done: false,
//       warning: null,
//       previewMarkdown: null,
//       submitting: false,
//       feedback: null,
//       error: null,
//     }))
//   );

//   const [failed, setFailed] = useState(false);
//   const [sessionId] = useState(() => crypto.randomUUID());
//   const allDone = useMemo(() => parts.every((p) => p.done), [parts]);
//   const timeLeft = useCountdown(time, failed || allDone);
//   const total = Math.max(1, time);
//   const progress = Math.max(
//     0,
//     Math.min(100, (100 * (total - timeLeft)) / total)
//   );

//   useEffect(() => {
//     if (timeLeft === 0 && !allDone) setFailed(true);
//   }, [timeLeft, allDone]);

//   async function submitPart(idx: number) {
//     const q = questions[idx];
//     const answer = parts[idx].text;
//     const chatInput = buildChatInputForPart(q, answer, examType);
//     const imgPath = q.questionImg;

//     setParts((prev) => {
//       const next = [...prev];
//       next[idx] = { ...next[idx], submitting: true, error: null };
//       return next;
//     });

//     try {
//       let res: Response;
//       if (imgPath) {
//         const form = new FormData();
//         form.append("action", "sendMessage");
//         form.append("sessionId", sessionId);
//         form.append("chatInput", chatInput);
//         const imgResp = await fetch(imgPath, { cache: "no-store" });
//         const blob = await imgResp.blob();
//         form.append(
//           "files",
//           new File([blob], "question.png", { type: blob.type })
//         );
//         res = await fetch(API_ENDPOINT, { method: "POST", body: form });
//       } else {
//         res = await fetch(API_ENDPOINT, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ action: "sendMessage", sessionId, chatInput }),
//         });
//       }

//       const data = await res.json();
//       const feedback = data.output || "No feedback returned.";

//       setParts((prev) => {
//         const next = [...prev];
//         next[idx] = { ...next[idx], feedback, submitting: false };
//         return next;
//       });
//     } catch {
//       setParts((prev) => {
//         const next = [...prev];
//         next[idx] = {
//           ...next[idx],
//           error: "Unexpected error during submission.",
//           submitting: false,
//         };
//         return next;
//       });
//     }
//   }

//   function onMarkDone(idx: number) {
//     const required = minWordsFor(questions[idx].part);
//     const words = countWords(parts[idx].text);
//     if (words < required) {
//       setParts((prev) => {
//         const next = [...prev];
//         next[idx] = {
//           ...next[idx],
//           warning: `Minimum ${required} words required to submit.`,
//         };
//         return next;
//       });
//       return;
//     }
//     setParts((prev) => {
//       const next = [...prev];
//       next[idx] = {
//         ...next[idx],
//         done: true,
//         warning: null,
//         previewMarkdown: prev[idx].text,
//       };
//       return next;
//     });
//     submitPart(idx);
//   }

//   function onChangeText(idx: number, val: string) {
//     setParts((prev) => {
//       const next = [...prev];
//       next[idx] = { ...next[idx], text: val, warning: null };
//       return next;
//     });
//   }

//   function onClear(idx: number) {
//     setParts((prev) => {
//       const next = [...prev];
//       next[idx] = { ...next[idx], text: "", warning: null };
//       return next;
//     });
//   }

//   const current = questions[active];
//   const state = parts[active];
//   const requiredWords = minWordsFor(current.part);
//   const currentCount = countWords(state.text);
//   const canSubmit = currentCount >= requiredWords && !state.done && !failed;

//   return (
//     <div className="mx-auto h-screen w-[80vw] max-w-[1024px]">
//       <header className="flex h-16 items-center justify-between gap-4 rounded-lg border bg-card px-4 shadow-sm">
//         <h1 className="text-base font-semibold text-primary">Writing Test</h1>
//         <FlipTimer seconds={timeLeft} progress={progress} />
//       </header>

//       {questions.length > 1 && (
//         <nav className="mt-3 flex w-full items-center gap-2">
//           {questions.map((q, i) => (
//             <button
//               key={q.part}
//               type="button"
//               onClick={() => setActive(i)}
//               className={cn(
//                 "flex-1 rounded-md px-3 py-1.5 text-sm text-center transition-colors",
//                 active === i
//                   ? "bg-primary text-primary-foreground"
//                   : "bg-secondary text-secondary-foreground hover:bg-accent"
//               )}
//             >
//               {q.part} {parts[i]?.done ? "✓" : ""}
//             </button>
//           ))}
//           <div className="ml-auto hidden text-xs text-muted-foreground md:block">
//             Minimum: Part 1 = 120 words • Part 2 = 200 words
//           </div>
//         </nav>
//       )}

//       <main className="mt-3 grid h-[calc(100vh-6rem)] grid-cols-1 gap-4 md:grid-cols-2">
//         <section className="flex h-full flex-col overflow-auto rounded-lg border bg-card p-4 shadow-sm space-y-4">
//           <h2 className="text-sm font-medium text-muted-foreground">
//             {current.part} • Question
//           </h2>
//           <MarkdownRenderer content={current.question} />
//           {current.questionImg && (
//             <img
//               src={current.questionImg}
//               alt={`${current.part} prompt`}
//               className="h-auto w-full rounded-md border object-contain"
//             />
//           )}

//           {state.done && !state.submitting && (
//             <div className="rounded-md border bg-background p-3">
//               <h3 className="mb-2 text-sm font-medium">Your Answer</h3>
//               <MarkdownRenderer content={state.previewMarkdown ?? ""} />
//             </div>
//           )}
//         </section>
//         {/* Left panel */}
//         <section className="flex h-full flex-col overflow-hidden rounded-lg border bg-card p-4 shadow-sm">
//           {!state.done ? (
//             <>
//               <h2 className="mb-2 text-sm font-medium text-muted-foreground">
//                 Your Answer
//               </h2>
//               <textarea
//                 className="flex-1 resize-none rounded-md border bg-background p-3 text-sm leading-relaxed outline-none"
//                 placeholder="Start writing here…"
//                 value={state.text}
//                 onChange={(e) => onChangeText(active, e.target.value)}
//                 spellCheck={false}
//                 autoCorrect="off"
//                 autoCapitalize="off"
//                 autoComplete="off"
//                 data-gramm="false"
//               />
//               {state.warning && (
//                 <p className="mt-2 text-sm text-destructive">{state.warning}</p>
//               )}
//               <div className="mt-3 flex items-center justify-end gap-2">
//                 <Button
//                   variant="secondary"
//                   onClick={() => onClear(active)}
//                   className="min-w-20"
//                 >
//                   Clear
//                 </Button>
//                 <Button
//                   onClick={() => onMarkDone(active)}
//                   disabled={!canSubmit}
//                   className="min-w-28"
//                 >
//                   Mark Done
//                 </Button>
//               </div>
//             </>
//           ) : (
//             <>
//               <h2 className="mb-2 text-sm font-medium text-muted-foreground">
//                 Feedback
//               </h2>
//               <div className="flex-1 overflow-auto">
//                 {state.submitting ? (
//                   <div className="flex flex-1 flex-col items-center justify-center">
//                     <Spinner />
//                     <p className="mt-2 text-sm text-muted-foreground">
//                       Submitting your response for {current.part}…
//                     </p>
//                   </div>
//                 ) : state.error ? (
//                   <p className="text-sm text-destructive">{state.error}</p>
//                 ) : (
//                   <MarkdownRenderer
//                     content={state.feedback ?? "Waiting for feedback…"}
//                   />
//                 )}
//               </div>
//             </>
//           )}
//         </section>

//         {/* Right panel */}
//       </main>
//     </div>
//   );
// }

// "use client";
// import { useEffect, useState } from "react";
// import { FlipTimer } from "./flip-timer";
// import AnswerPanel from "./AnswerPanel";
// import { countWords, minWordsFor, buildChatInputForPart } from "@/lib/utils";
// import { MarkdownRenderer } from "./markdown-renderer";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
// import useCountdown from "@/hooks/useCountdown";

// type Question = {
//   part: string;
//   question: string;
//   word_count: number;
//   questionImg?: string;
// };

// type PartState = {
//   text: string;
//   done: boolean;
//   warning: string | null;
//   previewMarkdown: string | null;
//   submitting?: boolean;
//   feedback?: string | null;
//   error?: string | null;
// };

// const API_ENDPOINT =
//   "https://n8n.kognifi.ai/webhook/08031e41-944d-481c-814a-23ac0cb1611f/chat";

// export default function WritingTest({
//   questions,
//   time,
//   examType,
// }: {
//   questions: Question[];
//   time: number;
//   examType?: string;
// }) {
//   const router = useRouter();
//   const { left: timeLeft } = useCountdown(time, false);

//   const [active, setActive] = useState(0);
//   const [parts, setParts] = useState<PartState[]>(
//     questions.map(() => ({
//       text: "",
//       done: false,
//       warning: null,
//       previewMarkdown: null,
//       submitting: false,
//       feedback: null,
//       error: null,
//     }))
//   );
//   const [sessionId] = useState(() => crypto.randomUUID());
//   useEffect(() => {
//     if (timeLeft > 0) return; // only run when time reaches 0

//     // Check which parts can be submitted
//     const unfinishedParts = parts
//       .map((p, idx) => ({ ...p, idx }))
//       .filter((p) => !p.done);

//     let hasFailedPart = false;

//     unfinishedParts.forEach((p) => {
//       const minWords = minWordsFor(questions[p.idx].part);
//       const words = countWords(p.text);

//       if (words >= minWords) {
//         // Auto-submit valid part
//         onMarkDone(p.idx);
//       } else {
//         // Word count not met → fail
//         hasFailedPart = true;
//       }
//     });

//     if (hasFailedPart) {
//       alert(
//         "Time is up! You failed the test because word count criteria were not met."
//       );
//       router.push("/"); // redirect to home page
//     }
//   }, [timeLeft]);

//   function onChangeText(idx: number, val: string) {
//     setParts((prev) => {
//       const next = [...prev];
//       next[idx] = { ...next[idx], text: val, warning: null };
//       return next;
//     });
//   }

//   function onClear(idx: number) {
//     setParts((prev) => {
//       const next = [...prev];
//       next[idx] = { ...next[idx], text: "", warning: null };
//       return next;
//     });
//   }

//   async function submitPart(idx: number) {
//     const q = questions[idx];
//     const answer = parts[idx].text;
//     const chatInput = buildChatInputForPart(q, answer, examType);

//     setParts((prev) => {
//       const next = [...prev];
//       next[idx] = { ...next[idx], submitting: true, error: null };
//       return next;
//     });

//     try {
//       const res = await fetch(API_ENDPOINT, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ action: "sendMessage", sessionId, chatInput }),
//       });
//       const data = await res.json();
//       const feedback = data.output || "No feedback returned.";

//       setParts((prev) => {
//         const next = [...prev];
//         next[idx] = { ...next[idx], feedback, submitting: false };
//         return next;
//       });
//     } catch {
//       setParts((prev) => {
//         const next = [...prev];
//         next[idx] = {
//           ...next[idx],
//           error: "Unexpected error.",
//           submitting: false,
//         };
//         return next;
//       });
//     }
//   }

//   function onMarkDone(idx: number) {
//     const required = minWordsFor(questions[idx].part);
//     const words = countWords(parts[idx].text);
//     if (words < required) {
//       setParts((prev) => {
//         const next = [...prev];
//         next[idx] = {
//           ...next[idx],
//           warning: `Minimum ${required} words required.`,
//         };
//         return next;
//       });
//       return;
//     }

//     setParts((prev) => {
//       const next = [...prev];
//       next[idx] = { ...next[idx], done: true, previewMarkdown: prev[idx].text };
//       return next;
//     });

//     submitPart(idx);
//   }

//   function onRetry(idx: number) {
//     submitPart(idx);
//   }

//   function onFinishTest() {
//     const firstIncomplete = parts.findIndex((p) => !p.done);
//     if (firstIncomplete !== -1) {
//       setActive(firstIncomplete);
//     } else {
//       alert("All parts done! Test finished.");
//     }
//   }

//   const current = questions[active];
//   const state = parts[active];

//   return (
//     <div className="mx-auto h-screen w-[80vw] max-w-[1024px]">
//       <header className="flex h-16 items-center justify-between gap-4 rounded-lg border bg-card px-4 shadow-sm">
//         <h1 className="text-base font-semibold text-primary">Writing Test</h1>
//         <FlipTimer
//           seconds={timeLeft}
//           progress={Math.max(
//             0,
//             Math.min(
//               100,
//               (100 * (Math.max(1, time) - timeLeft)) / Math.max(1, time)
//             )
//           )}
//         />
//       </header>

//       <main className="mt-3 grid h-[calc(100vh-6rem)] grid-cols-1 gap-4 md:grid-cols-2">
//         {/* Right: Question */}
//         <section className="flex h-full flex-col overflow-auto rounded-lg border bg-card p-4 shadow-sm space-y-4">
//           <h2 className="text-sm font-medium text-muted-foreground">
//             {current.part} • Question
//           </h2>
//           <MarkdownRenderer content={current.question} />
//           {current.questionImg && (
//             <img
//               src={current.questionImg}
//               alt={`${current.part} prompt`}
//               className="h-auto w-full rounded-md border object-contain"
//             />
//           )}
//           {state.done && !state.submitting && (
//             <div className="rounded-md border bg-background p-3">
//               <h3 className="mb-2 text-sm font-medium">Your Answer</h3>
//               <MarkdownRenderer content={state.previewMarkdown ?? ""} />
//             </div>
//           )}
//         </section>

//         {/* Left: Answer / Feedback */}
//         <AnswerPanel
//           text={state.text}
//           part={current.part}
//           done={state.done}
//           warning={state.warning}
//           submitting={state.submitting}
//           error={state.error}
//           feedback={state.feedback}
//           onChange={(val) => onChangeText(active, val)}
//           onClear={() => onClear(active)}
//           onMarkDone={() => onMarkDone(active)}
//           onRetry={() => onRetry(active)}
//         />
//       </main>

//       <div className="mt-4 flex justify-end gap-2">
//         <Button onClick={onFinishTest}>Finish Test</Button>
//       </div>
//     </div>
//   );
// }

"use client";
import { useEffect, useState, useMemo } from "react";
import { FlipTimer } from "./flip-timer";
import AnswerPanel from "./AnswerPanel";
import { countWords, minWordsFor, buildChatInputForPart } from "@/lib/utils";
import { MarkdownRenderer } from "./markdown-renderer";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import useCountdown from "@/hooks/useCountdown";
import { toast } from "sonner";

type Question = {
  part: string;
  question: string;
  word_count: number;
  questionImg?: string;
};

type PartState = {
  text: string;
  done: boolean;
  warning: string | null;
  previewMarkdown: string | null;
  submitting?: boolean;
  feedback?: string | null;
  error?: string | null;
};

type TestResult = {
  part1Passed: boolean;
  part2Passed: boolean;
  overallResult: "PASSED" | "FAILED";
  reason?: string;
};

const API_ENDPOINT =
  "https://n8n.kognifi.ai/webhook/08031e41-944d-481c-814a-23ac0cb1611f/chat";

export default function WritingTest({
  questions,
  time,
  examType,
}: {
  questions: Question[];
  time: number;
  examType?: string;
}) {
  const router = useRouter();

  const [active, setActive] = useState(0);
  const [parts, setParts] = useState<PartState[]>(
    questions.map(() => ({
      text: "",
      done: false,
      warning: null,
      previewMarkdown: null,
      submitting: false,
      feedback: null,
      error: null,
    }))
  );
  const [sessionId] = useState(() => crypto.randomUUID());
  const [testCompleted, setTestCompleted] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  // Check if all parts are completed
  const allPartsCompleted = useMemo(
    () => parts.every((p) => p.done && !p.submitting),
    [parts]
  );

  // Check if test is locked (time expired or completed)
  const isTestLocked = timeExpired || testCompleted;

  // Check if test should stop timer (completed early with pass)
  const shouldStopTimer =
    testCompleted && testResult?.overallResult === "PASSED";

  // Initialize countdown with stop condition
  const { left: timeLeft } = useCountdown(time, shouldStopTimer);

  // --- Time-up auto-submit or fail ---
  useEffect(() => {
    if (timeLeft > 0) return;

    setTimeExpired(true);

    const unfinishedParts = parts
      .map((p, idx) => ({ ...p, idx }))
      .filter((p) => !p.done);

    let hasFailedPart = false;
    const failedParts: string[] = [];

    unfinishedParts.forEach((p) => {
      const minWords = minWordsFor(questions[p.idx].part);
      const words = countWords(p.text);

      if (words >= minWords) {
        onMarkDone(p.idx); // auto-submit valid part
      } else {
        hasFailedPart = true;
        failedParts.push(questions[p.idx].part);
      }
    });

    // Wait a bit for auto-submissions to complete, then evaluate results
    setTimeout(() => {
      evaluateTestResults();
    }, 2000);
  }, [timeLeft]);

  // Evaluate test results when all parts are done
  useEffect(() => {
    if (allPartsCompleted && !testCompleted) {
      evaluateTestResults();
    }
  }, [allPartsCompleted, testCompleted]);

  function evaluateTestResults() {
    const part1Index = questions.findIndex((q) => /part\s*1/i.test(q.part));
    const part2Index = questions.findIndex((q) => /part\s*2/i.test(q.part));

    const part1Words = part1Index >= 0 ? countWords(parts[part1Index].text) : 0;
    const part2Words = part2Index >= 0 ? countWords(parts[part2Index].text) : 0;

    const part1MinWords =
      part1Index >= 0 ? minWordsFor(questions[part1Index].part) : 0;
    const part2MinWords =
      part2Index >= 0 ? minWordsFor(questions[part2Index].part) : 0;

    const part1Passed = part1Words >= part1MinWords;
    const part2Passed = part2Words >= part2MinWords;

    let result: TestResult;

    if (part1Passed && part2Passed) {
      result = {
        part1Passed: true,
        part2Passed: true,
        overallResult: "PASSED",
        reason: "Both parts met the minimum word count requirements.",
      };
    } else if (!part1Passed && !part2Passed) {
      result = {
        part1Passed: false,
        part2Passed: false,
        overallResult: "FAILED",
        reason: `Both parts failed to meet minimum word count requirements. Part 1: ${part1Words}/${part1MinWords} words, Part 2: ${part2Words}/${part2MinWords} words.`,
      };
    } else {
      const failedPart = !part1Passed ? "Part 1" : "Part 2";
      const failedWords = !part1Passed
        ? `${part1Words}/${part1MinWords}`
        : `${part2Words}/${part2MinWords}`;
      result = {
        part1Passed,
        part2Passed,
        overallResult: "FAILED",
        reason: `${failedPart} criteria not met (${failedWords} words). You must pass both parts to succeed.`,
      };
    }

    setTestResult(result);
    setTestCompleted(true);

    // Show appropriate toast notification
    if (result.overallResult === "PASSED") {
      const isEarlyCompletion = timeLeft > 0;
      toast.success("🎉 Test Completed Successfully!", {
        description: isEarlyCompletion
          ? `${result.reason} Timer stopped early.`
          : result.reason,
        duration: 5000,
      });
    } else {
      toast.error("❌ Test Failed", {
        description: result.reason,
        duration: 8000,
      });
    }
  }

  function onChangeText(idx: number, val: string) {
    if (isTestLocked) return; // Prevent changes when test is locked

    setParts((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], text: val, warning: null };
      return next;
    });
  }

  function onClear(idx: number) {
    if (isTestLocked) return; // Prevent changes when test is locked

    setParts((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], text: "", warning: null };
      return next;
    });
  }

  async function submitPart(idx: number) {
    const q = questions[idx];
    const answer = parts[idx].text;
    const chatInput = buildChatInputForPart(q, answer, examType);

    setParts((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], submitting: true, error: null };
      return next;
    });

    try {
      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sendMessage", sessionId, chatInput }),
      });
      const data = await res.json();
      const feedback = data.output || "No feedback returned.";

      setParts((prev) => {
        const next = [...prev];
        next[idx] = { ...next[idx], feedback, submitting: false };
        return next;
      });
    } catch {
      setParts((prev) => {
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          error: "Unexpected error.",
          submitting: false,
        };
        return next;
      });
    }
  }

  function onMarkDone(idx: number) {
    if (isTestLocked) return; // Prevent submission when test is locked

    const required = minWordsFor(questions[idx].part);
    const words = countWords(parts[idx].text);

    if (words < required) {
      setParts((prev) => {
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          warning: `Minimum ${required} words required.`,
        };
        return next;
      });

      toast.warning("⚠️ Word Count Too Low", {
        description: `You need at least ${required} words to submit ${questions[idx].part}.`,
        duration: 4000,
      });
      return;
    }

    setParts((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], done: true, previewMarkdown: prev[idx].text };
      return next;
    });

    toast.info("📝 Submitting Response", {
      description: `Submitting your ${questions[idx].part} response...`,
      duration: 3000,
    });

    submitPart(idx);
  }

  function onFinishTest() {
    if (!testCompleted) {
      toast.warning("⏳ Test Not Complete", {
        description:
          "Please wait for all parts to be completed before finishing.",
        duration: 3000,
      });
      return;
    }

    router.push("/");
  }

  function onRetry(idx: number) {
    submitPart(idx);
  }

  const current = questions[active];
  const state = parts[active];

  return (
    <div className="mx-auto h-screen w-[80vw] max-w-[1024px]">
      <header className="flex h-16 items-center justify-between gap-4 rounded-lg border bg-card px-4 shadow-sm">
        <h1 className="text-base font-semibold text-primary">Writing Test</h1>
        <div className="flex items-center gap-4">
          {testCompleted && testResult && (
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                testResult.overallResult === "PASSED"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              }`}
            >
              {testResult.overallResult === "PASSED"
                ? "✅ PASSED"
                : "❌ FAILED"}
            </div>
          )}
          <FlipTimer
            seconds={timeLeft}
            progress={Math.max(
              0,
              Math.min(
                100,
                (100 * (Math.max(1, time) - timeLeft)) / Math.max(1, time)
              )
            )}
          />
        </div>
      </header>
      {/* Test Result Summary */}
      {testCompleted && testResult && (
        <div className="mt-4 rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                Test Result Summary
              </h3>
              <p
                className={`text-sm font-medium ${
                  testResult.overallResult === "PASSED"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {testResult.reason}
              </p>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>
                  Part 1: {testResult.part1Passed ? "✅ Passed" : "❌ Failed"}
                </span>
                <span>
                  Part 2: {testResult.part2Passed ? "✅ Passed" : "❌ Failed"}
                </span>
                {testResult.overallResult === "PASSED" && timeLeft > 0 && (
                  <span className="text-blue-600">
                    ⚡ Completed Early ({timeLeft}s remaining)
                  </span>
                )}
              </div>
            </div>
            <Button
              onClick={onFinishTest}
              className="bg-primary hover:bg-primary/90"
            >
              Finish Test & Return Home
            </Button>
          </div>
        </div>
      )}
      {/* Tabs for Parts */}
      {questions.length > 1 && (
        <nav className="mt-3 flex w-full items-center gap-2">
          {questions.map((q, i) => (
            <button
              key={q.part}
              type="button"
              onClick={() => setActive(i)}
              className={`flex-1 rounded-md px-3 py-1.5 text-sm text-center transition-colors ${
                active === i
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              {q.part} {parts[i]?.done ? "✓" : ""}
            </button>
          ))}
          <div className="ml-auto hidden text-xs text-muted-foreground md:block">
            Minimum: Part 1 = 120 words • Part 2 = 200 words
          </div>
        </nav>
      )}

      <main className="mt-3 grid max-h-screen grid-cols-1 gap-4 md:grid-cols-2">
        {/* Right: Question */}
        <section className="flex min-h-[80vh] max-h-screen flex-col overflow-auto rounded-lg border bg-card p-4 shadow-sm space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground">
            {current.part} • Question
          </h2>
          <MarkdownRenderer content={current.question} />
          {current.questionImg && (
            <img
              src={current.questionImg}
              alt={`${current.part} prompt`}
              className="h-auto w-full rounded-md border object-contain"
            />
          )}
          {state.done && !state.submitting && (
            <div className="rounded-md border min-h-[200px] max-h-[40vh] overflow-auto bg-background p-3">
              <h3 className="mb-2 text-sm font-medium">Your Answer</h3>
              <p>{state.previewMarkdown ?? ""} </p>
            </div>
          )}
        </section>

        {/* Left: Answer / Feedback */}
        <AnswerPanel
          text={state.text}
          part={current.part}
          done={state.done}
          warning={state.warning}
          submitting={state.submitting}
          error={state.error}
          feedback={state.feedback}
          onChange={(val) => onChangeText(active, val)}
          onClear={() => onClear(active)}
          onMarkDone={() => onMarkDone(active)}
          onRetry={() => onRetry(active)}
          disabled={isTestLocked}
        />
      </main>
    </div>
  );
}
