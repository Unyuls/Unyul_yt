"use client";

import React from "react";
import { ArrowUpRight, ExternalLink } from "lucide-react";

type SocialLink = {
  id: string;
  label: string;
  handle: string;
  href: string;
  gradient: string;
  icon: React.ReactNode;
  description: string;
};

const socialLinks: SocialLink[] = [
  {
    id: "youtube",
    label: "YouTube",
    handle: "Unyul",
    href: "https://www.youtube.com/@Unyuls_",
    gradient: "from-red-600 to-red-500",
    description: "Nonton video terbaru & live stream.",
    icon: (
      <svg
        viewBox="0 0 256 256"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <path d="M234.33057,69.79736a23.96369,23.96369,0,0,0-14.50489-16.34619C185.55615,40.28223,130.97949,40.39209,128,40.40771c-2.978-.02392-57.55518-.126-91.8252,13.04346A23.96415,23.96415,0,0,0,21.66992,69.79639C19.083,79.72705,16,97.88574,16,128c0,30.11377,3.083,48.27246,5.66943,58.20264a23.96369,23.96369,0,0,0,14.50489,16.34619c32.80615,12.60693,84.22168,13.04541,91.167,13.04541.6206.00049.69678.00049,1.31738,0,6.95069-.00049,58.36231-.43945,91.16651-13.04541a23.96415,23.96415,0,0,0,14.50488-16.34522C236.917,176.273,240,158.11426,240,128,240,97.88623,236.917,79.72754,234.33057,69.79736Zm-72.11182,61.53076-48,32A3.99967,3.99967,0,0,1,108,160V96a3.99968,3.99968,0,0,1,6.21875-3.32813l48,32a3.99979,3.99979,0,0,1,0,6.65625Z" />
      </svg>
    ),
  },
  {
    id: "x",
    label: "X / Twitter",
    handle: "@Unyuls",
    href: "https://x.com/Unyulss",
    gradient: "from-neutral-700 to-neutral-600",
    description: "Update status & cuitan terbaru.",
    icon: (
      <svg
        viewBox="0 0 118.98 107.54"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <path
          d="M290.21,202.23h18.24L268.6,247.78l46.89,62H278.77L250,272.18l-32.9,37.6H198.86L241.49,261l-45-58.82h37.65l26,34.36Zm-6.4,96.62h10.11l-65.25-86.28H217.82Z"
          transform="translate(-196.51 -202.23)"
        />
      </svg>
    ),
  },
  {
    id: "soundcloud",
    label: "SoundCloud",
    handle: "Unyuls",
    href: "https://soundcloud.com/unyuls",
    gradient: "from-orange-500 to-orange-400",
    description: "Dengerin musik & playlist seru.",
    icon: (
      <svg
        viewBox="-271 345.8 256 111.2"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <path d="M-238.4,398.1c-0.8,0-1.4,0.6-1.5,1.5l-2.3,28l2.3,27.1c0.1,0.8,0.7,1.5,1.5,1.5c0.8,0,1.4-0.6,1.5-1.5l2.6-27.1l-2.6-28C-237,398.7-237.7,398.1-238.4,398.1z" />
        <path d="M-228.2,399.9c-0.9,0-1.7,0.7-1.7,1.7l-2.1,26l2.1,27.3c0.1,1,0.8,1.7,1.7,1.7c0.9,0,1.6-0.7,1.7-1.7l2.4-27.3l-2.4-26C-226.6,400.6-227.3,399.9-228.2,399.9z" />
        <path d="M-258.6,403.5c-0.5,0-1,0.4-1.1,1l-2.5,23l2.5,22.5c0.1,0.6,0.5,1,1.1,1c0.5,0,1-0.4,1.1-1l2.9-22.5l-2.9-23C-257.7,404-258.1,403.5-258.6,403.5z" />
        <path d="M-268.1,412.3c-0.5,0-1,0.4-1,1l-1.9,14.3l1.9,14c0.1,0.6,0.5,1,1,1s0.9-0.4,1-1l2.2-14l-2.2-14.2C-267.2,412.8-267.6,412.3-268.1,412.3z" />
        <path d="M-207.5,373.5c-1.2,0-2.1,0.9-2.2,2.1l-1.9,52l1.9,27.2c0.1,1.2,1,2.1,2.2,2.1s2.1-0.9,2.2-2.1l2.1-27.2l-2.1-52C-205.4,374.4-206.4,373.5-207.5,373.5z" />
        <path d="M-248.6,399c-0.7,0-1.2,0.5-1.3,1.3l-2.4,27.3l2.4,26.3c0.1,0.7,0.6,1.3,1.3,1.3c0.7,0,1.2-0.5,1.3-1.2l2.7-26.3l-2.7-27.3C-247.4,399.6-247.9,399-248.6,399z" />
        <path d="M-217.9,383.4c-1,0-1.9,0.8-1.9,1.9l-2,42.3l2,27.3c0.1,1.1,0.9,1.9,1.9,1.9s1.9-0.8,1.9-1.9l2.3-27.3l-2.3-42.3C-216,384.2-216.9,383.4-217.9,383.4z" />
        <path d="M-154.4,359.3c-1.8,0-3.2,1.4-3.2,3.2l-1.2,65l1.2,26.1c0,1.8,1.5,3.2,3.2,3.2c1.8,0,3.2-1.5,3.2-3.2l1.4-26.1l-1.4-65C-151.1,360.8-152.6,359.3-154.4,359.3z" />
        <path d="M-197.1,368.9c-1.3,0-2.3,1-2.4,2.4l-1.8,56.3l1.8,26.9c0,1.3,1.1,2.3,2.4,2.3s2.3-1,2.4-2.4l2-26.9l-2-56.3C-194.7,370-195.8,368.9-197.1,368.9z" />
        <path d="M-46.5,394c-4.3,0-8.4,0.9-12.2,2.4C-61.2,368-85,345.8-114,345.8c-7.1,0-14,1.4-20.1,3.8c-2.4,0.9-3,1.9-3,3.7v99.9c0,1.9,1.5,3.5,3.4,3.7c0.1,0,86.7,0,87.3,0c17.4,0,31.5-14.1,31.5-31.5C-15,408.1-29.1,394-46.5,394z" />
        <path d="M-143.6,353.2c-1.9,0-3.4,1.6-3.5,3.5l-1.4,70.9l1.4,25.7c0,1.9,1.6,3.4,3.5,3.4c1.9,0,3.4-1.6,3.5-3.5l1.5-25.8l-1.5-70.9C-140.2,354.8-141.7,353.2-143.6,353.2z" />
        <path d="M-186.5,366.8c-1.4,0-2.5,1.1-2.6,2.6l-1.6,58.2l1.6,26.7c0,1.4,1.2,2.6,2.6,2.6s2.5-1.1,2.6-2.6l1.8-26.7l-1.8-58.2C-184,367.9-185.1,366.8-186.5,366.8z" />
        <path d="M-175.9,368.1c-1.5,0-2.8,1.2-2.8,2.8l-1.5,56.7l1.5,26.5c0,1.6,1.3,2.8,2.8,2.8s2.8-1.2,2.8-2.8l1.7-26.5l-1.7-56.7C-173.1,369.3-174.3,368.1-175.9,368.1z" />
        <path d="M-165.2,369.9c-1.7,0-3,1.3-3,3l-1.4,54.7l1.4,26.3c0,1.7,1.4,3,3,3c1.7,0,3-1.3,3-3l1.5-26.3l-1.5-54.7C-162.2,371.3-163.5,369.9-165.2,369.9z" />
      </svg>
    ),
  },
  {
    id: "instagram",
    label: "Instagram",
    handle: "@unyuls",
    href: "https://instagram.com/unyuls",
    gradient: "from-pink-500 via-purple-500 to-orange-500",
    description: "Intip keseharian & foto keren.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    id: "tiktok",
    label: "TikTok",
    handle: "@unyul_live",
    href: "https://www.tiktok.com/@unyul_live",
    gradient: "from-cyan-400 to-pink-500",
    description: "Video pendek seru & challange.",
    icon: (
      <svg
        viewBox="0 0 256 256"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <path d="M224,80a52.059,52.059,0,0,1-52-52,4.0002,4.0002,0,0,0-4-4H128a4.0002,4.0002,0,0,0-4,4V156a24,24,0,1,1-34.28418-21.69238,3.99957,3.99957,0,0,0,2.28369-3.61279L92,89.05569a3.99948,3.99948,0,0,0-4.70117-3.938A72.00522,72.00522,0,1,0,172,156l-.00049-42.56348A99.27749,99.27749,0,0,0,224,128a4.0002,4.0002,0,0,0,4-4V84A4.0002,4.0002,0,0,0,224,80Zm-4,39.915a91.24721,91.24721,0,0,1-49.66455-17.1792,4.00019,4.00019,0,0,0-6.33594,3.24707L164,156A64,64,0,1,1,84,94.01223l-.00049,34.271A32.00156,32.00156,0,1,0,132,156V32h32.13184A60.09757,60.09757,0,0,0,220,87.86819Z" />
      </svg>
    ),
  },
  {
    id: "discord",
    label: "Discord Server",
    handle: "Desa Karbit",
    href: "https://discord.gg/7CKfJfbA",
    gradient: "from-indigo-500 to-indigo-600",
    description: "Gabung komunitas & ngobrol bareng.",
    icon: (
      <svg
        viewBox="0 -28.5 256 256"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        fill="currentColor"
      >
        <g>
          <path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" />
        </g>
      </svg>
    ),
  },
];

import * as motion from "motion/react-client";

export default function Find() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section
      id="find"
      className="w-full text-white py-24 bg-gradient-to-b from-blue-950/80 to-blue-900/90"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-righteous font-bold mb-4 tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
            Temukan Unyul
          </h2>
          <p className="text-neutral-400 font-poppins text-lg max-w-2xl mx-auto">
            Terhubung, ikuti, dan nikmati konten eksklusif di berbagai platform
            favoritmu.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {socialLinks.map((link) => (
            <motion.a
              key={link.id}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center p-5 bg-neutral-900/40 backdrop-blur-md border border-neutral-800 rounded-2xl overflow-hidden hover:bg-neutral-800/60 hover:border-neutral-700 transition-all duration-300 transform hover:-translate-y-1"
              variants={item}
            >
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-r ${link.gradient}`}
              />
              <div
                className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${link.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              <div className="relative z-10 flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 group-hover:scale-105 group-hover:text-white group-hover:border-neutral-700 transition-all duration-300 shadow-sm">
                <div className="w-7 h-7">{link.icon}</div>
              </div>
              <div className="ml-5 flex-1 relative z-10">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-lg leading-none group-hover:text-neutral-100 transition-colors">
                    {link.label}
                  </h3>
                  <ExternalLink className="w-4 h-4 text-neutral-500 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                </div>
                <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider mt-1 mb-1">
                  {link.handle}
                </p>
                <p className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors line-clamp-1">
                  {link.description}
                </p>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
