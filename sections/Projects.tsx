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
    <section id="projects" className="py-16 sm:py-20 relative">
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
            <span className="text-primary">Projects</span>
            {" />"}
          </h2>
          <p className={`text-base sm:text-xl max-w-3xl mx-auto ${darkMode ? "text-foreground/60" : "text-muted-foreground"}`}>
            A collection of cybersecurity tools, web applications, and security research projects
          </p>
        </motion.div>

        <ProjectFilter darkMode={darkMode} onFilterChange={setActiveFilter} activeFilter={activeFilter} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 mb-12">
          {filteredProjects.slice(0, visibleProjects).map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              onHoverStart={() => setHoveredProject(index)}
              onHoverEnd={() => setHoveredProject(null)}
              className={`relative group rounded-xl overflow-hidden transition-all duration-300 ${
                darkMode
                  ? "bg-card border border-primary/15 hover:border-primary/40"
                  : "bg-card border border-border hover:border-primary/30 hover:shadow-lg"
              }`}
              style={{
                boxShadow:
                  hoveredProject === index
                    ? darkMode
                      ? "0 16px 40px rgba(0, 255, 153, 0.12)"
                      : "0 16px 40px rgba(0, 0, 0, 0.1)"
                    : "none",
              }}
            >
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className={`absolute inset-0 transition-opacity duration-300 ${
                    hoveredProject === index ? "opacity-100" : "opacity-0"
                  } ${darkMode ? "bg-primary/15" : "bg-primary/10"}`}
                />

                {/* Quick action buttons on hover */}
                <div
                  className={`absolute top-3 right-3 flex gap-2 transition-all duration-300 ${
                    hoveredProject === index ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                  }`}
                >
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 rounded-lg backdrop-blur-md transition-colors duration-200 ${
                        darkMode
                          ? "bg-accent/90 hover:bg-primary/90 text-accent-foreground hover:text-primary-foreground"
                          : "bg-accent/90 hover:bg-primary/90 text-accent-foreground hover:text-primary-foreground"
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
                    className={`p-2 rounded-lg backdrop-blur-md transition-colors duration-200 ${
                      darkMode
                        ? "bg-primary/90 hover:bg-accent/90 text-primary-foreground hover:text-accent-foreground"
                        : "bg-foreground/80 hover:bg-foreground text-background"
                    }`}
                    data-cursor="hover"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="p-4 sm:p-5">
                <h3 className={`text-lg font-bold mb-2 ${darkMode ? "text-foreground" : "text-foreground"}`}>
                  {project.title}
                </h3>
                <p className={`text-sm mb-4 leading-relaxed ${darkMode ? "text-foreground/60" : "text-muted-foreground"}`}>
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.techStack.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className={`px-2.5 py-1 text-xs font-mono rounded-md ${
                        darkMode
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "bg-primary/5 text-primary border border-primary/15"
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        darkMode
                          ? "bg-accent hover:bg-primary text-accent-foreground hover:text-primary-foreground"
                          : "bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground"
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
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors duration-200 ${
                      darkMode
                        ? "border-primary/25 text-primary hover:bg-primary/10"
                        : "border-border text-foreground hover:bg-secondary"
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
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className={`px-6 sm:px-8 py-3 font-semibold rounded-xl transition-all duration-300 ${
                darkMode
                  ? "bg-accent hover:bg-primary text-accent-foreground hover:text-primary-foreground hover:shadow-[0_0_30px_rgba(0,255,153,0.2)]"
                  : "bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground shadow-md hover:shadow-lg"
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
