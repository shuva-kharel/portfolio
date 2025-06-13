"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
  darkMode: boolean;
}

export default function GlitchText({
  text,
  className = "",
  darkMode,
}: GlitchTextProps) {
  const [glitchText, setGlitchText] = useState(text);

  useEffect(() => {
    const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`";

    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.95) {
        const glitched = text
          .split("")
          .map((char) =>
            Math.random() > 0.9
              ? glitchChars[Math.floor(Math.random() * glitchChars.length)]
              : char
          )
          .join("");

        setGlitchText(glitched);

        setTimeout(() => setGlitchText(text), 100);
      }
    }, 150);

    return () => clearInterval(glitchInterval);
  }, [text]);

  return (
    <motion.span
      className={`${className} ${
        darkMode
          ? "text-[#00ff99]"
          : "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
      }`}
      animate={{
        textShadow: darkMode
          ? [
              "0 0 5px #00ff99",
              "2px 0 0 #ff0055, -2px 0 0 #00ff99",
              "0 0 5px #00ff99",
            ]
          : [
              "0 0 5px rgba(59, 130, 246, 0.8)",
              "2px 0 0 rgba(236, 72, 153, 0.8), -2px 0 0 rgba(59, 130, 246, 0.8)",
              "0 0 5px rgba(139, 92, 246, 0.8)",
            ],
      }}
      transition={{ duration: 0.1, repeat: Number.POSITIVE_INFINITY }}
    >
      {glitchText}
    </motion.span>
  );
}
