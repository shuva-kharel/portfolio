"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Code, Globe, Wrench, Shield, Heart, Filter } from "lucide-react";
import { skills } from "@/data/skills";

interface InteractiveSkillsProps {
  darkMode: boolean;
}

export default function InteractiveSkills({
  darkMode,
}: InteractiveSkillsProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const skillCategories = [
    { id: "all", label: "All Skills", count: skills.length },
    {
      id: "programming",
      label: "Programming",
      count: skills.filter((s) => s.category === "programming").length,
    },
    {
      id: "web",
      label: "Web Dev",
      count: skills.filter((s) => s.category === "web").length,
    },
    {
      id: "tools",
      label: "Tools",
      count: skills.filter((s) => s.category === "tools").length,
    },
    {
      id: "security",
      label: "Security",
      count: skills.filter((s) => s.category === "security").length,
    },
    {
      id: "personal",
      label: "Personal",
      count: skills.filter((s) => s.category === "personal").length,
    },
  ];

  const categoryIcons = {
    programming: Code,
    web: Globe,
    tools: Wrench,
    security: Shield,
    personal: Heart,
  };

  const categoryColors = {
    programming: darkMode ? "#00ff99" : "#3b82f6",
    web: darkMode ? "#ff0055" : "#dc2626",
    tools: darkMode ? "#ffff00" : "#f59e0b",
    security: darkMode ? "#00ffff" : "#06b6d4",
    personal: darkMode ? "#ff69b4" : "#ec4899",
  };

  const filteredSkills = skills.filter((skill) => {
    if (activeCategory === "all") return true;
    return skill.category === activeCategory;
  });

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
          My Skills & Interests
        </h3>
        <p
          className={`text-lg ${
            darkMode ? "text-[#f4f4f5]/70" : "text-gray-600"
          }`}
        >
          Technologies I'm learning and personal interests I enjoy
        </p>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-center gap-4 mb-12"
      >
        <div
          className={`flex items-center space-x-2 ${
            darkMode ? "text-[#f4f4f5]" : "text-gray-700"
          }`}
        >
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filter:</span>
        </div>

        {skillCategories.map((category) => {
          const IconComponent =
            category.id !== "all"
              ? categoryIcons[category.id as keyof typeof categoryIcons]
              : Filter;
          return (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? darkMode
                    ? "bg-[#ff0055] text-black"
                    : "bg-blue-600 text-white"
                  : darkMode
                  ? "bg-black/50 text-[#f4f4f5] border border-[#00ff99]/20 hover:border-[#00ff99]/50"
                  : "bg-white/50 text-gray-700 border border-gray-200 hover:border-blue-300"
              }`}
              data-cursor="hover"
            >
              {IconComponent && <IconComponent className="w-4 h-4" />}
              <span>{category.label}</span>
              <span
                className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  activeCategory === category.id
                    ? darkMode
                      ? "bg-black/20 text-black"
                      : "bg-white/20 text-white"
                    : darkMode
                    ? "bg-[#00ff99]/20 text-[#00ff99]"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {category.count}
              </span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Skills Grid */}
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6"
      >
        {filteredSkills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{
              scale: 1.1,
              rotate: [0, -5, 5, 0],
              transition: { duration: 0.3 },
            }}
            className={`group relative p-6 rounded-xl text-center transition-all duration-300 cursor-pointer ${
              darkMode
                ? "bg-gradient-to-br from-[#0b0c10] to-[#111215] border border-[#00ff99]/20 hover:border-[#00ff99]/50"
                : "bg-white border border-gray-200 hover:border-blue-300 shadow-lg hover:shadow-xl"
            }`}
            data-cursor="hover"
            style={{
              boxShadow: darkMode
                ? "0 0 0 rgba(0, 255, 153, 0)"
                : "0 0 0 rgba(37, 99, 235, 0)",
            }}
            onMouseEnter={(e) => {
              const color =
                categoryColors[skill.category as keyof typeof categoryColors];
              e.currentTarget.style.boxShadow = `0 10px 30px ${color}30`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 0 0 rgba(0, 0, 0, 0)";
            }}
          >
            <div className="mb-4">
              {skill.category === "personal" ? (
                <div className="text-4xl mx-auto w-12 h-12 flex items-center justify-center">
                  {skill.icon}
                </div>
              ) : (
                <img
                  src={skill.icon || "/placeholder.svg"}
                  alt={skill.name}
                  className="w-12 h-12 mx-auto transition-transform duration-300 group-hover:scale-110"
                />
              )}
            </div>
            <h3
              className={`font-semibold text-sm ${
                darkMode
                  ? "text-[#f4f4f5] group-hover:text-[#00ff99]"
                  : "text-gray-900 group-hover:text-blue-600"
              } transition-colors duration-300`}
            >
              {skill.name}
            </h3>

            {/* Category indicator */}
            <div
              className="absolute top-2 right-2 w-3 h-3 rounded-full opacity-60"
              style={{
                backgroundColor:
                  categoryColors[skill.category as keyof typeof categoryColors],
              }}
            />

            {/* Glowing border effect on hover */}
            <div
              className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                darkMode
                  ? "bg-gradient-to-r from-[#00ff99]/20 to-[#ff0055]/20"
                  : "bg-gradient-to-r from-blue-500/20 to-red-500/20"
              } -z-10 blur-xl`}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Quote Text - Positioned at the end of skills section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-20 mb-8 text-center"
      >
        <div
          className={`inline-block px-6 py-3 rounded-lg font-mono text-sm ${
            darkMode
              ? "bg-[#00ff99]/10 text-[#00ff99] border border-[#00ff99]/30"
              : "bg-blue-50 text-blue-600 border border-blue-200"
          }`}
        >
          Learning something new every day! 🚀
        </div>
      </motion.div>
    </div>
  );
}
