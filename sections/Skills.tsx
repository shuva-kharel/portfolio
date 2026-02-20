"use client"

import { motion } from "framer-motion"
import InteractiveSkills from "@/components/InteractiveSkills"

interface SkillsProps {
  darkMode: boolean
}

export default function Skills({ darkMode }: SkillsProps) {
  return (
    <section id="skills" className="py-16 sm:py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 font-mono text-balance ${
              darkMode ? "text-foreground" : "text-foreground"
            }`}
          >
            {"<"}
            <span className="text-primary">Skills</span>
            {" />"}
          </h2>
          <p className={`text-base sm:text-xl max-w-3xl mx-auto ${darkMode ? "text-foreground/60" : "text-muted-foreground"}`}>
            Technologies and tools I use to build secure, scalable applications
          </p>
        </motion.div>

        <InteractiveSkills darkMode={darkMode} />
      </div>
    </section>
  )
}
