"use client"

import { useEffect, useRef } from "react"

interface NetworkGraphProps {
  darkMode: boolean
}

export default function NetworkGraph({ darkMode }: NetworkGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!darkMode) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const nodes: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      connections: number[]
      type: "server" | "client" | "router"
      activity: number
    }> = []

    // Create network nodes
    for (let i = 0; i < 20; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 8 + 4,
        connections: [],
        type: ["server", "client", "router"][Math.floor(Math.random() * 3)] as "server" | "client" | "router",
        activity: Math.random(),
      })
    }

    // Create connections
    nodes.forEach((node, i) => {
      const connectionCount = Math.floor(Math.random() * 3) + 1
      for (let j = 0; j < connectionCount; j++) {
        const targetIndex = Math.floor(Math.random() * nodes.length)
        if (targetIndex !== i && !node.connections.includes(targetIndex)) {
          node.connections.push(targetIndex)
        }
      }
    })

    let animationTime = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      animationTime += 0.016

      // Update and draw nodes
      nodes.forEach((node, i) => {
        // Update position
        node.x += node.vx
        node.y += node.vy

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1

        // Update activity
        node.activity = 0.3 + 0.7 * Math.sin(animationTime * 2 + i)

        // Draw connections
        node.connections.forEach((targetIndex) => {
          const target = nodes[targetIndex]
          if (target) {
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(target.x, target.y)

            // Animated data packets
            const progress = (Math.sin(animationTime * 3 + i) + 1) / 2
            const packetX = node.x + (target.x - node.x) * progress
            const packetY = node.y + (target.y - node.y) * progress

            ctx.strokeStyle = `rgba(0, 255, 153, ${0.3 * node.activity})`
            ctx.lineWidth = 1
            ctx.stroke()

            // Draw data packet
            ctx.beginPath()
            ctx.arc(packetX, packetY, 2, 0, Math.PI * 2)
            ctx.fillStyle = "#ff0055"
            ctx.fill()
          }
        })

        // Draw node
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2)

        const colors = {
          server: "#ff0055",
          client: "#00ff99",
          router: "#ffff00",
        }

        ctx.fillStyle = colors[node.type]
        ctx.globalAlpha = node.activity
        ctx.fill()
        ctx.globalAlpha = 1

        // Draw node label
        ctx.fillStyle = "#00ff99"
        ctx.font = "8px monospace"
        ctx.fillText(node.type.toUpperCase(), node.x - 15, node.y - node.size - 5)
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [darkMode])

  if (!darkMode) return null

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-30" style={{ zIndex: 2 }} />
}
