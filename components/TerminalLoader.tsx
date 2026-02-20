"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function TerminalLoader() {
  const [currentLine, setCurrentLine] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)
  const [showCursor, setShowCursor] = useState(true)

  const bootSequence = [
    "BIOS v2.1.4 - Initializing...",
    "Memory Test: 16384MB OK",
    "Loading Kernel modules...",
    "Starting network services...",
    "Mounting encrypted filesystems...",
    "Loading security protocols...",
    "Initializing Shuva.exe...",
    "Establishing secure connection...",
    "Welcome to the Matrix, Neo...",
    "System ready. Access granted.",
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentLine < bootSequence.length) {
        if (currentChar < bootSequence[currentLine].length) {
          setCurrentChar((prev) => prev + 1)
        } else {
          setTimeout(() => {
            setCurrentLine((prev) => prev + 1)
            setCurrentChar(0)
          }, 300)
        }
      }
    }, 50)

    return () => clearInterval(timer)
  }, [currentLine, currentChar])

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)
    return () => clearInterval(cursorTimer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#0a0b0e] flex items-center justify-center z-50 font-mono"
    >
      <div className="w-full max-w-2xl px-4 sm:px-8">
        <div className="border border-primary/40 bg-[#0a0b0e] p-4 sm:p-6 rounded-xl shadow-[0_0_40px_rgba(0,255,153,0.15)]">
          <div className="text-primary/80 mb-4 text-xs sm:text-sm break-all sm:break-normal">
            {"shuva@portfolio:~$ sudo ./initialize_portfolio.sh"}
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            {bootSequence.slice(0, currentLine + 1).map((line, index) => (
              <div key={index} className="text-primary text-xs sm:text-sm">
                {index === currentLine ? (
                  <>
                    {line.slice(0, currentChar)}
                    {showCursor && <span className="bg-primary text-primary-foreground">{"_"}</span>}
                  </>
                ) : (
                  line
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 sm:mt-6 h-1.5 sm:h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${((currentLine + 1) / bootSequence.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
