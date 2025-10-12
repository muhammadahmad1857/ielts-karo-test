import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function countWords(s: string) {
  const t = s.trim();
  return t ? t.split(/\s+/).filter(Boolean).length : 0;
}

export function minWordsFor(partLabel: string) {
  return /part\s*2/i.test(partLabel) ? 200 : 120;
}

export function buildChatInputForPart(
  q: { part: string; question: string },
  answer: string,
  examType?: string
) {
  const words = countWords(answer);
  return [
    "## Part",
    `${q.part} ${examType ? `(${examType})` : ""}`.trim(),
    "",
    "## Question",
    q.question,
    "",
    "## Answer",
    answer,
    "",
    "## Word count",
    `word count: ${words}`,
  ].join("\n");
}
