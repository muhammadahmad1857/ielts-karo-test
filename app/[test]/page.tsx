import Link from "next/link";
import { Card } from "@/components/ui/card";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    test: string;
  };
}

export default function TestPage({ params }: PageProps) {
  const { test } = params;

  // Define test categories for each test type
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const testCategories: Record<string, any[]> = {
    ielts: [
      {
        id: "listening",
        name: "Listening",
        description:
          "Practice with authentic audio materials and improve your listening skills.",
        icon: "🎧",
        color: "bg-purple-500",
        progress: 0,
      },
      {
        id: "reading",
        name: "Reading",
        description:
          "Master different question types with varied academic and general passages.",
        icon: "📖",
        color: "bg-green-500",
        progress: 0,
      },
      {
        id: "writing",
        name: "Writing",
        description:
          "Improve your essay writing with AI-powered feedback and tips.",
        icon: "✏️",
        color: "bg-orange-500",
        progress: 0,
      },
      {
        id: "speaking",
        name: "Speaking",
        description:
          "Record your responses and get detailed feedback on fluency and pronunciation.",
        icon: "🎤",
        color: "bg-blue-500",
        progress: 0,
      },
    ],
    pte: [
      {
        id: "listening",
        name: "Listening",
        description: "Practice PTE listening tasks with real exam scenarios.",
        icon: "🎧",
        color: "bg-purple-500",
        progress: 0,
      },
      {
        id: "reading",
        name: "Reading",
        description: "Master PTE reading comprehension and vocabulary.",
        icon: "📖",
        color: "bg-green-500",
        progress: 0,
      },
      {
        id: "writing",
        name: "Writing",
        description: "Practice PTE writing tasks with instant feedback.",
        icon: "✏️",
        color: "bg-orange-500",
        progress: 0,
      },
      {
        id: "speaking",
        name: "Speaking",
        description: "Improve your PTE speaking skills with AI evaluation.",
        icon: "🎤",
        color: "bg-blue-500",
        progress: 0,
      },
    ],
    toefl: [
      {
        id: "listening",
        name: "Listening",
        description: "Practice TOEFL listening with academic conversations.",
        icon: "🎧",
        color: "bg-purple-500",
        progress: 0,
      },
      {
        id: "reading",
        name: "Reading",
        description: "Master TOEFL reading with academic passages.",
        icon: "📖",
        color: "bg-green-500",
        progress: 0,
      },
      {
        id: "writing",
        name: "Writing",
        description:
          "Practice TOEFL writing with integrated and independent tasks.",
        icon: "✏️",
        color: "bg-orange-500",
        progress: 0,
      },
      {
        id: "speaking",
        name: "Speaking",
        description: "Improve TOEFL speaking with structured practice.",
        icon: "🎤",
        color: "bg-blue-500",
        progress: 0,
      },
    ],
  };

  const categories = testCategories[test.toLowerCase()];

  if (!categories) {
    notFound();
  }

  const testNames: Record<string, string> = {
    ielts: "IELTS",
    pte: "PTE",
    toefl: "TOEFL",
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Back to Tests
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {testNames[test.toLowerCase()]} Practice Modules
          </h1>
          <p className="text-xl text-gray-600">Choose a skill to practice</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category) => (
            <Link key={category.id} href={`/${test}/${category.id}`}>
              <Card className="p-8 text-center hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-300">
                <div
                  className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center text-3xl text-white mx-auto mb-6`}
                >
                  {category.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {category.name}
                </h2>
                <p className="text-gray-600 mb-6">{category.description}</p>
                <div className="bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-gray-400 h-2 rounded-full"
                    style={{ width: `${category.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Progress {category.progress}%
                </p>
                <button
                  className={`w-full py-3 px-6 ${category.color} text-white rounded-lg font-semibold hover:opacity-90 transition-opacity`}
                >
                  Practice Now
                </button>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
