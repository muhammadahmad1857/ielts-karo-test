import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function Page() {
  const tests = [
    {
      id: "ielts",
      name: "IELTS",
      description: "International English Language Testing System",
      icon: "📝",
      color: "bg-blue-500",
    },
    {
      id: "pte",
      name: "PTE",
      description: "Pearson Test of English",
      icon: "🎤",
      color: "bg-green-500",
    },
    {
      id: "toefl",
      name: "TOEFL",
      description: "Test of English as a Foreign Language",
      icon: "🌍",
      color: "bg-purple-500",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Practice Modules
          </h1>
          <p className="text-xl text-gray-600">
            Choose a test type to start practicing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tests.map((test) => (
            <Link key={test.id} href={`/${test.id}`}>
              <Card className="p-8 text-center hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-300">
                <div
                  className={`w-16 h-16 ${test.color} rounded-full flex items-center justify-center text-3xl text-white mx-auto mb-6`}
                >
                  {test.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {test.name}
                </h2>
                <p className="text-gray-600 mb-6">{test.description}</p>
                <div className="bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-gray-400 h-2 rounded-full"
                    style={{ width: "0%" }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mb-4">Progress 0%</p>
                <button
                  className={`w-full py-3 px-6 ${test.color} text-white rounded-lg font-semibold hover:opacity-90 transition-opacity`}
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
