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
      className="fixed inset-0 bg-black flex items-center justify-center z-50 font-mono"
    >
      <div className="w-full max-w-2xl p-8">
        <div className="border border-[#00ff99] bg-black p-6 shadow-[0_0_50px_#00ff99]">
          <div className="text-[#00ff99] mb-4 text-sm">┌─[shuva@portfolio]─[~] └──╼ sudo ./initialize_portfolio.sh</div>

          <div className="space-y-2">
            {bootSequence.slice(0, currentLine + 1).map((line, index) => (
              <div key={index} className="text-[#00ff99] text-sm">
                {index === currentLine ? (
                  <>
                    {line.slice(0, currentChar)}
                    {showCursor && <span className="bg-[#00ff99] text-black">█</span>}
                  </>
                ) : (
                  line
                )}
              </div>
            ))}
          </div>

          <motion.div
            className="mt-6 h-2 bg-gray-800 rounded overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-[#00ff99] to-[#ff0055]"
              initial={{ width: "0%" }}
              animate={{ width: `${((currentLine + 1) / bootSequence.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
