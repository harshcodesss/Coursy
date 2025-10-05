import React from "react";
import Header from "@/components/layout/header";
import HeroSection from "@/components/layout/herosection";
import DemoSection from "@/components/layout/demo";
import Features from "@/components/layout/features";

export default function Home() {
  return (
    <div className="flex flex-col bg-background text-foreground">
      <Header />
      <HeroSection />
      <DemoSection />
      <Features />
    </div>
  );
}
