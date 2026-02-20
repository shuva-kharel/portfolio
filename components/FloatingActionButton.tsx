"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MessageCircle, Github, Linkedin, Mail, X } from "lucide-react";

interface FloatingActionButtonProps {
  darkMode: boolean;
}

export default function FloatingActionButton({
  darkMode,
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const socialLinks = [
    {
      icon: Github,
      href: "https://github.com/shuva-kharel",
      label: "GitHub",
      color: darkMode ? "#00ff99" : "#3b82f6",
    },
    {
      icon: Linkedin,
      href: "https://linkedin.com/in/shuva-kharel",
      label: "LinkedIn",
      color: darkMode ? "#00ff99" : "#0077b5",
    },
    {
      icon: Mail,
      href: "mailto:shuva.kharel@example.com",
      label: "Email",
      color: darkMode ? "#ff0055" : "#dc2626",
    },
  ];

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {socialLinks.map((link, index) => {
              const IconComponent = link.icon;
              return (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target={link.label !== "Email" ? "_blank" : undefined}
                  rel={
                    link.label !== "Email" ? "noopener noreferrer" : undefined
                  }
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-full backdrop-blur-md transition-all duration-300 group ${
                    darkMode
                      ? "bg-black/80 border border-[#00ff99]/30 hover:border-[#00ff99] text-[#f4f4f5]"
                      : "bg-white/80 border border-blue-200 hover:border-blue-400 text-gray-700"
                  }`}
                  style={{
                    boxShadow: `0 0 20px ${link.color}20`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 30px ${link.color}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 20px ${link.color}20`;
                  }}
                  data-cursor="hover"
                >
                  <IconComponent
                    className="w-5 h-5 transition-colors duration-300"
                    style={{ color: link.color }}
                  />
                  <span className="text-sm font-medium whitespace-nowrap">
                    {link.label}
                  </span>
                </motion.a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl backdrop-blur-md transition-all duration-300 flex items-center justify-center ${
          darkMode
            ? "bg-accent hover:bg-primary text-accent-foreground hover:text-primary-foreground border border-accent/50 hover:border-primary/50"
            : "bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground border border-primary/30"
        }`}
        style={{
          boxShadow: darkMode
            ? "0 4px 20px rgba(255, 0, 85, 0.3)"
            : "0 4px 20px rgba(0, 0, 0, 0.15)",
        }}
        data-cursor="hover"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </motion.div>
      </motion.button>
    </div>
  );
}
