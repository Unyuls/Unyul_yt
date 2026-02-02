"use client";

import React, { useEffect, useRef, useCallback, memo } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  opacity: number;
  phase: number; // Pre-calculated phase for twinkle effect
}

// Memoized component to prevent unnecessary re-renders
const SpaceBackground = memo(function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isVisibleRef = useRef(true);
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef(0);

  // Target 30 FPS instead of 60 for better performance
  const FRAME_INTERVAL = 1000 / 30;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", {
      alpha: false,
      desynchronized: true,
    });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // Debounced resize handler
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const resize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        // Regenerate stars on resize
        initStars();
      }, 150);
    };

    // Reduce star count based on screen size for better performance
    const getStarCount = () => {
      const area = width * height;
      if (area < 500000) return 40; // Mobile
      if (area < 1000000) return 60; // Tablet
      return 80; // Desktop
    };

    const stars: Star[] = [];

    const initStars = () => {
      stars.length = 0;
      const numStars = getStarCount();
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.2 + 0.3,
          opacity: Math.random() * 0.6 + 0.4,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    // Draw static background once
    const drawStaticBackground = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#000000");
      gradient.addColorStop(0.5, "#0a0a1a");
      gradient.addColorStop(1, "#070b14");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Pre-render nebula effects
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
    };

    // Visibility change handler - pause animation when tab is hidden
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
      if (isVisibleRef.current && !animationFrameRef.current) {
        animate(performance.now());
      }
    };

    const animate = (currentTime: number) => {
      // Skip frame if tab is hidden
      if (!isVisibleRef.current) {
        animationFrameRef.current = null;
        return;
      }

      // Frame rate limiting
      const elapsed = currentTime - lastFrameTimeRef.current;
      if (elapsed < FRAME_INTERVAL) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTimeRef.current = currentTime - (elapsed % FRAME_INTERVAL);

      // Draw background
      drawStaticBackground();

      // Draw stars with optimized twinkle
      const timeBase = currentTime * 0.001; // Slower twinkle
      ctx.fillStyle = "#ffffff";

      stars.forEach((star) => {
        const twinkle = Math.sin(timeBase + star.phase) * 0.25 + 0.75;
        const finalOpacity = star.opacity * twinkle;

        ctx.globalAlpha = finalOpacity;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Initialize
    canvas.width = width;
    canvas.height = height;
    initStars();

    // Add event listeners
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Start animation
    animate(performance.now());

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearTimeout(resizeTimeout);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-50 pointer-events-none"
      aria-hidden="true"
    />
  );
});

export default SpaceBackground;
