"use client";

import React, { useState, useCallback, memo, useRef } from "react";
import * as motion from "motion/react-client";
import { useInView } from "motion/react";
import Image from "next/image";
import { Music, Gamepad2, Youtube } from "lucide-react";

const YouTubeEmbed = memo(function YouTubeEmbed() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { amount: 0.6, once: true });

  return (
    <div
      ref={containerRef}
      className="w-full h-0 pb-[56.25%] relative rounded-lg overflow-hidden shadow-lg bg-neutral-900"
    >
      {isInView ? (
        <iframe
          title="Unyul video"
          className="absolute inset-0 w-full h-full"
          src="https://www.youtube-nocookie.com/embed/e75XqpuHesU?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          loading="eager"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-neutral-900 border border-neutral-800">
          <Image
            src="https://i.ytimg.com/vi/e75XqpuHesU/maxresdefault.jpg"
            alt="Unyul Video Thumbnail"
            fill
            className="object-cover opacity-80"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={false}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-red-600/90 flex items-center justify-center shadow-lg transform scale-90 opacity-90">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-8 h-8 text-white ml-1"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

const IconButton = memo(function IconButton({
  id,
  label,
  Icon,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}: {
  id: string;
  label: string;
  Icon: React.ComponentType<{ className?: string; size?: number }>;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <div className="relative">
      <div
        className={`flex flex-col items-center border border-white/40 rounded-full p-4 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform ${
          isHovered ? "scale-110 bg-white/10 border-white/60" : "scale-100"
        }`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <Icon className="text-white" size={28} />
      </div>
      {isHovered && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black text-white text-sm px-3 py-1 rounded-lg shadow-lg whitespace-nowrap transition-opacity duration-300">
          {label}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
        </div>
      )}
    </div>
  );
});

const About = memo(function About() {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  const handleMouseEnter = useCallback((id: string) => {
    setHoveredIcon(id);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredIcon(null);
  }, []);

  return (
    <section
      id="about"
      className="w-full py-24 z-10 bg-gradient-to-b from-transparent via-black/60 to-black/80"
    >
      <div className="max-w-5xl mx-auto px-6">
        <motion.h2
          className="scroll-mt-16 text-3xl sm:text-4xl lg:text-5xl font-righteous font-bold mb-8 leading-tight sm:leading-tight text-center text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Tentang Unyul
        </motion.h2>

        <div className="flex flex-col md:flex-row items-start gap-8">
          <motion.div
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <YouTubeEmbed />
          </motion.div>

          <motion.div
            className="w-full md:w-1/2 text-left"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-6">
              <p className="text-neutral-300 leading-relaxed text-lg sm:text-xl font-light">
                Halo para Warga Desa Karbit! Perkenalkan aku Unyul, seorang
                Seorang Gamer, dan Streamer.
              </p>

              <p className="text-neutral-300 leading-relaxed text-lg sm:text-xl font-light">
                Streaming game? Iya. <br />
                Ngadain DJ Party di malam minggu? Iya. <br />
                Konten seru dan menarik? Iya.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-12 flex items-center justify-center gap-10"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <IconButton
            id="music"
            label="Musik & DJ"
            Icon={Music}
            isHovered={hoveredIcon === "music"}
            onMouseEnter={() => handleMouseEnter("music")}
            onMouseLeave={handleMouseLeave}
          />

          <IconButton
            id="gamer"
            label="Gamer"
            Icon={Gamepad2}
            isHovered={hoveredIcon === "gamer"}
            onMouseEnter={() => handleMouseEnter("gamer")}
            onMouseLeave={handleMouseLeave}
          />

          <IconButton
            id="streamer"
            label="Streamer"
            Icon={Youtube}
            isHovered={hoveredIcon === "streamer"}
            onMouseEnter={() => handleMouseEnter("streamer")}
            onMouseLeave={handleMouseLeave}
          />
        </motion.div>
      </div>
    </section>
  );
});

export default About;
