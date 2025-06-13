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
      className="min-h-screen flex items-center justify-center relative overflow-hidden py-20"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Main Terminal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className={`${
            darkMode
              ? "bg-black border-[#00ff99] shadow-[0_0_50px_rgba(0,255,153,0.3)]"
              : "bg-white border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.3)]"
          } border-2 rounded-lg p-8 mb-12 backdrop-blur-md`}
        >
          <div className="flex items-center mb-6">
            <div
              className={`w-3 h-3 ${
                darkMode ? "bg-[#ff0055]" : "bg-red-500"
              } rounded-full mr-2`}
            ></div>
            <div
              className={`w-3 h-3 ${
                darkMode ? "bg-[#ffff00]" : "bg-yellow-500"
              } rounded-full mr-2`}
            ></div>
            <div
              className={`w-3 h-3 ${
                darkMode ? "bg-[#00ff99]" : "bg-green-500"
              } rounded-full mr-2`}
            ></div>
            <span
              className={`${
                darkMode ? "text-[#00ff99]" : "text-blue-600"
              } text-sm font-mono ml-2`}
            >
              shuva@matrix:~$
            </span>
          </div>

          <motion.h1
            className={`text-5xl md:text-7xl lg:text-8xl font-bold mb-8 font-mono ${
              darkMode ? "text-[#f4f4f5]" : "text-gray-900"
            }`}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <GlitchText text="SHUVA" darkMode={darkMode} />
            <br />
            <GlitchText
              text="KHAREL"
              darkMode={darkMode}
              className="text-[#ff0055]"
            />
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex items-center justify-center space-x-4 mb-8"
          >
            <Terminal
              className={`w-6 h-6 ${
                darkMode ? "text-[#00ff99]" : "text-blue-600"
              }`}
            />
            <span
              className={`text-lg md:text-xl font-mono ${
                darkMode
                  ? "text-[#ff0055]"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-semibold"
              }`}
            >
              Aspiring Cybersecurity Engineer & Developer
            </span>
            <Shield
              className={`w-6 h-6 ${
                darkMode ? "text-[#ff0055]" : "text-red-600"
              }`}
            />
          </motion.div>
        </motion.div>

        {/* Typing Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className={`max-w-4xl mx-auto mb-12 text-lg md:text-xl leading-relaxed ${
            darkMode ? "text-[#f4f4f5]/80" : "text-gray-700"
          }`}
        >
          <div
            className={`${
              darkMode
                ? "bg-black border-[#00ff99] shadow-[0_0_30px_rgba(0,255,153,0.2)]"
                : "bg-gray-50 border-blue-200 shadow-[0_0_30px_rgba(59,130,246,0.2)]"
            } border rounded-lg p-6 font-mono min-h-[120px] flex items-center justify-center backdrop-blur-md`}
          >
            {displayText}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
              className={`ml-1 ${
                darkMode ? "text-[#00ff99]" : "text-blue-600"
              }`}
            >
              █
            </motion.span>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <motion.button
            onClick={scrollToContact}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 font-mono ${
              darkMode
                ? "bg-[#ff0055] hover:bg-[#00ff99] text-black hover:shadow-[0_0_30px_#00ff99] border border-[#ff0055] hover:border-[#00ff99]"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-pink-600 text-white hover:shadow-[0_0_30px_rgba(139,92,246,0.8)] shadow-lg"
            }`}
            data-cursor="hover"
          >
            {darkMode ? ">> INITIATE_CONTACT.exe" : "Contact Me"}
          </motion.button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className={darkMode ? "text-[#00ff99]" : "text-blue-600"}
          >
            <ChevronDown className="w-8 h-8" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
