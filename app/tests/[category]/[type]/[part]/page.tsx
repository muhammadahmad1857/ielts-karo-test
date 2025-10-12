import WritingTest from "@/components/writing-test";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    category: string;
    type: string;
    part: string;
  };
}

export default function TestExecutionPage({ params }: PageProps) {
  const { category, type, part } = params;

  // Sample questions for different test types
  const getQuestionsForTest = () => {
    if (category === "writing") {
      if (part === "part1") {
        return [
          {
            part: "Part 1",
            question: `**The chart below shows the number of trips made by children in one country in 1990 and 2010 to travel to and from school using different modes of transport.
            
Summarise the information by selecting and reporting the main features, and make comparisons where relevant.**`,
            word_count: 150,
            questionImg: "/sample.svg",
          },
        ];
      } else if (part === "part2") {
        return [
          {
            part: "Part 2",
            question: `Write about the following topic:

**The average standard of people's health is likely to be lower in the future than it is now.
To what extent do you agree or disagree with this statement?**

Give reasons for your answer and include any relevant examples from your own knowledge or experience.`,
            word_count: 250,
          },
        ];
      } else if (part === "complete") {
        return [
          {
            part: "Part 1",
            question: `**The chart below shows the number of trips made by children in one country in 1990 and 2010 to travel to and from school using different modes of transport.
            
Summarise the information by selecting and reporting the main features, and make comparisons where relevant.**`,
            word_count: 150,
            questionImg: "/sample.svg",
          },
          {
            part: "Part 2",
            question: `Write about the following topic:

**The average standard of people's health is likely to be lower in the future than it is now.
To what extent do you agree or disagree with this statement?**

Give reasons for your answer and include any relevant examples from your own knowledge or experience.`,
            word_count: 250,
          },
        ];
      }
    }

    // For other categories, return placeholder questions
    return [
      {
        part: "Sample Question",
        question: `This is a sample question for ${category} - ${type} - ${part}. The actual test implementation would go here.`,
        word_count: 250,
      },
    ];
  };

  const questions = getQuestionsForTest();

  if (!questions || questions.length === 0) {
    notFound();
  }

  // Determine exam type based on the route
  const examType = type === "academic" ? "Academic" : "General";

  return (
    <main className="flex min-h-screen items-stretch justify-center bg-background p-0">
      <WritingTest
        questions={questions}
        time={3600}
        examType={examType}
        testType={type}
        testPart={part}
      />
    </main>
  );
}
