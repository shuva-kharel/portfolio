"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Mail } from "lucide-react"

interface ContactProps {
  darkMode: boolean
}

export default function Contact({ darkMode }: ContactProps) {
  const contactLinks = [
    {
      name: "GitHub",
      icon: Github,
      url: "https://github.com/shuva-kharel",
      color: darkMode ? "#00ff99" : "#2563eb",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://linkedin.com/in/shuva-kharel",
      color: darkMode ? "#00ff99" : "#2563eb",
    },
    {
      name: "Email",
      icon: Mail,
      url: "mailto:admin@shuvakharel.com.np",
      color: darkMode ? "#ff0055" : "#dc2626",
    },
  ]

  return (
    <section id="contact" className="py-20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2
            className={`text-4xl md:text-5xl font-bold mb-6 font-mono ${darkMode ? "text-[#f4f4f5]" : "text-gray-900"}`}
          >
            {"<"}
            <span className={darkMode ? "text-[#00ff99]" : "text-blue-600"}>Contact</span>
            {" />"}
          </h2>
          <p className={`text-xl max-w-2xl mx-auto mb-8 ${darkMode ? "text-[#f4f4f5]/70" : "text-gray-600"}`}>
            Ready to collaborate on cybersecurity projects or discuss secure development practices? Let's connect!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center space-x-8 mb-16"
        >
          {contactLinks.map((link, index) => {
            const IconComponent = link.icon
            return (
              <motion.a
                key={link.name}
                href={link.url}
                target={link.name !== "Email" ? "_blank" : undefined}
                rel={link.name !== "Email" ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  scale: 1.2,
                  rotate: [0, -10, 10, 0],
                  transition: { duration: 0.3 },
                }}
                whileTap={{ scale: 0.9 }}
                className={`group relative p-6 rounded-full transition-all duration-300 ${
                  darkMode
                    ? "bg-gradient-to-br from-[#0b0c10] to-[#111215] border-2 border-[#00ff99]/30 hover:border-[#00ff99]"
                    : "bg-white border-2 border-gray-300 hover:border-blue-500 shadow-lg hover:shadow-xl"
                }`}
                data-cursor="hover"
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 30px ${link.color}40`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none"
                }}
              >
                <IconComponent
                  className={`w-8 h-8 transition-colors duration-300 ${
                    darkMode ? "text-[#f4f4f5] group-hover:text-[#00ff99]" : "text-gray-700 group-hover:text-blue-600"
                  }`}
                  style={{
                    filter: `drop-shadow(0 0 10px ${link.color}00)`,
                    transition: "filter 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.filter = `drop-shadow(0 0 10px ${link.color}80)`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = `drop-shadow(0 0 10px ${link.color}00)`
                  }}
                />

                {/* Ripple effect */}
                <div
                  className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    darkMode ? "bg-[#00ff99]/10" : "bg-blue-500/10"
                  } animate-ping`}
                />

                {/* Tooltip */}
                <div
                  className={`absolute -bottom-12 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    darkMode ? "bg-[#0b0c10] text-[#00ff99] border border-[#00ff99]/30" : "bg-gray-900 text-white"
                  }`}
                >
                  {link.name}
                </div>
              </motion.a>
            )
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className={`border-t pt-8 ${darkMode ? "border-[#00ff99]/20" : "border-gray-200"}`}
        >
          <p className={`text-sm font-mono ${darkMode ? "text-[#f4f4f5]/50" : "text-gray-500"}`}>
            © 2025 Shuva Kharel. Built with React & Tailwind CSS.
          </p>
          <p className={`text-xs mt-2 ${darkMode ? "text-[#00ff99]/70" : "text-blue-600/70"}`}>
            Securing the digital world, one line of code at a time.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
