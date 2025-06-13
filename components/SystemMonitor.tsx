"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface SystemMonitorProps {
  darkMode: boolean
}

export default function SystemMonitor({ darkMode }: SystemMonitorProps) {
  const [stats, setStats] = useState({
    cpu: 0,
    memory: 0,
    network: 0,
    threats: 0,
  })

  useEffect(() => {
    if (!darkMode) return

    const interval = setInterval(() => {
      setStats({
        cpu: Math.floor(Math.random() * 100),
        memory: Math.floor(Math.random() * 100),
        network: Math.floor(Math.random() * 100),
        threats: Math.floor(Math.random() * 10),
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [darkMode])

  if (!darkMode) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-20 right-4 w-64 bg-black border border-[#00ff99] p-4 font-mono text-xs z-40 shadow-[0_0_30px_#00ff99]"
    >
      <div className="text-[#00ff99] mb-3 text-center font-bold">SYSTEM MONITOR</div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-[#00ff99]">
            <span>CPU:</span>
            <span>{stats.cpu}%</span>
          </div>
          <div className="w-full bg-gray-800 h-2 mt-1">
            <motion.div
              className="h-full bg-gradient-to-r from-[#00ff99] to-[#ff0055]"
              initial={{ width: 0 }}
              animate={{ width: `${stats.cpu}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[#00ff99]">
            <span>MEMORY:</span>
            <span>{stats.memory}%</span>
          </div>
          <div className="w-full bg-gray-800 h-2 mt-1">
            <motion.div
              className="h-full bg-gradient-to-r from-[#00ff99] to-[#ffff00]"
              initial={{ width: 0 }}
              animate={{ width: `${stats.memory}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[#00ff99]">
            <span>NETWORK:</span>
            <span>{stats.network}%</span>
          </div>
          <div className="w-full bg-gray-800 h-2 mt-1">
            <motion.div
              className="h-full bg-gradient-to-r from-[#00ff99] to-[#00ffff]"
              initial={{ width: 0 }}
              animate={{ width: `${stats.network}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="border-t border-[#00ff99] pt-2">
          <div className="flex justify-between text-[#ff0055]">
            <span>THREATS:</span>
            <span>{stats.threats}</span>
          </div>
        </div>

        <div className="text-[#00ff99] text-center">
          <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}>
            ● SECURE CONNECTION
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
