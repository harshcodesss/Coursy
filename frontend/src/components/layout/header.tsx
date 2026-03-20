"use client";

import React, { useState, useEffect } from "react";
import {
  Navbar,
  NavBody,
  MobileNav,
  MobileNavHeader,
  NavbarLogo,
  NavbarButton,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";

const navLinks = [
  { name: "Home", link: "#home" },
  { name: "Features", link: "#features" },
  { name: "Workflow", link: "#workflow" },
  { name: "About", link: "#about" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <Navbar className="mt-5 w-full z-[100]">
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

        <div className="flex items-center gap-4 hidden md:flex">
          <NavbarButton
            href="/signup"
            variant="primary"
            className="bg-white text-zinc-950 hover:bg-zinc-200 transition-colors font-semibold"
          >
            Get Started
          </NavbarButton>
        </div>
      </NavBody>

      <MobileNav className="md:hidden">
        <MobileNavHeader className="relative flex w-full items-center justify-between px-4 pt-2">
          <NavbarLogo />
          <MobileNavToggle 
            isOpen={isMobileMenuOpen} 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          />
        </MobileNavHeader>

        <MobileNavMenu 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)}
          className="bg-zinc-950 border border-zinc-800 shadow-2xl"
        >
          <div className="flex flex-col gap-6 w-full pt-2">
            {navLinks.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                onClick={(e) => {
                  handleScroll(e, item.link);
                  setIsMobileMenuOpen(false);
                }}
                className="text-lg font-medium text-zinc-300 hover:text-white transition-colors"
              >
                {item.name}
              </a>
            ))}
            
            <div className="pt-4 border-t border-zinc-800 w-full">
              <NavbarButton
                href="/signup"
                variant="primary"
                className="w-full bg-white text-zinc-950 hover:bg-zinc-200 transition-colors font-semibold flex justify-center"
              >
                Get Started
              </NavbarButton>
            </div>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}