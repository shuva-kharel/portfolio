"use client"

import { motion } from "framer-motion"
import InteractiveSkills from "@/components/InteractiveSkills"

interface SkillsProps {
  darkMode: boolean
}

export default function Skills({ darkMode }: SkillsProps) {
  return (
    <section id="skills" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2
            className={`text-4xl md:text-5xl font-bold mb-6 font-mono ${darkMode ? "text-[#f4f4f5]" : "text-gray-900"}`}
          >
            {"<"}
            <span className={darkMode ? "text-[#00ff99]" : "text-blue-600"}>Skills</span>
            {" />"}
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${darkMode ? "text-[#f4f4f5]/70" : "text-gray-600"}`}>
            Technologies and tools I use to build secure, scalable applications
          </p>
        </motion.div>

        <InteractiveSkills darkMode={darkMode} />
      </div>
    </section>
  )
}
