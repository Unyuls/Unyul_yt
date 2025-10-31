"use client";

"use client";

import React, { useState } from "react";
import { Music, Gamepad2, Youtube } from "lucide-react";

const About: React.FC = () => {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  return (
    <section
      id="about"
      className="w-full bg-gradient-to-b from-black via-gray-900 to-black text-white py-24 relative z-10"
    >
      <div className="max-w-5xl mx-auto px-6">
        {/* add scroll margin and a little more leading so glyphs aren't visually clipped */}
        <h2 className="scroll-mt-16 text-3xl sm:text-4xl lg:text-5xl font-righteous font-bold mb-8 leading-tight sm:leading-tight text-center text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
          Tentang Unyul
        </h2>

        {/* Two-column: video (left) + text (right). Stacks on small screens */}
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Video column */}
          <div className="w-full md:w-1/2" data-aos="fade-left">
            <div className="w-full h-0 pb-[56.25%] relative rounded-lg overflow-hidden shadow-lg">
              <iframe
                title="Unyul video"
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/e75XqpuHesU?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* Text column */}
          <div className="w-full md:w-1/2 text-left" data-aos="fade-right">
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
          </div>
        </div>

        {/* Icons row (preserve original interactions) */}
        <div
          className="mt-12 flex items-center justify-center gap-10"
          data-aos="fade-up"
        >
          <div className="relative">
            <div
              className={`flex flex-col items-center border border-white/40 rounded-full p-4 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform ${
                hoveredIcon === "music"
                  ? "scale-110 bg-white/10 border-white/60"
                  : hoveredIcon
                  ? "scale-75"
                  : "scale-100"
              }`}
              onMouseEnter={() => setHoveredIcon("music")}
              onMouseLeave={() => setHoveredIcon(null)}
            >
              <Music className="text-white" size={28} />
            </div>
            {hoveredIcon === "music" && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black text-white text-sm px-3 py-1 rounded-lg shadow-lg whitespace-nowrap transition-opacity duration-300">
                Musik & DJ
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
              </div>
            )}
          </div>

          <div className="relative">
            <div
              className={`flex flex-col items-center border border-white/40 rounded-full p-4 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform ${
                hoveredIcon === "gamer"
                  ? "scale-110 bg-white/10 border-white/60"
                  : hoveredIcon
                  ? "scale-75"
                  : "scale-100"
              }`}
              onMouseEnter={() => setHoveredIcon("gamer")}
              onMouseLeave={() => setHoveredIcon(null)}
            >
              <Gamepad2 className="text-white" size={28} />
            </div>
            {hoveredIcon === "gamer" && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black text-white text-sm px-3 py-1 rounded-lg shadow-lg whitespace-nowrap transition-opacity duration-300">
                Gamer
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
              </div>
            )}
          </div>

          <div className="relative">
            <div
              className={`flex flex-col items-center border border-white/40 rounded-full p-4 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform ${
                hoveredIcon === "streamer"
                  ? "scale-110 bg-white/10 border-white/60"
                  : hoveredIcon
                  ? "scale-75"
                  : "scale-100"
              }`}
              onMouseEnter={() => setHoveredIcon("streamer")}
              onMouseLeave={() => setHoveredIcon(null)}
            >
              <Youtube className="text-white" size={28} />
            </div>
            {hoveredIcon === "streamer" && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black text-white text-sm px-3 py-1 rounded-lg shadow-lg whitespace-nowrap transition-opacity duration-300">
                Streamer
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
