// "use client";

// import { useEffect } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { api } from "@/lib/axios";
// import Spinner from "@/components/Loader";
// import { handleGoogleCallback } from "@/dal";
// import { setToken } from "@/dal/auth/token-storage";
// export const dynamic = "force-dynamic";

// export default function CallbackPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   useEffect(() => {
//     const code = searchParams.get("code");
//     if (!code) return;

//     const fetchToken = async () => {
//       const res = await handleGoogleCallback({ code });
//       if (res.success && res.data?.access_token) {
//         setToken("token", res.data?.access_token);
//         router.push("/admin");
//       } else {
//         console.error(res.error);
//       }
//     };

//     fetchToken();
//   }, [searchParams, router]);

//   return (
//     <div className="flex flex-col gap-4">
//       <Spinner />
//       Logging in...
//     </div>
//   );
// }

import { handleGoogleCallback } from "@/dal";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AuthCallbackPage({
  searchParams,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchParams: any;
}) {
  try {
    const code = searchParams.code;
    if (!code) throw new Error("Missing code");

    // Exchange the Google auth code for tokens
    const res = await handleGoogleCallback({ code });
    if (!res.success) throw new Error("Failed to authenticate");

    // maybe redirect to dashboard after success
    redirect("/");
  } catch (e) {
    console.error("OAuth callback failed:", e);
    redirect("/login?error=auth_failed");
  }
  
}
