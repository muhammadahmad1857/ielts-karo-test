import Link from "next/link";
import { Card } from "@/components/ui/card";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    test: string;
    category: string;
  };
}

export default function CategoryPage({ params }: PageProps) {
  const { test, category } = params;

  // Define category options for each category
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const categoryOptions: Record<string, any[]> = {
    writing: [
      {
        id: "part1",
        name: "Part 1",
        description:
          "Task 1 - Describe visual information (charts, graphs, diagrams)",
        icon: "📊",
        color: "bg-blue-500",
        hasImage: true,
      },
      {
        id: "part2",
        name: "Part 2",
        description:
          "Task 2 - Write an essay responding to a point of view or argument",
        icon: "📝",
        color: "bg-green-500",
        hasImage: false,
      },
      {
        id: "complete",
        name: "Complete Mock Test",
        description: "Full writing test with both Task 1 and Task 2",
        icon: "🎯",
        color: "bg-purple-500",
        hasImage: true,
      },
    ],
    reading: [
      {
        id: "passage1",
        name: "Passage 1",
        description: "First reading passage with various question types",
        icon: "📖",
        color: "bg-blue-500",
      },
      {
        id: "passage2",
        name: "Passage 2",
        description: "Second reading passage with comprehension questions",
        icon: "📚",
        color: "bg-green-500",
      },
      {
        id: "passage3",
        name: "Passage 3",
        description: "Third reading passage with advanced questions",
        icon: "📑",
        color: "bg-purple-500",
      },
      {
        id: "complete",
        name: "Complete Mock Test",
        description: "Full reading test with all three passages",
        icon: "🎯",
        color: "bg-orange-500",
      },
    ],
    listening: [
      {
        id: "section1",
        name: "Section 1",
        description:
          "Conversation between two people in everyday social context",
        icon: "🎧",
        color: "bg-blue-500",
      },
      {
        id: "section2",
        name: "Section 2",
        description: "Monologue in everyday social context",
        icon: "🎵",
        color: "bg-green-500",
      },
      {
        id: "section3",
        name: "Section 3",
        description:
          "Conversation between up to four people in educational context",
        icon: "🎓",
        color: "bg-purple-500",
      },
      {
        id: "section4",
        name: "Section 4",
        description: "Monologue on academic subject",
        icon: "🎤",
        color: "bg-orange-500",
      },
      {
        id: "complete",
        name: "Complete Mock Test",
        description: "Full listening test with all four sections",
        icon: "🎯",
        color: "bg-red-500",
      },
    ],
    speaking: [
      {
        id: "part1",
        name: "Part 1",
        description: "Introduction and interview on familiar topics",
        icon: "👋",
        color: "bg-blue-500",
      },
      {
        id: "part2",
        name: "Part 2",
        description: "Individual long turn - speak on a given topic",
        icon: "🗣️",
        color: "bg-green-500",
      },
      {
        id: "part3",
        name: "Part 3",
        description: "Two-way discussion on abstract topics",
        icon: "💬",
        color: "bg-purple-500",
      },
      {
        id: "complete",
        name: "Complete Mock Test",
        description: "Full speaking test with all three parts",
        icon: "🎯",
        color: "bg-orange-500",
      },
    ],
  };

  const options = categoryOptions[category.toLowerCase()];

  if (!options) {
    notFound();
  }

  const testNames: Record<string, string> = {
    ielts: "IELTS",
    pte: "PTE",
    toefl: "TOEFL",
  };

  const categoryNames: Record<string, string> = {
    writing: "Writing",
    reading: "Reading",
    listening: "Listening",
    speaking: "Speaking",
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Link
            href={`/${test}`}
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Back to {testNames[test.toLowerCase()]} Modules
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {testNames[test.toLowerCase()]}{" "}
            {categoryNames[category.toLowerCase()]}
          </h1>
          <p className="text-xl text-gray-600">Choose a practice option</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {options.map((option) => (
            <Link
              key={option.id}
              href={`/tests/${category}/${
                test === "ielts" ? "academic" : "general"
              }/${option.id}`}
            >
              <Card className="p-8 text-center hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-300">
                <div
                  className={`w-16 h-16 ${option.color} rounded-full flex items-center justify-center text-3xl text-white mx-auto mb-6`}
                >
                  {option.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {option.name}
                </h2>
                <p className="text-gray-600 mb-6">{option.description}</p>
                <button
                  className={`w-full py-3 px-6 ${option.color} text-white rounded-lg font-semibold hover:opacity-90 transition-opacity`}
                >
                  Start Practice
                </button>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
