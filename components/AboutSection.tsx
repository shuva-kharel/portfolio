"use client";

import { motion } from "framer-motion";
import { BookOpen, Code, Wifi } from "lucide-react";

interface AboutSectionProps {
  darkMode: boolean;
}

export default function AboutSection({ darkMode }: AboutSectionProps) {
  const interests = [
    {
      icon: Code,
      title: "Programming & Development",
      description:
        "Building web applications and exploring different programming languages",
      year: "2018-Present",
    },
    {
      icon: Wifi,
      title: "Cybersecurity & Networking",
      description:
        "Learning about network security, ethical hacking, and digital forensics",
      year: "2025-Present",
    },
    {
      icon: BookOpen,
      title: "Continuous Learning",
      description:
        "Always exploring new technologies and computer science concepts",
      year: "Always",
    },
  ];

  return (
    <section id="about" className="py-16 sm:py-20 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-mono text-balance ${
              darkMode ? "text-foreground" : "text-foreground"
            }`}
          >
            {"<"}
            <span className="text-primary">About</span>
            {" />"}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start">
          {/* Left side - About text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col gap-4 sm:gap-6"
          >
            <div
              className={`p-5 sm:p-6 rounded-xl backdrop-blur-md ${
                darkMode
                  ? "bg-card/60 border border-primary/15"
                  : "bg-card border border-border"
              }`}
            >
              <h3
                className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 ${
                  darkMode ? "text-primary" : "text-primary"
                }`}
              >
                My Journey
              </h3>
              <p
                className={`text-base leading-relaxed ${
                  darkMode ? "text-foreground/80" : "text-muted-foreground"
                }`}
              >
                I'm a high school student from Kathmandu, Nepal, with a deep
                passion for technology and cybersecurity. I love exploring how
                computers work, building projects, and learning about digital
                security. My goal is to pursue computer science and contribute
                to making the digital world safer.
              </p>
            </div>

            <div
              className={`p-5 sm:p-6 rounded-xl backdrop-blur-md ${
                darkMode
                  ? "bg-card/60 border border-accent/15"
                  : "bg-card border border-border"
              }`}
            >
              <h3
                className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 ${
                  darkMode ? "text-accent" : "text-accent"
                }`}
              >
                What Drives Me
              </h3>
              <p
                className={`text-base leading-relaxed ${
                  darkMode ? "text-foreground/80" : "text-muted-foreground"
                }`}
              >
                Technology fascinates me because it's constantly evolving. I
                enjoy learning new programming languages, understanding network
                protocols, and exploring cybersecurity concepts. Every day
                brings new challenges and opportunities to grow.
              </p>
            </div>
          </motion.div>

          {/* Right side - Interests */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            viewport={{ once: true }}
            className="flex flex-col gap-4 sm:gap-6"
          >
            {interests.map((interest, index) => {
              const IconComponent = interest.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`flex items-start gap-4 p-5 sm:p-6 rounded-xl backdrop-blur-md transition-all duration-300 hover:translate-y-[-2px] ${
                    darkMode
                      ? "bg-card/60 border border-primary/15 hover:border-primary/40"
                      : "bg-card border border-border hover:border-primary/40 hover:shadow-md"
                  }`}
                >
                  <div
                    className={`p-2.5 sm:p-3 rounded-xl flex-shrink-0 ${
                      darkMode
                        ? "bg-primary/15 text-primary"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mb-2">
                      <h4
                        className={`font-bold text-base sm:text-lg ${
                          darkMode ? "text-foreground" : "text-foreground"
                        }`}
                      >
                        {interest.title}
                      </h4>
                      <span
                        className={`text-xs font-mono px-2.5 py-1 rounded-full w-fit ${
                          darkMode
                            ? "bg-accent/15 text-accent"
                            : "bg-accent/10 text-accent"
                        }`}
                      >
                        {interest.year}
                      </span>
                    </div>
                    <p
                      className={`text-sm sm:text-base ${
                        darkMode ? "text-foreground/60" : "text-muted-foreground"
                      }`}
                    >
                      {interest.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
