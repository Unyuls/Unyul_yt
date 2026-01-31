"use client";

import React from "react";
import * as motion from "motion/react-client";

const images = [
  "/assets/img/gaming.jpg",
  "/assets/img/image.png",
  "/assets/img/unyuls.png",
  "/assets/img/dj.jpg",
];

export default function Gallery() {
  const duplicated = [...images, ...images];

  return (
    <section
      id="gallery"
      className="w-full py-24 z-10 flex flex-col items-center bg-gradient-to-b from-black/80 via-indigo-950/50 to-blue-950/80"
    >
      <motion.div
        className="w-full flex flex-col items-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="scroll-mt-16 text-3xl sm:text-4xl lg:text-5xl font-righteous font-bold mb-12 leading-tight sm:leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
          Galeri Unyul
        </h2>

        <div className="w-full max-w-4xl overflow-hidden mb-6">
          <motion.div
            className="flex gap-8 items-center"
            animate={{ x: "-50%" }}
            transition={{
              duration: 22,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {duplicated.map((src, i) => (
              <div
                className="w-[9.5rem] h-[9.5rem] md:w-[11.5rem] md:h-[11.5rem] bg-[#d9d9d9] bg-cover bg-center rounded flex-none shadow-[0_6px_18px_rgba(0,0,0,0.6)]"
                key={`top-${i}`}
                style={{ backgroundImage: `url(${src})` }}
              />
            ))}
          </motion.div>
        </div>

        <div className="w-full max-w-4xl overflow-hidden mt-2">
          <motion.div
            className="flex gap-8 items-center"
            initial={{ x: "-50%" }}
            animate={{ x: "0%" }}
            transition={{
              duration: 26,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {duplicated.map((src, i) => (
              <div
                className="w-[9.5rem] h-[9.5rem] md:w-[11.5rem] md:h-[11.5rem] bg-[#d9d9d9] bg-cover bg-center rounded flex-none shadow-[0_6px_18px_rgba(0,0,0,0.6)]"
                key={`bot-${i}`}
                style={{ backgroundImage: `url(${src})` }}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
