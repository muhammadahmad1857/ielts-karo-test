"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import Spinner from "@/components/Loader";

export default function CallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) return;

    const fetchToken = async () => {
      try {
        const res = await api.get(`/auth/google/callback?code=${code}`);
        localStorage.setItem("access_token", res.data.access_token);
        router.push("/dashboard");
      } catch (err) {
        console.error(err);
      }
    };

    fetchToken();
  }, [searchParams, router]);

  return (
    <div className="flex flex-col gap-4">
      <Spinner />
      Logging in...
    </div>
  );
}
