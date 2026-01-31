"use client";

import React, { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  opacity: number;
  speed: number;
}

export default function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", resize);
    resize();

    const stars: Star[] = [];
    const numStars = 150;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.5 + 0.5,
        opacity: Math.random(),
        speed: Math.random() * 0.05 + 0.02,
      });
    }

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#000000");
      gradient.addColorStop(0.5, "#0a0a1a");
      gradient.addColorStop(1, "#070b14");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const nebula1 = ctx.createRadialGradient(
        width * 0.2,
        height * 0.3,
        0,
        width * 0.2,
        height * 0.3,
        width * 0.6,
      );
      nebula1.addColorStop(0, "rgba(76, 29, 149, 0.1)");
      nebula1.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = nebula1;
      ctx.fillRect(0, 0, width, height);

      const nebula2 = ctx.createRadialGradient(
        width * 0.8,
        height * 0.7,
        0,
        width * 0.8,
        height * 0.7,
        width * 0.5,
      );
      nebula2.addColorStop(0, "rgba(30, 58, 138, 0.15)");
      nebula2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, width, height);
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);

        const twinkle = Math.sin(Date.now() * 0.002 + star.x) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`;
        ctx.fill();
        // star.y -= star.speed;
        // if (star.y < 0) star.y = height;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full object-cover -z-50 pointer-events-none"
    />
  );
}
