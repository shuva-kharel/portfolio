"use client"

import { motion } from "framer-motion"
import { Filter } from "lucide-react"

interface ProjectFilterProps {
  darkMode: boolean
  onFilterChange: (filter: string) => void
  activeFilter: string
}

export default function ProjectFilter({ darkMode, onFilterChange, activeFilter }: ProjectFilterProps) {
  const filters = [
    { id: "all", label: "All Projects", count: 9 },
    { id: "security", label: "Security", count: 4 },
    { id: "web", label: "Web Apps", count: 3 },
    { id: "tools", label: "Tools", count: 2 },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center justify-center gap-4 mb-8"
    >
      <div className={`flex items-center space-x-2 ${darkMode ? "text-[#f4f4f5]" : "text-gray-700"}`}>
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">Filter:</span>
      </div>

      {filters.map((filter) => (
        <motion.button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            activeFilter === filter.id
              ? darkMode
                ? "bg-[#ff0055] text-black"
                : "bg-blue-600 text-white"
              : darkMode
                ? "bg-black/50 text-[#f4f4f5] border border-[#00ff99]/20 hover:border-[#00ff99]/50"
                : "bg-white/50 text-gray-700 border border-gray-200 hover:border-blue-300"
          }`}
          data-cursor="hover"
        >
          <span>{filter.label}</span>
          <span
            className={`ml-2 px-2 py-1 text-xs rounded-full ${
              activeFilter === filter.id
                ? darkMode
                  ? "bg-black/20 text-black"
                  : "bg-white/20 text-white"
                : darkMode
                  ? "bg-[#00ff99]/20 text-[#00ff99]"
                  : "bg-blue-100 text-blue-600"
            }`}
          >
            {filter.count}
          </span>
        </motion.button>
      ))}
    </motion.div>
  )
}
