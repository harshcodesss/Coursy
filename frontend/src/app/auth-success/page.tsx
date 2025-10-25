"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    console.log("Auth success, redirecting to dashboard...");
    router.push("/dashboard"); 
  }, [router]); 

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <p>Authentication successful, redirecting...</p>
    </div>
  );
}

