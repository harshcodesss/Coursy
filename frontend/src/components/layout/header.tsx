"use client";

import React, { useState } from "react";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarLogo,
  NavbarButton,
} from "@/components/ui/resizable-navbar";

const navLinks = [
  { name: "Home", link: "/" },
  { name: "Features", link: "#features" },
  { name: "About", link: "#about" },
  { name: "Contact", link: "#contact" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Navbar className="mt-5">
      {/* Desktop Nav */}
      <NavBody>
        <NavbarLogo />

        {/* Center links */}
        <NavItems items={navLinks} />

        {/* Right side: only Get Started button */}
        <div className="flex items-center gap-4">
          <NavbarButton
            href="/signup"
            variant="primary"
            className="text-black dark:text-black"
          >
            Get Started
          </NavbarButton>
        </div>
      </NavBody>

      {/* Mobile Nav */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
          />
        </MobileNavHeader>

        <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
          {navLinks.map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              onClick={() => setIsOpen(false)}
              className="block w-full px-4 py-2 text-lg font-medium text-neutral-200 hover:text-white"
            >
              {item.name}
            </a>
          ))}

          {/* Only Get Started button inside mobile menu */}
          <div className="mt-4 flex w-full flex-col gap-3">
            <NavbarButton
              href="/signup"
              variant="primary"
              className="w-full text-black dark:text-black"
            >
              Get Started
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
