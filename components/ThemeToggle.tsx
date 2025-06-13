"use client"

import { motion } from "framer-motion"
import { Sun, Moon } from "lucide-react"

interface ThemeToggleProps {
  darkMode: boolean
  setDarkMode: (value: boolean) => void
}

export default function ThemeToggle({ darkMode, setDarkMode }: ThemeToggleProps) {
  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setDarkMode(!darkMode)}
      className={`fixed top-20 right-4 z-40 p-3 rounded-full backdrop-blur-md transition-colors duration-300 ${
        darkMode
          ? "bg-[#0b0c10]/80 border border-[#00ff99]/30 text-[#00ff99]"
          : "bg-white/80 border border-gray-300 text-gray-700"
      }`}
      style={{
        boxShadow: darkMode ? "0 0 20px rgba(0, 255, 153, 0.3)" : "0 0 20px rgba(0, 0, 0, 0.1)",
      }}
    >
      {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </motion.button>
  )
}
