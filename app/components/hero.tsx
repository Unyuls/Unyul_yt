"use client";

import React, { memo } from "react";
import * as motion from "motion/react-client";
import Image from "next/image";

const Hero = memo(function Hero() {
  return (
    <motion.section
      id="hero"
      className="relative bg-black sm:bg-gradient-to-b sm:from-black sm:via-gray-900 sm:to-black text-white min-h-screen w-full overflow-hidden -mt-16"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Desktop image */}
      <div className="absolute inset-0 flex">
        <div className="relative w-1/2 h-full hidden sm:block">
          <Image
            src="/assets/img/image.png"
            alt="Unyul artwork"
            fill
            sizes="(min-width: 640px) 50vw, 0vw"
            style={{ objectFit: "cover", objectPosition: "left top" }}
            priority
            quality={85}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgIBAwQDAAAAAAAAAAAAAQIDBAUABhEHEiExQVFh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAwT/xAAaEQACAgMAAAAAAAAAAAAAAAABAgADERIh/9oADAMBAAIRAxEAPwCnSw+4slkb1PcFqCpXqzPEkdaIOJSp4LFiT5I54AxseWVONt/g/wATb/tNGmqSVqcPSM57Z//Z"
          />
        </div>
        <div className="flex-1" />
      </div>

      {/* Mobile image */}
      <div className="absolute inset-0 block sm:hidden">
        <Image
          src="/assets/img/gaming.jpg"
          alt="Gaming artwork"
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
          priority
          quality={80}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgIBAwQDAAAAAAAAAAAAAQIDBAUABhEHEiExQVFh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAwT/xAAaEQACAgMAAAAAAAAAAAAAAAABAgADERIh/9oADAMBAAIRAxEAPwCnSw+4slkb1PcFqCpXqzPEkdaIOJSp4LFiT5I54AxseWVONt/g/wATb/tNGmqSVqcPSM57Z//Z"
        />
      </div>

      {/* Mobile gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/40 to-black/80 pointer-events-none sm:hidden" />

      {/* Title */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 pr-4 sm:pr-12 md:pr-25 lg:pr-40 w-full sm:w-1/2 ml-auto">
        <h1
          className="hidden sm:block font-nabla font-extrabold leading-none text-[92px] sm:text-[120px] md:text-[160px] lg:text-[180px] xl:text-[200px] text-center max-w-xl"
          style={{ color: "var(--foreground)" }}
        >
          Unyuls
        </h1>
      </div>
    </motion.section>
  );
});

export default Hero;
