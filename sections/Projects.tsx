"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { ExternalLink, Github, Eye } from "lucide-react"
import { projects } from "@/data/projects"
import ProjectFilter from "@/components/ProjectFilter"

interface ProjectsProps {
  darkMode: boolean
}

export default function Projects({ darkMode }: ProjectsProps) {
  const [visibleProjects, setVisibleProjects] = useState(6)
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)
  const [activeFilter, setActiveFilter] = useState("all")

  // Filter projects based on active filter
  const filteredProjects = projects.filter((project) => {
    if (activeFilter === "all") return true
    if (activeFilter === "security") return project.category === "security"
    if (activeFilter === "web") return project.category === "web"
    if (activeFilter === "tools") return project.category === "tools"
    return true
  })

  const showMoreProjects = () => {
    setVisibleProjects((prev) => Math.min(prev + 3, filteredProjects.length))
  }

  return (
    <section id="projects" className="py-20 relative">
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
            <span className={darkMode ? "text-[#00ff99]" : "text-blue-600"}>Projects</span>
            {" />"}
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${darkMode ? "text-[#f4f4f5]/70" : "text-gray-600"}`}>
            A collection of cybersecurity tools, web applications, and security research projects
          </p>
        </motion.div>

        <ProjectFilter darkMode={darkMode} onFilterChange={setActiveFilter} activeFilter={activeFilter} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredProjects.slice(0, visibleProjects).map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              onHoverStart={() => setHoveredProject(index)}
              onHoverEnd={() => setHoveredProject(null)}
              className={`relative group rounded-xl overflow-hidden transition-all duration-300 ${
                darkMode
                  ? "bg-gradient-to-br from-[#0b0c10] to-[#111215] border border-[#00ff99]/20"
                  : "bg-white border border-gray-200 shadow-lg"
              }`}
              style={{
                boxShadow:
                  hoveredProject === index
                    ? darkMode
                      ? "0 20px 40px rgba(0, 255, 153, 0.2)"
                      : "0 20px 40px rgba(37, 99, 235, 0.2)"
                    : "none",
              }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div
                  className={`absolute inset-0 transition-opacity duration-300 ${
                    hoveredProject === index ? "opacity-100" : "opacity-0"
                  } ${darkMode ? "bg-[#00ff99]/20" : "bg-blue-600/20"}`}
                />

                <div
                  className={`absolute top-4 right-4 flex space-x-2 transition-opacity duration-300 ${
                    hoveredProject === index ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 rounded-full transition-colors duration-200 ${
                        darkMode
                          ? "bg-[#ff0055] hover:bg-[#00ff99] text-black"
                          : "bg-red-600 hover:bg-blue-600 text-white"
                      }`}
                      data-cursor="hover"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-full transition-colors duration-200 ${
                      darkMode
                        ? "bg-[#ff0055] hover:bg-[#00ff99] text-black"
                        : "bg-red-600 hover:bg-blue-600 text-white"
                    }`}
                    data-cursor="hover"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="p-6">
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? "text-[#f4f4f5]" : "text-gray-900"}`}>
                  {project.title}
                </h3>
                <p className={`text-sm mb-4 ${darkMode ? "text-[#f4f4f5]/70" : "text-gray-600"}`}>
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className={`px-3 py-1 text-xs font-mono rounded-full ${
                        darkMode
                          ? "bg-[#00ff99]/20 text-[#00ff99] border border-[#00ff99]/30"
                          : "bg-blue-100 text-blue-800 border border-blue-200"
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex space-x-3">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        darkMode
                          ? "bg-[#ff0055] hover:bg-[#00ff99] text-black"
                          : "bg-red-600 hover:bg-blue-600 text-white"
                      }`}
                      data-cursor="hover"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Live Demo</span>
                    </a>
                  )}
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors duration-200 ${
                      darkMode
                        ? "border-[#00ff99]/30 text-[#00ff99] hover:bg-[#00ff99]/10"
                        : "border-blue-300 text-blue-600 hover:bg-blue-50"
                    }`}
                    data-cursor="hover"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {visibleProjects < filteredProjects.length && (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center">
            <motion.button
              onClick={showMoreProjects}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-3 font-semibold rounded-lg transition-all duration-300 ${
                darkMode
                  ? "bg-[#ff0055] hover:bg-[#00ff99] text-black hover:shadow-[0_0_20px_#00ff99]"
                  : "bg-red-600 hover:bg-blue-600 text-white hover:shadow-[0_0_20px_#2563eb]"
              }`}
              data-cursor="hover"
            >
              See More Projects ({filteredProjects.length - visibleProjects} remaining)
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  )
}
