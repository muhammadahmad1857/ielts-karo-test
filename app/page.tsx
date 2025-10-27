import Link from "next/link";

export const metadata = {
  title: "Coming Soon",
};

export default function Page() {
  return (
    <main className="min-h-[100dvh] grid place-items-center p-8 text-center">
      <div>
        <h1 className="text-2xl font-semibold">
          User features are coming soon
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          If you're the admin, go to{" "}
          <Link
            href="/admin"
            className="text-blue-600 underline hover:opacity-80"
          >
            /admin
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
