"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/95 text-white shadow-md"
          : "bg-transparent text-white"
      } font-poppins`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile */}
        <div className="md:hidden flex items-center justify-start h-16">
          <button
            onClick={() => {
              if (isOpen) {
                setIsClosing(true);
                setTimeout(() => {
                  setIsOpen(false);
                  setIsClosing(false);
                }, 300);
              } else {
                setIsOpen(true);
              }
            }}
            className="relative text-white hover:text-gray-300 focus:outline-none focus:text-gray-300"
          >
            {/* icon container: keep same size so icons overlap exactly */}
            <span className="relative inline-block h-6 w-6">
              <Menu
                className={`absolute inset-0 m-auto h-6 w-6 transform transition duration-300 ease-in-out ${
                  isOpen
                    ? "opacity-0 -translate-y-1 scale-95 rotate-12 pointer-events-none"
                    : "opacity-100 translate-y-0 scale-100 rotate-0 pointer-events-auto"
                }`}
              />
              <X
                className={`absolute inset-0 m-auto h-6 w-6 transform transition duration-300 ease-in-out ${
                  isOpen
                    ? "opacity-100 translate-y-0 scale-100 rotate-0 pointer-events-auto"
                    : "opacity-0 translate-y-1 scale-95 -rotate-12 pointer-events-none"
                }`}
              />
            </span>
          </button>
        </div>
        {/* Desktop */}
        <div className="hidden md:flex items-center justify-end h-16">
          <div className="flex space-x-8">
            <Link
              href="#hero"
              className="text-white hover:text-gray-300 hover:bg-white/10 active:bg-white/20 px-3 py-2 text-sm font-medium transition-all duration-200 rounded-full"
            >
              Beranda
            </Link>
            <Link
              href="#about"
              className="text-white hover:text-gray-300 hover:bg-white/10 active:bg-white/20 px-3 py-2 text-sm font-medium transition-all duration-200 rounded-full"
            >
              Tentang Unyul
            </Link>
            <Link
              href="#gallery"
              className="text-white hover:text-gray-300 hover:bg-white/10 active:bg-white/20 px-3 py-2 text-sm font-medium transition-all duration-200 rounded-full"
            >
              Galeri Unyul
            </Link>
            <Link
              href="#find"
              className="text-white hover:text-gray-300 hover:bg-white/10 active:bg-white/20 px-3 py-2 text-sm font-medium transition-all duration-200 rounded-full"
            >
              Temukan Unyul
            </Link>
          </div>
        </div>
        {/* Mobile menu */}
        <div
          className={`fixed inset-0 z-40 md:hidden transition duration-300 ${
            isOpen
              ? "opacity-100 translate-x-0"
              : isClosing
              ? "opacity-100 translate-x-full"
              : "opacity-0 -translate-x-full"
          }`}
          onClick={() => {
            setIsClosing(true);
            setTimeout(() => {
              setIsOpen(false);
              setIsClosing(false);
            }, 300);
          }}
        >
          <div
            className="absolute inset-0 bg-black/95 px-4 pt-20 pb-6 space-y-4 sm:px-6 overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Close menu"
              onClick={() => {
                setIsClosing(true);
                setTimeout(() => {
                  setIsOpen(false);
                  setIsClosing(false);
                }, 300);
              }}
              className="absolute top-4 left-4 z-50 text-white p-2 rounded-md hover:text-gray-300 focus:outline-none"
            >
              <X className="h-7 w-7" />
            </button>
            <Link
              href="#hero"
              className="text-white hover:text-gray-300 hover:bg-white/10 active:bg-white/20 block px-3 py-2 text-base font-medium transition-all duration-200 rounded-lg"
              onClick={() => {
                setIsClosing(true);
                setTimeout(() => {
                  setIsOpen(false);
                  setIsClosing(false);
                }, 300);
              }}
            >
              Beranda
            </Link>
            <Link
              href="#about"
              className="text-white hover:text-gray-300 hover:bg-white/10 active:bg-white/20 block px-3 py-2 text-base font-medium transition-all duration-200 rounded-lg"
              onClick={() => {
                setIsClosing(true);
                setTimeout(() => {
                  setIsOpen(false);
                  setIsClosing(false);
                }, 300);
              }}
            >
              Tentang Unyul
            </Link>
            <Link
              href="#gallery"
              className="text-white hover:text-gray-300 hover:bg-white/10 active:bg-white/20 block px-3 py-2 text-base font-medium transition-all duration-200 rounded-lg"
              onClick={() => {
                setIsClosing(true);
                setTimeout(() => {
                  setIsOpen(false);
                  setIsClosing(false);
                }, 300);
              }}
            >
              Galeri Unyul
            </Link>
            <Link
              href="#find"
              className="text-white hover:text-gray-300 hover:bg-white/10 active:bg-white/20 block px-3 py-2 text-base font-medium transition-all duration-200 rounded-lg"
              onClick={() => {
                setIsClosing(true);
                setTimeout(() => {
                  setIsOpen(false);
                  setIsClosing(false);
                }, 300);
              }}
            >
              Temukan Unyul
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
