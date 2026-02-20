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
    { id: "all", label: "All", count: skills.length },
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
    programming: darkMode ? "#00ff99" : "hsl(162, 72%, 45%)",
    web: darkMode ? "#ff0055" : "hsl(347, 77%, 50%)",
    tools: darkMode ? "#ffff00" : "hsl(45, 93%, 47%)",
    security: darkMode ? "#00ffff" : "hsl(187, 92%, 40%)",
    personal: darkMode ? "#ff69b4" : "hsl(330, 80%, 60%)",
  };

  const filteredSkills = skills.filter((skill) => {
    if (activeCategory === "all") return true;
    return skill.category === activeCategory;
  });

  return (
    <div className="py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-8 sm:mb-12"
      >
        <h3
          className={`text-2xl sm:text-3xl font-bold font-mono mb-3 ${
            darkMode ? "text-foreground" : "text-foreground"
          }`}
        >
          My Skills & Interests
        </h3>
        <p
          className={`text-sm sm:text-lg ${
            darkMode ? "text-foreground/60" : "text-muted-foreground"
          }`}
        >
          Technologies I'm learning and personal interests I enjoy
        </p>
      </motion.div>

      {/* Category Filter - scrollable on mobile */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8 sm:mb-12"
      >
        <div className="flex flex-nowrap sm:flex-wrap items-center justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          {skillCategories.map((category) => {
            const IconComponent =
              category.id !== "all"
                ? categoryIcons[category.id as keyof typeof categoryIcons]
                : Filter;
            return (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                  activeCategory === category.id
                    ? darkMode
                      ? "bg-accent text-accent-foreground"
                      : "bg-primary text-primary-foreground"
                    : darkMode
                    ? "bg-card text-foreground border border-primary/15 hover:border-primary/40"
                    : "bg-card text-foreground border border-border hover:border-primary/30"
                }`}
                data-cursor="hover"
              >
                {IconComponent && <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                <span>{category.label}</span>
                <span
                  className={`px-1.5 py-0.5 text-xs rounded-md ${
                    activeCategory === category.id
                      ? "bg-background/20 text-inherit"
                      : darkMode
                      ? "bg-primary/10 text-primary"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {category.count}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Skills Grid */}
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5"
      >
        {filteredSkills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{
              scale: 1.06,
              transition: { duration: 0.2 },
            }}
            className={`group relative p-3 sm:p-5 rounded-xl text-center transition-all duration-300 cursor-pointer ${
              darkMode
                ? "bg-card border border-primary/15 hover:border-primary/40"
                : "bg-card border border-border hover:border-primary/30 hover:shadow-md"
            }`}
            data-cursor="hover"
            onMouseEnter={(e) => {
              const color =
                categoryColors[skill.category as keyof typeof categoryColors];
              e.currentTarget.style.boxShadow = `0 8px 24px ${color}20`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div className="mb-2 sm:mb-3">
              {skill.category === "personal" ? (
                <div className="text-2xl sm:text-3xl mx-auto w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                  {skill.icon}
                </div>
              ) : (
                <img
                  src={skill.icon || "/placeholder.svg"}
                  alt={skill.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 mx-auto transition-transform duration-300 group-hover:scale-110"
                />
              )}
            </div>
            <h3
              className={`font-semibold text-xs sm:text-sm ${
                darkMode
                  ? "text-foreground group-hover:text-primary"
                  : "text-foreground group-hover:text-primary"
              } transition-colors duration-300`}
            >
              {skill.name}
            </h3>

            {/* Category indicator */}
            <div
              className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full opacity-50"
              style={{
                backgroundColor:
                  categoryColors[skill.category as keyof typeof categoryColors],
              }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Quote Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
        className="mt-12 sm:mt-16 text-center"
      >
        <div
          className={`inline-block px-5 py-2.5 rounded-lg font-mono text-xs sm:text-sm ${
            darkMode
              ? "bg-primary/10 text-primary border border-primary/20"
              : "bg-primary/5 text-primary border border-primary/15"
          }`}
        >
          Learning something new every day
        </div>
      </motion.div>
    </div>
  );
}
