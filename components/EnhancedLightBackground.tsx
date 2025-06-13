"use client";

import { useEffect, useRef } from "react";

interface EnhancedLightBackgroundProps {
  darkMode: boolean;
}

export default function EnhancedLightBackground({
  darkMode,
}: EnhancedLightBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (darkMode) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Floating orbs
    const orbs: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
      pulseSpeed: number;
      pulseOffset: number;
    }> = [];

    // Geometric shapes
    const shapes: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
      type: "triangle" | "square" | "hexagon" | "diamond";
      color: string;
    }> = [];

    // Wave lines
    const waves: Array<{
      amplitude: number;
      frequency: number;
      speed: number;
      offset: number;
      color: string;
      opacity: number;
    }> = [];

    const colors = [
      "rgba(59, 130, 246, 0.6)", // Blue
      "rgba(139, 92, 246, 0.6)", // Purple
      "rgba(236, 72, 153, 0.6)", // Pink
      "rgba(16, 185, 129, 0.6)", // Emerald
      "rgba(251, 191, 36, 0.6)", // Amber
      "rgba(239, 68, 68, 0.6)", // Red
    ];

    // Create floating orbs
    for (let i = 0; i < 25; i++) {
      orbs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 60 + 20,
        opacity: Math.random() * 0.4 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    // Create geometric shapes
    for (let i = 0; i < 15; i++) {
      shapes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 40 + 15,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        opacity: Math.random() * 0.3 + 0.1,
        type: ["triangle", "square", "hexagon", "diamond"][
          Math.floor(Math.random() * 4)
        ] as "triangle" | "square" | "hexagon" | "diamond",
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Create wave lines
    for (let i = 0; i < 5; i++) {
      waves.push({
        amplitude: Math.random() * 50 + 30,
        frequency: Math.random() * 0.02 + 0.005,
        speed: Math.random() * 0.02 + 0.01,
        offset: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.3 + 0.1,
      });
    }

    let animationTime = 0;

    const drawShape = (shape: (typeof shapes)[0]) => {
      ctx.save();
      ctx.translate(shape.x, shape.y);
      ctx.rotate(shape.rotation);
      ctx.globalAlpha = shape.opacity;
      ctx.strokeStyle = shape.color;
      ctx.lineWidth = 2;

      switch (shape.type) {
        case "triangle":
          ctx.beginPath();
          ctx.moveTo(0, -shape.size);
          ctx.lineTo(-shape.size * 0.866, shape.size * 0.5);
          ctx.lineTo(shape.size * 0.866, shape.size * 0.5);
          ctx.closePath();
          ctx.stroke();
          break;
        case "square":
          ctx.strokeRect(
            -shape.size / 2,
            -shape.size / 2,
            shape.size,
            shape.size
          );
          break;
        case "hexagon":
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const x = shape.size * Math.cos(angle);
            const y = shape.size * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.stroke();
          break;
        case "diamond":
          ctx.beginPath();
          ctx.moveTo(0, -shape.size);
          ctx.lineTo(shape.size, 0);
          ctx.lineTo(0, shape.size);
          ctx.lineTo(-shape.size, 0);
          ctx.closePath();
          ctx.stroke();
          break;
      }
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      animationTime += 0.016;

      // Draw wave lines
      waves.forEach((wave, index) => {
        ctx.save();
        ctx.globalAlpha = wave.opacity;
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 3;
        ctx.beginPath();

        const y = canvas.height / 2 + index * 100 - 200;
        for (let x = 0; x <= canvas.width; x += 5) {
          const waveY =
            y +
            Math.sin(
              x * wave.frequency + animationTime * wave.speed + wave.offset
            ) *
              wave.amplitude;
          if (x === 0) ctx.moveTo(x, waveY);
          else ctx.lineTo(x, waveY);
        }
        ctx.stroke();
        ctx.restore();
      });

      // Draw and update orbs
      orbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        // Bounce off edges
        if (orb.x < -orb.size || orb.x > canvas.width + orb.size) orb.vx *= -1;
        if (orb.y < -orb.size || orb.y > canvas.height + orb.size) orb.vy *= -1;

        // Pulsing effect
        const pulseScale =
          1 + 0.3 * Math.sin(animationTime * orb.pulseSpeed + orb.pulseOffset);
        const currentSize = orb.size * pulseScale;

        // Create gradient
        const gradient = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          currentSize
        );
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.save();
        ctx.globalAlpha = orb.opacity;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, currentSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw and update shapes
      shapes.forEach((shape) => {
        shape.x += shape.vx;
        shape.y += shape.vy;
        shape.rotation += shape.rotationSpeed;

        // Bounce off edges
        if (shape.x < -50 || shape.x > canvas.width + 50) shape.vx *= -1;
        if (shape.y < -50 || shape.y > canvas.height + 50) shape.vy *= -1;

        drawShape(shape);
      });

      // Add connecting lines between nearby orbs
      orbs.forEach((orb1, i) => {
        orbs.forEach((orb2, j) => {
          if (i !== j) {
            const dx = orb1.x - orb2.x;
            const dy = orb1.y - orb2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 200) {
              ctx.save();
              ctx.globalAlpha = 0.1 * (1 - distance / 200);
              ctx.strokeStyle = "rgba(59, 130, 246, 0.8)";
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(orb1.x, orb1.y);
              ctx.lineTo(orb2.x, orb2.y);
              ctx.stroke();
              ctx.restore();
            }
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [darkMode]);

  if (darkMode) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-60"
      style={{ zIndex: 1 }}
    />
  );
}
