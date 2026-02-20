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
      color: darkMode ? "#00ff99" : "hsl(162, 72%, 45%)",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://linkedin.com/in/shuva-kharel",
      color: darkMode ? "#00ff99" : "hsl(162, 72%, 45%)",
    },
    {
      name: "Email",
      icon: Mail,
      url: "mailto:admin@shuvakharel.com.np",
      color: darkMode ? "#ff0055" : "hsl(347, 77%, 50%)",
    },
  ]

  return (
    <section id="contact" className="py-16 sm:py-20 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-10 sm:mb-16"
        >
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 font-mono text-balance ${
              darkMode ? "text-foreground" : "text-foreground"
            }`}
          >
            {"<"}
            <span className="text-primary">Contact</span>
            {" />"}
          </h2>
          <p className={`text-base sm:text-xl max-w-2xl mx-auto ${darkMode ? "text-foreground/60" : "text-muted-foreground"}`}>
            Ready to collaborate on cybersecurity projects or discuss secure development practices? Let's connect!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex justify-center gap-5 sm:gap-8 mb-12 sm:mb-16"
        >
          {contactLinks.map((link, index) => {
            const IconComponent = link.icon
            return (
              <motion.a
                key={link.name}
                href={link.url}
                target={link.name !== "Email" ? "_blank" : undefined}
                rel={link.name !== "Email" ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.1,
                  y: -4,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.95 }}
                className={`group relative flex flex-col items-center gap-2 sm:gap-3`}
                data-cursor="hover"
              >
                <div
                  className={`p-4 sm:p-5 rounded-2xl transition-all duration-300 ${
                    darkMode
                      ? "bg-card border border-primary/15 hover:border-primary/50 group-hover:shadow-[0_0_24px_rgba(0,255,153,0.15)]"
                      : "bg-card border border-border hover:border-primary/40 shadow-sm group-hover:shadow-lg"
                  }`}
                >
                  <IconComponent
                    className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors duration-300 ${
                      darkMode
                        ? "text-foreground/70 group-hover:text-primary"
                        : "text-muted-foreground group-hover:text-primary"
                    }`}
                  />
                </div>

                <span
                  className={`text-xs sm:text-sm font-medium transition-colors duration-300 ${
                    darkMode
                      ? "text-foreground/50 group-hover:text-primary"
                      : "text-muted-foreground group-hover:text-primary"
                  }`}
                >
                  {link.name}
                </span>
              </motion.a>
            )
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className={`border-t pt-6 sm:pt-8 ${darkMode ? "border-border" : "border-border"}`}
        >
          <p className={`text-xs sm:text-sm font-mono ${darkMode ? "text-foreground/40" : "text-muted-foreground"}`}>
            {"© 2025 Shuva Kharel. Built with React & Tailwind CSS."}
          </p>
          <p className={`text-xs mt-2 ${darkMode ? "text-primary/50" : "text-primary/60"}`}>
            Securing the digital world, one line of code at a time.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
