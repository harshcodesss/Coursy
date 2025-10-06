"use client"

import React from "react"

export default function Footer() {
  return (
    <footer className="w-full border-t border-neutral-800 py-6 mt-10">
      <div className="flex flex-col md:flex-row items-center justify-between px-6 max-w-6xl mx-auto text-neutral-400 text-sm">
        <p className="mb-3 md:mb-0">
          © {new Date().getFullYear()} Coursy. All rights reserved.
        </p>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}
