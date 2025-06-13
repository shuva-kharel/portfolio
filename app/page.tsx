"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import ModernCursor from "@/components/ModernCursor";
import ThemeToggle from "@/components/ThemeToggle";
import FloatingActionButton from "@/components/FloatingActionButton";
import Hero from "@/sections/Hero";
import AboutSection from "@/components/AboutSection";
import Projects from "@/sections/Projects";
import Skills from "@/sections/Skills";
import Contact from "@/sections/Contact";
import CyberGrid from "@/components/CyberGrid";
import EnhancedLightBackground from "@/components/EnhancedLightBackground";
import ScrollProgress from "@/components/ScrollProgress";
import TerminalLoader from "@/components/TerminalLoader";

export default function Portfolio() {
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-[#0b0c10] to-[#111215] text-[#f4f4f5]"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 via-purple-50 to-pink-50 text-gray-900"
      }`}
    >
      <AnimatePresence>{loading && <TerminalLoader />}</AnimatePresence>

      {!loading && (
        <>
          <ModernCursor darkMode={darkMode} />
          <CyberGrid darkMode={darkMode} />
          <EnhancedLightBackground darkMode={darkMode} />
          <ScrollProgress />
          <FloatingActionButton darkMode={darkMode} />

          <div className="relative z-10">
            <Navbar darkMode={darkMode} />
            <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

            <main>
              <Hero darkMode={darkMode} />
              <AboutSection darkMode={darkMode} />
              <Projects darkMode={darkMode} />
              <Skills darkMode={darkMode} />
              <Contact darkMode={darkMode} />
            </main>
          </div>
        </>
      )}
    </div>
  );
}
