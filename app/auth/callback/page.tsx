"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import Spinner from "@/components/Loader";
import { handleGoogleCallback } from "@/dal";
import { setToken } from "@/dal/auth/token-storage";
export const dynamic = "force-dynamic";

export default function CallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) return;

    const fetchToken = async () => {
      const res = await handleGoogleCallback({ code });
      if (res.success && res.data?.access_token) {
        setToken("token", res.data?.access_token);
        router.push("/admin");
      } else {
        console.error(res.error);
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
