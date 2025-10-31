"use client";

import React from "react";

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
      className="w-full bg-gradient-to-b from-black via-gray-900 to-black text-white py-24 relative z-10 flex flex-col items-center"
      data-aos="fade-up"
    >
      <h2 className="scroll-mt-16 text-3xl sm:text-4xl lg:text-5xl font-righteous font-bold mb-12 leading-tight sm:leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
        Galeri Unyul
      </h2>

      <div className="w-full max-w-4xl overflow-hidden mb-6">
        <div className="track track-top" aria-hidden>
          {duplicated.map((src, i) => (
            <div
              className="item"
              key={`top-${i}`}
              style={{ backgroundImage: `url(${src})` }}
            />
          ))}
        </div>
      </div>

      <div className="w-full max-w-4xl overflow-hidden mt-2">
        <div className="track track-bottom" aria-hidden>
          {duplicated.map((src, i) => (
            <div
              className="item"
              key={`bot-${i}`}
              style={{ backgroundImage: `url(${src})` }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .track {
          display: flex;
          gap: 2rem;
          align-items: center;
        }
        .item {
          width: 9.5rem; /* 152px */
          height: 9.5rem; /* square */
          background-color: #d9d9d9;
          background-size: cover;
          background-position: center;
          border-radius: 4px;
          flex: 0 0 auto;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.6);
        }

        /* The track element is twice as wide visually because we duplicated children.
					 Animating translateX(-50%) gives a perfectly looping marquee. */
        .track-top {
          animation: scroll-left 22s linear infinite;
        }

        .track-bottom {
          animation: scroll-left 26s linear infinite reverse;
        }

        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        /* Make marquee responsive: increase item size on larger screens */
        @media (min-width: 768px) {
          .item {
            width: 11.5rem;
            height: 11.5rem;
          }
        }

        /* Slightly reduce motion for prefers-reduced-motion */
        @media (prefers-reduced-motion: reduce) {
          .track-top,
          .track-bottom {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
