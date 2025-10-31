"use client";

import React from "react";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="relative bg-black sm:bg-gradient-to-b sm:from-black sm:via-gray-900 sm:to-black text-white min-h-screen w-full overflow-hidden -mt-16">
      {/* Left artwork */}
      <div className="absolute inset-0 flex">
        <div className="relative w-1/2 h-full hidden sm:block">
          <Image
            src="/assets/img/image.png"
            alt="Unyul artwork"
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            style={{ objectFit: "cover", objectPosition: "left top" }}
            priority
          />
        </div>
        <div className="flex-1" />
      </div>

      {/* Mobile artwork */}
      <div className="absolute inset-0 block sm:hidden">
        <Image
          src="/assets/img/gaming.jpg"
          alt="Gaming artwork"
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/40 to-black/80 pointer-events-none sm:hidden" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 pr-4 sm:pr-12 md:pr-25 lg:pr-40 w-full sm:w-1/2 ml-auto">
        <h1
          className="hidden sm:block font-nabla font-extrabold leading-none text-[92px] sm:text-[120px] md:text-[160px] lg:text-[180px] xl:text-[200px] text-center max-w-xl"
          style={{ color: "var(--foreground)" }}
        >
          Unyuls
        </h1>
      </div>
    </section>
  );
};

export default Hero;
