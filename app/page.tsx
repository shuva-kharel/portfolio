"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import ModernCursor from "@/components/ModernCursor";
import FloatingActionButton from "@/components/FloatingActionButton";
import Hero from "@/sections/Hero";
import AboutSection from "@/components/AboutSection";
import Projects from "@/sections/Projects";
import Skills from "@/sections/Skills";
import Contact from "@/sections/Contact";
import CyberGrid from "@/components/CyberGrid";
import ScrollProgress from "@/components/ScrollProgress";
import TerminalLoader from "@/components/TerminalLoader";

export default function Portfolio() {
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <AnimatePresence>{loading && <TerminalLoader />}</AnimatePresence>

      {!loading && (
        <>
          <ModernCursor darkMode={darkMode} />
          <CyberGrid darkMode={darkMode} />
          <ScrollProgress darkMode={darkMode} />
          <FloatingActionButton darkMode={darkMode} />

          <div className="relative z-10">
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

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
