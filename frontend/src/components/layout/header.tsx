"use client";

import React, { useState, useEffect } from "react";
import {
  Navbar,
  NavBody,
  MobileNav,
  MobileNavHeader,
  NavbarLogo,
  NavbarButton,
} from "@/components/ui/resizable-navbar";

const navLinks = [
  { name: "Home", link: "#home" },
  { name: "Features", link: "#features" },
  { name: "Workflow", link: "#workflow" },
  { name: "About", link: "#about" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScrollEvent = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScrollEvent);
    return () => window.removeEventListener("scroll", handleScrollEvent);
  }, []);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, link: string) => {
    e.preventDefault(); 
    
    if (link === "#home" || link === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (link.startsWith("#")) {
      const targetId = link.replace("#", "");
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <Navbar className="mt-5 w-full z-50">
      <NavBody className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800/50">
        <NavbarLogo />

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              onClick={(e) => handleScroll(e, item.link)}
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              {item.name}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <NavbarButton
            href="/signup"
            variant="primary"
            className="bg-white text-zinc-950 hover:bg-zinc-200 transition-colors font-semibold"
          >
            Get Started
          </NavbarButton>
        </div>
      </NavBody>

      <MobileNav className={`md:hidden transition-opacity duration-300 ${isScrolled ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
        <MobileNavHeader className="relative flex w-full items-center justify-start pl-4 pt-2">
          <NavbarLogo />
        </MobileNavHeader>
      </MobileNav>
    </Navbar>
  );
}