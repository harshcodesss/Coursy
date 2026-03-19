"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AuthHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("accessToken", token);
      document.cookie = `accessToken=${token}; path=/; max-age=604800; Secure; SameSite=Lax`;
      
      console.log("Token secured in Local Storage AND Cookie!");
    }

    console.log("Auth success, redirecting to dashboard...");
    router.push("/dashboard");
  }, [router, searchParams]);

  return <p>Authentication successful, redirecting...</p>;
}

export default function AuthSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <Suspense fallback={<p>Loading authentication...</p>}>
        <AuthHandler />
      </Suspense>
    </div>
  );
}