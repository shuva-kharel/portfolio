"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Code, Shield, Database, Cloud, Terminal } from "lucide-react"

interface SkillsShowcaseProps {
  darkMode: boolean
}

export default function SkillsShowcase({ darkMode }: SkillsShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState("frontend")

  const skillCategories = {
    frontend: {
      icon: Code,
      title: "Frontend",
      skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Framer Motion"],
      color: darkMode ? "#00ff99" : "#3b82f6",
    },
    security: {
      icon: Shield,
      title: "Security",
      skills: ["Penetration Testing", "OWASP", "Burp Suite", "Nmap", "Metasploit"],
      color: darkMode ? "#ff0055" : "#dc2626",
    },
    backend: {
      icon: Database,
      title: "Backend",
      skills: ["Node.js", "Python", "PostgreSQL", "MongoDB", "Redis"],
      color: darkMode ? "#ffff00" : "#f59e0b",
    },
    cloud: {
      icon: Cloud,
      title: "Cloud & DevOps",
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform"],
      color: darkMode ? "#00ffff" : "#06b6d4",
    },
    tools: {
      icon: Terminal,
      title: "Tools",
      skills: ["Git", "Linux", "Wireshark", "John the Ripper", "Aircrack-ng"],
      color: darkMode ? "#ff8800" : "#8b5cf6",
    },
  }

  return (
    <div className="mb-16">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h3 className={`text-2xl font-bold font-mono mb-4 ${darkMode ? "text-[#f4f4f5]" : "text-gray-900"}`}>
          Interactive Skills
        </h3>
      </motion.div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {Object.entries(skillCategories).map(([key, category]) => {
          const IconComponent = category.icon
          return (
            <motion.button
              key={key}
              onClick={() => setActiveCategory(key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeCategory === key
                  ? darkMode
                    ? "bg-[#00ff99]/20 text-[#00ff99] border border-[#00ff99]/50"
                    : "bg-blue-100 text-blue-600 border border-blue-300"
                  : darkMode
                    ? "bg-black/50 text-[#f4f4f5] border border-[#00ff99]/20 hover:border-[#00ff99]/40"
                    : "bg-white/50 text-gray-700 border border-gray-200 hover:border-blue-300"
              }`}
              data-cursor="hover"
            >
              <IconComponent className="w-4 h-4" />
              <span className="text-sm">{category.title}</span>
            </motion.button>
          )
        })}
      </div>

      {/* Skills Display */}
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`p-6 rounded-xl backdrop-blur-md ${
          darkMode ? "bg-black/50 border border-[#00ff99]/20" : "bg-white/50 border border-blue-200"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillCategories[activeCategory as keyof typeof skillCategories].skills.map((skill, index) => (
            <motion.div
              key={skill}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-lg text-center font-medium transition-all duration-300 ${
                darkMode
                  ? "bg-[#00ff99]/10 text-[#00ff99] hover:bg-[#00ff99]/20"
                  : "bg-blue-50 text-blue-600 hover:bg-blue-100"
              }`}
            >
              {skill}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
