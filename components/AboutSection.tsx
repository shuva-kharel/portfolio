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
      year: "2022-Present",
    },
    {
      icon: Wifi,
      title: "Cybersecurity & Networking",
      description:
        "Learning about network security, ethical hacking, and digital forensics",
      year: "2023-Present",
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
    <section id="about" className="py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2
            className={`text-4xl md:text-5xl font-bold mb-6 font-mono ${
              darkMode ? "text-[#f4f4f5]" : "text-gray-900"
            }`}
          >
            {"<"}
            <span className={darkMode ? "text-[#00ff99]" : "text-blue-600"}>
              About
            </span>
            {" />"}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - About text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div
              className={`p-6 rounded-xl backdrop-blur-md ${
                darkMode
                  ? "bg-black/50 border border-[#00ff99]/20"
                  : "bg-white/50 border border-blue-200"
              }`}
            >
              <h3
                className={`text-2xl font-bold mb-4 ${
                  darkMode ? "text-[#00ff99]" : "text-blue-600"
                }`}
              >
                My Journey
              </h3>
              <p
                className={`text-lg leading-relaxed ${
                  darkMode ? "text-[#f4f4f5]/80" : "text-gray-700"
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
              className={`p-6 rounded-xl backdrop-blur-md ${
                darkMode
                  ? "bg-black/50 border border-[#ff0055]/20"
                  : "bg-white/50 border border-red-200"
              }`}
            >
              <h3
                className={`text-2xl font-bold mb-4 ${
                  darkMode ? "text-[#ff0055]" : "text-red-600"
                }`}
              >
                What Drives Me
              </h3>
              <p
                className={`text-lg leading-relaxed ${
                  darkMode ? "text-[#f4f4f5]/80" : "text-gray-700"
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
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {interests.map((interest, index) => {
              const IconComponent = interest.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={`flex items-start space-x-4 p-6 rounded-xl backdrop-blur-md transition-all duration-300 hover:scale-105 ${
                    darkMode
                      ? "bg-black/50 border border-[#00ff99]/20 hover:border-[#00ff99]/50"
                      : "bg-white/50 border border-blue-200 hover:border-blue-400"
                  }`}
                >
                  <div
                    className={`p-3 rounded-full ${
                      darkMode
                        ? "bg-[#00ff99]/20 text-[#00ff99]"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4
                        className={`font-bold text-lg ${
                          darkMode ? "text-[#f4f4f5]" : "text-gray-900"
                        }`}
                      >
                        {interest.title}
                      </h4>
                      <span
                        className={`text-sm font-mono px-3 py-1 rounded-full ${
                          darkMode
                            ? "bg-[#ff0055]/20 text-[#ff0055]"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {interest.year}
                      </span>
                    </div>
                    <p
                      className={`${
                        darkMode ? "text-[#f4f4f5]/70" : "text-gray-600"
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
