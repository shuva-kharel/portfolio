"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface HackerTerminalProps {
  darkMode: boolean;
}

export default function HackerTerminal({ darkMode }: HackerTerminalProps) {
  const [commands, setCommands] = useState<string[]>([]);
  const [currentCommand, setCurrentCommand] = useState("");

  const hackerCommands = [
    "nmap -sS -O target.com",
    "sqlmap -u 'http://target.com/page.php?id=1'",
    "hydra -l admin -P passwords.txt ssh://target.com",
    "metasploit > use exploit/windows/smb/ms17_010_eternalblue",
    "wireshark -i eth0 -f 'tcp port 80'",
    "john --wordlist=rockyou.txt hashes.txt",
    "aircrack-ng -w wordlist.txt capture.cap",
    "burpsuite --proxy=127.0.0.1:8080",
  ];

  useEffect(() => {
    if (!darkMode) return;

    const interval = setInterval(() => {
      const randomCommand =
        hackerCommands[Math.floor(Math.random() * hackerCommands.length)];
      setCurrentCommand("");

      let index = 0;
      const typeInterval = setInterval(() => {
        if (index < randomCommand.length) {
          setCurrentCommand(randomCommand.slice(0, index + 1));
          index++;
        } else {
          clearInterval(typeInterval);
          setTimeout(() => {
            setCommands((prev) => [...prev.slice(-4), randomCommand]);
            setCurrentCommand("");
          }, 1000);
        }
      }, 50);
    }, 4000);

    return () => clearInterval(interval);
  }, [darkMode]);

  if (!darkMode) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed bottom-4 left-4 w-96 bg-black border border-[#00ff99] p-4 font-mono text-sm z-40 shadow-[0_0_30px_#00ff99]"
    >
      <div className="flex items-center mb-2">
        <div className="w-3 h-3 bg-[#ff0055] rounded-full mr-2"></div>
        <div className="w-3 h-3 bg-[#ffff00] rounded-full mr-2"></div>
        <div className="w-3 h-3 bg-[#00ff99] rounded-full mr-2"></div>
        <span className="text-[#00ff99] text-xs">root@shuva-terminal</span>
      </div>

      <div className="space-y-1">
        {commands.map((cmd, index) => (
          <div key={index} className="text-[#00ff99]">
            <span className="text-[#ff0055]">$</span> {cmd}
          </div>
        ))}
        {currentCommand && (
          <div className="text-[#00ff99]">
            <span className="text-[#ff0055]">$</span> {currentCommand}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
              className="bg-[#00ff99] text-black ml-1"
            >
              █
            </motion.span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
