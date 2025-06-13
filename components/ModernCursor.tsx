"use client"

import { useEffect, useRef, useState } from "react"

interface ModernCursorProps {
  darkMode: boolean
}

export default function ModernCursor({ darkMode }: ModernCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)

  useEffect(() => {
    const cursor = cursorRef.current
    const follower = followerRef.current
    if (!cursor || !follower) return

    let mouseX = 0
    let mouseY = 0
    let followerX = 0
    let followerY = 0

    const updateCursor = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY

      // Update cursor position immediately
      cursor.style.left = `${mouseX}px`
      cursor.style.top = `${mouseY}px`
    }

    const animateFollower = () => {
      // Smooth follower animation
      const speed = 0.15
      followerX += (mouseX - followerX) * speed
      followerY += (mouseY - followerY) * speed

      follower.style.left = `${followerX}px`
      follower.style.top = `${followerY}px`

      requestAnimationFrame(animateFollower)
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)
    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    // Start animations
    animateFollower()

    // Add event listeners
    document.addEventListener("mousemove", updateCursor)
    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mouseup", handleMouseUp)

    // Interactive elements
    const interactiveElements = document.querySelectorAll(
      'button, a, [data-cursor="hover"], input, textarea, [role="button"]',
    )
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter)
      el.addEventListener("mouseleave", handleMouseLeave)
    })

    return () => {
      document.removeEventListener("mousemove", updateCursor)
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mouseup", handleMouseUp)

      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter)
        el.removeEventListener("mouseleave", handleMouseLeave)
      })
    }
  }, [])

  return (
    <>
      {/* Main Cursor Dot */}
      <div
        ref={cursorRef}
        className={`fixed w-2 h-2 pointer-events-none z-50 hidden md:block transition-transform duration-100 ease-out ${
          darkMode ? "bg-[#00ff99]" : "bg-blue-600"
        } rounded-full`}
        style={{
          transform: `translate(-50%, -50%) scale(${isClicking ? 0.5 : 1})`,
          boxShadow: darkMode
            ? "0 0 10px #00ff99, 0 0 20px #00ff99"
            : "0 0 10px rgba(59, 130, 246, 0.8), 0 0 20px rgba(59, 130, 246, 0.6)",
        }}
      />

      {/* Follower Circle */}
      <div
        ref={followerRef}
        className={`fixed pointer-events-none z-40 hidden md:block transition-all duration-300 ease-out ${
          darkMode ? "border-2 border-[#00ff99]/50" : "border-2 border-blue-400/50"
        } rounded-full`}
        style={{
          width: isHovering ? "60px" : "30px",
          height: isHovering ? "60px" : "30px",
          transform: `translate(-50%, -50%) scale(${isClicking ? 0.8 : 1})`,
          backgroundColor: isHovering
            ? darkMode
              ? "rgba(0, 255, 153, 0.1)"
              : "rgba(59, 130, 246, 0.1)"
            : "transparent",
          backdropFilter: isHovering ? "blur(10px)" : "none",
          boxShadow: isHovering
            ? darkMode
              ? "0 0 30px rgba(0, 255, 153, 0.3)"
              : "0 0 30px rgba(59, 130, 246, 0.3)"
            : "none",
        }}
      />

      {/* Ripple Effect on Click */}
      {isClicking && (
        <div
          className={`fixed pointer-events-none z-30 w-8 h-8 rounded-full animate-ping ${
            darkMode ? "bg-[#00ff99]/30" : "bg-blue-600/30"
          }`}
          style={{
            left: `${cursorRef.current?.offsetLeft}px`,
            top: `${cursorRef.current?.offsetTop}px`,
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
    </>
  )
}
