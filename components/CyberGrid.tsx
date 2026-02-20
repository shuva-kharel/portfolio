"use client";

import { useEffect, useRef } from "react";

interface CyberGridProps {
  darkMode: boolean;
}

export default function CyberGrid({ darkMode }: CyberGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Cyber grid lines
    const gridLines: Array<{
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      opacity: number;
      pulseSpeed: number;
      pulseOffset: number;
      isVertical: boolean;
    }> = [];

    // Data streams
    const dataStreams: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      length: number;
      opacity: number;
      color: string;
    }> = [];

    // Floating hexagons
    const hexagons: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
    }> = [];

    // Create cyber grid
    const gridSpacing = 80;
    for (let x = 0; x < canvas.width; x += gridSpacing) {
      for (let y = 0; y < canvas.height; y += gridSpacing) {
        if (Math.random() > 0.7) {
          gridLines.push({
            x1: x,
            y1: y,
            x2: x + gridSpacing,
            y2: y,
            opacity: Math.random() * 0.3 + 0.1,
            pulseSpeed: Math.random() * 0.02 + 0.01,
            pulseOffset: Math.random() * Math.PI * 2,
            isVertical: false,
          });
        }
        if (Math.random() > 0.7) {
          gridLines.push({
            x1: x,
            y1: y,
            x2: x,
            y2: y + gridSpacing,
            opacity: Math.random() * 0.3 + 0.1,
            pulseSpeed: Math.random() * 0.02 + 0.01,
            pulseOffset: Math.random() * Math.PI * 2,
            isVertical: true,
          });
        }
      }
    }

    // Reduce counts on mobile for performance
    const isMobile = canvas.width < 768;
    const streamCount = isMobile ? 6 : 15;
    const hexCount = isMobile ? 5 : 12;

    // Create data streams
    for (let i = 0; i < streamCount; i++) {
      dataStreams.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        length: Math.random() * 50 + 20,
        opacity: Math.random() * 0.8 + 0.2,
        color: darkMode
          ? Math.random() > 0.5
            ? "#00ff99"
            : "#ff0055"
          : Math.random() > 0.5
          ? "#3b82f6"
          : "#8b5cf6",
      });
    }

    // Create floating hexagons
    for (let i = 0; i < hexCount; i++) {
      hexagons.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 30 + 15,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        opacity: Math.random() * 0.3 + 0.1,
      });
    }

    let animationTime = 0;

    const drawHexagon = (hex: (typeof hexagons)[0]) => {
      ctx.save();
      ctx.translate(hex.x, hex.y);
      ctx.rotate(hex.rotation);
      ctx.globalAlpha = hex.opacity;

      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const x = hex.size * Math.cos(angle);
        const y = hex.size * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();

      const color = darkMode ? "#00ff99" : "#3b82f6";
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Inner glow
      ctx.globalAlpha = hex.opacity * 0.3;
      ctx.fillStyle = color;
      ctx.fill();

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      animationTime += 0.016;

      // Draw pulsing grid lines
      gridLines.forEach((line) => {
        const pulseOpacity =
          line.opacity *
          (0.5 +
            0.5 * Math.sin(animationTime * line.pulseSpeed + line.pulseOffset));
        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);

        const color = darkMode ? "#00ff99" : "#3b82f6";
        ctx.strokeStyle = `${color}${Math.floor(pulseOpacity * 255)
          .toString(16)
          .padStart(2, "0")}`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Draw and update data streams
      dataStreams.forEach((stream) => {
        stream.x += stream.vx;
        stream.y += stream.vy;

        // Bounce off edges
        if (stream.x < 0 || stream.x > canvas.width) stream.vx *= -1;
        if (stream.y < 0 || stream.y > canvas.height) stream.vy *= -1;

        // Draw stream trail
        ctx.save();
        ctx.globalAlpha = stream.opacity;
        ctx.strokeStyle = stream.color;
        ctx.lineWidth = 3;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(stream.x, stream.y);
        ctx.lineTo(
          stream.x - stream.vx * stream.length,
          stream.y - stream.vy * stream.length
        );
        ctx.stroke();

        // Draw stream head
        ctx.beginPath();
        ctx.arc(stream.x, stream.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = stream.color;
        ctx.fill();

        ctx.restore();
      });

      // Draw and update hexagons
      hexagons.forEach((hex) => {
        hex.x += hex.vx;
        hex.y += hex.vy;
        hex.rotation += hex.rotationSpeed;

        // Bounce off edges
        if (hex.x < -50 || hex.x > canvas.width + 50) hex.vx *= -1;
        if (hex.y < -50 || hex.y > canvas.height + 50) hex.vy *= -1;

        drawHexagon(hex);
      });

      // Add scanning lines effect
      const scanLineY =
        (Math.sin(animationTime * 0.5) + 1) * (canvas.height / 2);
      ctx.save();
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = darkMode ? "#00ff99" : "#3b82f6";
      ctx.fillRect(0, scanLineY - 2, canvas.width, 4);
      ctx.restore();

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

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-25 sm:opacity-30"
      style={{ zIndex: 1 }}
    />
  );
}
