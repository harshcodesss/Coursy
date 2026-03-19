"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("accessToken", token); 
      console.log("Token secured!");
    }

    console.log("Auth success, redirecting to dashboard...");
    router.push("/dashboard"); 
  }, [router, searchParams]); 

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <p>Authentication successful, redirecting...</p>
    </div>
  );
}