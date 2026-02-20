"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronDown, Terminal, Shield } from "lucide-react";
import GlitchText from "@/components/GlitchText";

interface HeroProps {
  darkMode: boolean;
}

export default function Hero({ darkMode }: HeroProps) {
  const [displayText, setDisplayText] = useState("");

  const fullText =
    "Hey, I'm Shuva Kharel — a cybersecurity enthusiast and future ethical hacker from Kathmandu, Nepal. I blend secure, clean web development with red-team thinking to build smarter, safer systems.";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setDisplayText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) {
        clearInterval(timer);
      }
    }, 30);

    return () => clearInterval(timer);
  }, []);

  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="min-h-[100dvh] flex items-center justify-center relative overflow-hidden px-4 py-24 sm:py-20"
    >
      <div className="w-full max-w-5xl mx-auto sm:px-6 lg:px-8 text-center relative z-10">
        {/* Main Terminal Window */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`${
            darkMode
              ? "bg-[#0a0b0e]/90 border-[#00ff99]/40 shadow-[0_0_60px_rgba(0,255,153,0.15)]"
              : "bg-card border-border shadow-[0_8px_40px_rgba(0,0,0,0.08)]"
          } border rounded-xl p-5 sm:p-8 mb-8 sm:mb-12 backdrop-blur-xl`}
        >
          {/* Terminal title bar */}
          <div className="flex items-center gap-2 mb-5 sm:mb-6">
            <div className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-full ${darkMode ? "bg-[#ff5f57]" : "bg-red-400"}`} />
              <div className={`w-3 h-3 rounded-full ${darkMode ? "bg-[#febc2e]" : "bg-yellow-400"}`} />
              <div className={`w-3 h-3 rounded-full ${darkMode ? "bg-[#28c840]" : "bg-green-400"}`} />
            </div>
            <span
              className={`${
                darkMode ? "text-[#00ff99]/70" : "text-muted-foreground"
              } text-xs sm:text-sm font-mono ml-2`}
            >
              shuva@portfolio:~$
            </span>
          </div>

          <motion.h1
            className={`text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-5 sm:mb-8 font-mono leading-tight ${
              darkMode ? "text-foreground" : "text-foreground"
            }`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <GlitchText text="SHUVA" darkMode={darkMode} />
            <br />
            <GlitchText
              text="KHAREL"
              darkMode={darkMode}
              className="text-accent"
            />
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-8"
          >
            <Terminal
              className={`w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 ${
                darkMode ? "text-primary" : "text-primary"
              }`}
            />
            <span
              className={`text-sm sm:text-lg md:text-xl font-mono text-balance ${
                darkMode
                  ? "text-accent"
                  : "text-accent font-semibold"
              }`}
            >
              Aspiring Cybersecurity Engineer & Developer
            </span>
            <Shield
              className={`w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 ${
                darkMode ? "text-accent" : "text-accent"
              }`}
            />
          </motion.div>
        </motion.div>

        {/* Typing Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="max-w-3xl mx-auto mb-8 sm:mb-12"
        >
          <div
            className={`${
              darkMode
                ? "bg-[#0a0b0e]/80 border-primary/20 shadow-[0_0_30px_rgba(0,255,153,0.08)]"
                : "bg-card border-border shadow-[0_4px_24px_rgba(0,0,0,0.05)]"
            } border rounded-xl p-4 sm:p-6 font-mono text-sm sm:text-base md:text-lg leading-relaxed min-h-[100px] sm:min-h-[120px] flex items-center justify-center backdrop-blur-xl ${
              darkMode ? "text-foreground/80" : "text-muted-foreground"
            }`}
          >
            <span>{displayText}</span>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
              className={`ml-1 ${
                darkMode ? "text-primary" : "text-primary"
              }`}
            >
              {"_"}
            </motion.span>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <motion.button
            onClick={scrollToContact}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className={`px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl transition-all duration-300 font-mono ${
              darkMode
                ? "bg-accent hover:bg-primary text-accent-foreground hover:text-primary-foreground hover:shadow-[0_0_40px_rgba(0,255,153,0.3)] border border-accent hover:border-primary"
                : "bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground shadow-lg hover:shadow-xl"
            }`}
            data-cursor="hover"
          >
            {darkMode ? ">> INITIATE_CONTACT.exe" : "Get In Touch"}
          </motion.button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="text-primary"
          >
            <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
