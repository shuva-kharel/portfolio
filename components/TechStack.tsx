"use client";

import { motion } from "framer-motion";
import { Code, Shield, Database, Cloud, Terminal, Zap } from "lucide-react";

interface TechStackProps {
  darkMode: boolean;
}

export default function TechStack({ darkMode }: TechStackProps) {
  const techCategories = [
    {
      icon: Code,
      title: "Frontend",
      techs: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
      color: darkMode ? "#00ff99" : "#3b82f6",
    },
    {
      icon: Shield,
      title: "Security",
      techs: ["Burp Suite", "Nmap", "Metasploit", "OWASP"],
      color: darkMode ? "#ff0055" : "#dc2626",
    },
    {
      icon: Database,
      title: "Backend",
      techs: ["Node.js", "Python", "PostgreSQL", "MongoDB"],
      color: darkMode ? "#ffff00" : "#f59e0b",
    },
    {
      icon: Cloud,
      title: "Cloud",
      techs: ["AWS", "Docker", "Kubernetes", "CI/CD"],
      color: darkMode ? "#00ffff" : "#06b6d4",
    },
    {
      icon: Terminal,
      title: "Tools",
      techs: ["Git", "Linux", "Wireshark", "John"],
      color: darkMode ? "#ff8800" : "#8b5cf6",
    },
    {
      icon: Zap,
      title: "Frameworks",
      techs: ["Express.js", "FastAPI", "Flask", "Vue.js"],
      color: darkMode ? "#ff69b4" : "#ec4899",
    },
  ];

  return (
    <div className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h3
          className={`text-3xl font-bold font-mono mb-4 ${
            darkMode ? "text-[#f4f4f5]" : "text-gray-900"
          }`}
        >
          Tech Arsenal
        </h3>
        <p
          className={`text-lg ${
            darkMode ? "text-[#f4f4f5]/70" : "text-gray-600"
          }`}
        >
          Technologies I use to build secure and scalable solutions
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {techCategories.map((category, index) => {
          const IconComponent = category.icon;
          return (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className={`p-6 rounded-xl backdrop-blur-md transition-all duration-300 ${
                darkMode
                  ? "bg-black/50 border border-[#00ff99]/20 hover:border-[#00ff99]/50"
                  : "bg-white/50 border border-blue-200 hover:border-blue-400"
              }`}
              style={{
                boxShadow: `0 0 0 rgba(${category.color}, 0)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 10px 30px ${category.color}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `0 0 0 rgba(${category.color}, 0)`;
              }}
            >
              <div className="flex items-center mb-4">
                <div
                  className="p-3 rounded-full mr-4"
                  style={{
                    backgroundColor: `${category.color}20`,
                    color: category.color,
                  }}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
                <h4
                  className={`text-xl font-bold ${
                    darkMode ? "text-[#f4f4f5]" : "text-gray-900"
                  }`}
                >
                  {category.title}
                </h4>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {category.techs.map((tech, techIndex) => (
                  <motion.div
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: techIndex * 0.1 }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium text-center ${
                      darkMode
                        ? "bg-[#00ff99]/10 text-[#00ff99]"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {tech}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
