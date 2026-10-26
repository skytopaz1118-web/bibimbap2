import React, { useEffect, useRef } from "react";

interface SteamCanvasProps {
  intensity?: number;
  isPlaying?: boolean;
}

export const SteamCanvas: React.FC<SteamCanvasProps> = ({ intensity = 1, isPlaying = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth || 800);
    let height = (canvas.height = canvas.offsetHeight || 450);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      maxSize: number;
      alpha: number;
      maxAlpha: number;
      life: number;
      maxLife: number;
    }

    const particles: Particle[] = [];
    const maxParticles = Math.floor(45 * intensity);

    const createParticle = (): Particle => {
      // Spawn near bottom-middle where the bowl is
      const startX = width * 0.5 + (Math.random() - 0.5) * (width * 0.35);
      const startY = height * 0.85 + (Math.random() - 0.5) * 30;
      return {
        x: startX,
        y: startY,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -0.6 - Math.random() * 1.2,
        size: 15 + Math.random() * 25,
        maxSize: 60 + Math.random() * 50,
        alpha: 0,
        maxAlpha: 0.12 + Math.random() * 0.15,
        life: 0,
        maxLife: 100 + Math.random() * 80,
      };
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (isPlaying && particles.length < maxParticles && Math.random() < 0.4) {
        particles.push(createParticle());
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx + Math.sin(p.life * 0.04) * 0.3;
        p.y += p.vy;
        p.size += (p.maxSize - p.size) * 0.015;

        const progress = p.life / p.maxLife;
        if (progress < 0.25) {
          p.alpha = (progress / 0.25) * p.maxAlpha;
        } else {
          p.alpha = (1 - (progress - 0.25) / 0.75) * p.maxAlpha;
        }

        if (p.life >= p.maxLife || p.y < 0) {
          particles.splice(i, 1);
          continue;
        }

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        gradient.addColorStop(0, `rgba(255, 248, 235, ${p.alpha * 0.8})`);
        gradient.addColorStop(0.5, `rgba(255, 240, 220, ${p.alpha * 0.35})`);
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [intensity, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-20 h-full w-full opacity-80 mix-blend-screen"
    />
  );
};
