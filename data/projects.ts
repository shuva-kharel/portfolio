export interface Project {
  id: number
  title: string
  description: string
  techStack: string[]
  image: string
  githubUrl: string
  liveUrl?: string
  category: "security" | "web" | "tools"
}

export const projects: Project[] = [
  {
    id: 1,
    title: "SecureAuth Portal",
    description:
      "A multi-factor authentication system with biometric integration and advanced threat detection capabilities.",
    techStack: ["React", "Node.js", "MongoDB", "JWT", "WebAuthn"],
    image: "/placeholder.svg?height=300&width=400",
    githubUrl: "https://github.com/shuva-kharel/secure-auth",
    liveUrl: "https://secure-auth-demo.vercel.app",
    category: "security",
  },
  {
    id: 2,
    title: "VulnScanner Pro",
    description:
      "Automated vulnerability scanner for web applications with detailed reporting and remediation suggestions.",
    techStack: ["Python", "Flask", "SQLite", "Nmap", "OWASP ZAP"],
    image: "/placeholder.svg?height=300&width=400",
    githubUrl: "https://github.com/shuva-kharel/vuln-scanner",
    category: "security",
  },
  {
    id: 3,
    title: "CryptoChat Secure",
    description:
      "End-to-end encrypted messaging application with perfect forward secrecy and zero-knowledge architecture.",
    techStack: ["React", "WebRTC", "Socket.io", "AES-256", "RSA"],
    image: "/placeholder.svg?height=300&width=400",
    githubUrl: "https://github.com/shuva-kharel/crypto-chat",
    liveUrl: "https://crypto-chat-secure.vercel.app",
    category: "web",
  },
  {
    id: 4,
    title: "Network Intrusion Detector",
    description: "Real-time network monitoring system using machine learning to detect anomalous traffic patterns.",
    techStack: ["Python", "Scikit-learn", "Wireshark", "TensorFlow", "Docker"],
    image: "/placeholder.svg?height=300&width=400",
    githubUrl: "https://github.com/shuva-kharel/network-ids",
    category: "security",
  },
  {
    id: 5,
    title: "Secure File Vault",
    description: "Cloud-based file storage with client-side encryption, secure sharing, and audit logging.",
    techStack: ["Next.js", "AWS S3", "PostgreSQL", "AES-GCM", "Redis"],
    image: "/placeholder.svg?height=300&width=400",
    githubUrl: "https://github.com/shuva-kharel/file-vault",
    liveUrl: "https://secure-vault-demo.vercel.app",
    category: "web",
  },
  {
    id: 6,
    title: "Phishing Detection API",
    description: "Machine learning-powered API service for real-time phishing URL detection and classification.",
    techStack: ["FastAPI", "TensorFlow", "Docker", "Redis", "PostgreSQL"],
    image: "/placeholder.svg?height=300&width=400",
    githubUrl: "https://github.com/shuva-kharel/phishing-detector",
    category: "tools",
  },
  {
    id: 7,
    title: "Password Strength Analyzer",
    description: "Advanced password security analysis tool with entropy calculation and breach database checking.",
    techStack: ["Vue.js", "Express.js", "HaveIBeenPwned API", "Zxcvbn"],
    image: "/placeholder.svg?height=300&width=400",
    githubUrl: "https://github.com/shuva-kharel/password-analyzer",
    liveUrl: "https://password-strength-pro.vercel.app",
    category: "tools",
  },
  {
    id: 8,
    title: "Blockchain Security Audit",
    description: "Smart contract vulnerability scanner with automated testing and security best practices validation.",
    techStack: ["Solidity", "Web3.js", "Truffle", "Ganache", "MythX"],
    image: "/placeholder.svg?height=300&width=400",
    githubUrl: "https://github.com/shuva-kharel/blockchain-audit",
    category: "security",
  },
  {
    id: 9,
    title: "IoT Security Monitor",
    description: "Comprehensive IoT device security monitoring with firmware analysis and network traffic inspection.",
    techStack: ["Python", "Raspberry Pi", "MQTT", "Elasticsearch", "Kibana"],
    image: "/placeholder.svg?height=300&width=400",
    githubUrl: "https://github.com/shuva-kharel/iot-security",
    category: "web",
  },
]
