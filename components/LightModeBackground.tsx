"use client"

import { useEffect, useRef } from "react"

interface LightModeBackgroundProps {
  darkMode: boolean
}

export default function LightModeBackground({ darkMode }: LightModeBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (darkMode) return // Only run for light mode

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const shapes: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
      color: string
      rotation: number
      rotationSpeed: number
      type: "circle" | "triangle" | "square"
    }> = []

    const colors = [
      "rgba(59, 130, 246, 0.1)", // Blue
      "rgba(16, 185, 129, 0.1)", // Green
      "rgba(245, 101, 101, 0.1)", // Red
      "rgba(139, 92, 246, 0.1)", // Purple
      "rgba(251, 191, 36, 0.1)", // Yellow
      "rgba(236, 72, 153, 0.1)", // Pink
    ]

    // Create floating shapes
    for (let i = 0; i < 30; i++) {
      shapes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 40 + 20,
        opacity: Math.random() * 0.3 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        type: ["circle", "triangle", "square"][Math.floor(Math.random() * 3)] as "circle" | "triangle" | "square",
      })
    }

    const drawShape = (shape: (typeof shapes)[0]) => {
      ctx.save()
      ctx.translate(shape.x, shape.y)
      ctx.rotate(shape.rotation)
      ctx.globalAlpha = shape.opacity

      switch (shape.type) {
        case "circle":
          ctx.beginPath()
          ctx.arc(0, 0, shape.size, 0, Math.PI * 2)
          ctx.fillStyle = shape.color
          ctx.fill()
          break
        case "triangle":
          ctx.beginPath()
          ctx.moveTo(0, -shape.size)
          ctx.lineTo(-shape.size * 0.866, shape.size * 0.5)
          ctx.lineTo(shape.size * 0.866, shape.size * 0.5)
          ctx.closePath()
          ctx.fillStyle = shape.color
          ctx.fill()
          break
        case "square":
          ctx.fillStyle = shape.color
          ctx.fillRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size)
          break
      }

      ctx.restore()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      shapes.forEach((shape) => {
        // Update position
        shape.x += shape.vx
        shape.y += shape.vy
        shape.rotation += shape.rotationSpeed

        // Bounce off edges
        if (shape.x < -shape.size || shape.x > canvas.width + shape.size) shape.vx *= -1
        if (shape.y < -shape.size || shape.y > canvas.height + shape.size) shape.vy *= -1

        // Keep shapes in bounds
        shape.x = Math.max(-shape.size, Math.min(canvas.width + shape.size, shape.x))
        shape.y = Math.max(-shape.size, Math.min(canvas.height + shape.size, shape.y))

        drawShape(shape)
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

  if (darkMode) return null

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-40" style={{ zIndex: 1 }} />
}
