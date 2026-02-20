"use client";

import { motion } from "framer-motion";

interface ProjectFilterProps {
  darkMode: boolean;
  onFilterChange: (filter: string) => void;
  activeFilter: string;
}

export default function ProjectFilter({
  darkMode,
  onFilterChange,
  activeFilter,
}: ProjectFilterProps) {
  const filters = [
    { id: "all", label: "All Projects" },
    { id: "security", label: "Security" },
    { id: "web", label: "Web Apps" },
    { id: "tools", label: "Tools" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-nowrap sm:flex-wrap items-center justify-start sm:justify-center gap-2 sm:gap-3 mb-8 overflow-x-auto pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide"
    >
      {filters.map((filter) => (
        <motion.button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          whileTap={{ scale: 0.95 }}
          className={`px-3.5 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
            activeFilter === filter.id
              ? darkMode
                ? "bg-accent text-accent-foreground"
                : "bg-primary text-primary-foreground"
              : darkMode
              ? "bg-card text-foreground border border-primary/15 hover:border-primary/40"
              : "bg-card text-foreground border border-border hover:border-primary/30"
          }`}
          data-cursor="hover"
        >
          {filter.label}
        </motion.button>
      ))}
    </motion.div>
  );
}
