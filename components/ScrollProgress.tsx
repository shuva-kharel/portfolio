"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface ScrollProgressProps {
  darkMode: boolean
}

export default function ScrollProgress({ darkMode }: ScrollProgressProps) {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] sm:h-0.5 z-[60] origin-left bg-primary"
      style={{ scaleX: scrollProgress / 100 }}
      initial={{ scaleX: 0 }}
    />
  )
}
