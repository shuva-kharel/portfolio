"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"

interface NavbarProps {
  darkMode: boolean
}

export default function Navbar({ darkMode }: NavbarProps) {
  const [activeSection, setActiveSection] = useState("home")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "contact", label: "Contact" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => document.getElementById(item.id))
      const scrollPosition = window.scrollY + 200

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id)
          break
        }
      }

      // Special handling for contact section at bottom of page
      const contactSection = document.getElementById("contact")
      if (contactSection) {
        const windowHeight = window.innerHeight
        const documentHeight = document.documentElement.scrollHeight

        if (window.scrollY + windowHeight >= documentHeight - 100) {
          setActiveSection("contact")
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-all duration-300 ${
        darkMode ? "bg-[#0b0c10]/80 border-[#00ff99]/20" : "bg-white/20 border-blue-200/30 shadow-lg shadow-blue-500/5"
      }`}
      style={{
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`font-bold text-xl font-mono cursor-pointer ${
              darkMode
                ? "text-[#00ff99]"
                : "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            }`}
            onClick={() => scrollToSection("home")}
          >
            {"<Shuva />"}
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  activeSection === item.id
                    ? darkMode
                      ? "text-[#00ff99]"
                      : "text-blue-600 font-semibold"
                    : darkMode
                      ? "text-[#f4f4f5] hover:text-[#00ff99]"
                      : "text-gray-700 hover:text-blue-600"
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                      darkMode ? "bg-[#00ff99]" : "bg-gradient-to-r from-blue-500 to-purple-600"
                    }`}
                    style={{
                      boxShadow: darkMode ? "0 0 10px #00ff99" : "0 0 10px rgba(59, 130, 246, 0.8)",
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? (
              <X className={`w-6 h-6 ${darkMode ? "text-[#f4f4f5]" : "text-gray-800"}`} />
            ) : (
              <Menu className={`w-6 h-6 ${darkMode ? "text-[#f4f4f5]" : "text-gray-800"}`} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <motion.div initial={false} animate={{ height: isMenuOpen ? "auto" : 0 }} className="md:hidden overflow-hidden">
          <div className="py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`block w-full text-left px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-lg ${
                  activeSection === item.id
                    ? darkMode
                      ? "text-[#00ff99] bg-[#00ff99]/10"
                      : "text-blue-600 bg-blue-50 font-semibold"
                    : darkMode
                      ? "text-[#f4f4f5] hover:text-[#00ff99]"
                      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  )
}
