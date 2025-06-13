"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function Loader() {
  const [text, setText] = useState("")
  const fullText = "Initializing Shuva.exe..."

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      setText(fullText.slice(0, index))
      index++
      if (index > fullText.length) {
        clearInterval(timer)
      }
    }, 100)

    return () => clearInterval(timer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#0b0c10] flex items-center justify-center z-50"
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-16 h-16 border-4 border-[#00ff99]/30 border-t-[#00ff99] rounded-full mx-auto mb-8"
        />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-[#00ff99] text-xl">
          {text}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
            className="ml-1"
          >
            |
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  )
}
