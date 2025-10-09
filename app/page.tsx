import { Suspense } from "react"
import ExamWorkspace from "@/components/exam-workspace"

// Dummy questions for now. In the future, fetch from your API and pass as props.
const DUMMY_QUESTIONS = [
  {
    id: "p1-q1",
    part: 1 as const,
    title: "Part 1 • Summarise the information",
    timeSeconds: 20 * 60,
    minWords: 150,
    promptMd: `
### Part 1
You should spend about 20 minutes on this task. Write at least **150 words**.

The table below shows changes in the total population of New York City from 1800 to 2000. The second and third tables show changes in the population of the five districts of the city (Manhattan, Brooklyn, Bronx, Queens, Staten Island) over the same period.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.
    `,
    imageSrc: "/images/mock-idea.png",
    imageAlt: "UI idea for IELTS workspace split layout",
  },
  {
    id: "p2-q1",
    part: 2 as const,
    title: "Part 2 • Opinion essay",
    timeSeconds: 40 * 60,
    minWords: 250,
    promptMd: `
### Part 2
Some people believe that cities should invest more in public transportation than in building new roads.  
To what extent do you agree or disagree?

Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least **250 words**.
    `,
  },
]

export default function Page() {
  return (
    <main className="min-h-dvh">
      <Suspense fallback={<div className="p-6 text-muted-foreground">Loading test…</div>}>
        <ExamWorkspace questions={DUMMY_QUESTIONS} initialRequirePart1ToUnlock={true} title="Writing Test" />
      </Suspense>
    </main>
  )
}
