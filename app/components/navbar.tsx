"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

// Memoized nav link component
const NavLink = memo(function NavLink({
  href,
  children,
  className,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  className: string;
  onClick?: () => void;
}) {
  return (
    <Link href={href} className={className} onClick={onClick} prefetch={false}>
      {children}
    </Link>
  );
});

const Navbar = memo(function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 0);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 300);
  }, []);

  const toggleMenu = useCallback(() => {
    if (isOpen) {
      closeMenu();
    } else {
      setIsOpen(true);
    }
  }, [isOpen, closeMenu]);

  const navItems = [
    { href: "#hero", label: "Beranda" },
    { href: "#about", label: "Tentang Unyul" },
    { href: "#gallery", label: "Galeri Unyul" },
    { href: "#find", label: "Temukan Unyul" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/95 text-white shadow-md"
          : "bg-transparent text-white"
      } font-poppins`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center justify-start h-16">
          <button
            onClick={toggleMenu}
            className="relative text-white hover:text-gray-300 focus:outline-none focus:text-gray-300"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen ? "true" : "false"}
          >
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

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center justify-end h-16">
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                className="text-white hover:text-gray-300 hover:bg-white/10 active:bg-white/20 px-3 py-2 text-sm font-medium transition-all duration-200 rounded-full"
              >
                {item.label}
              </NavLink>
            ))}
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
          onClick={closeMenu}
        >
          <div
            className="absolute inset-0 bg-black/95 px-4 pt-20 pb-6 space-y-4 sm:px-6 overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Close menu"
              onClick={closeMenu}
              className="absolute top-4 left-4 z-50 text-white p-2 rounded-md hover:text-gray-300 focus:outline-none"
            >
              <X className="h-7 w-7" />
            </button>

            {navItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                className="text-white hover:text-gray-300 hover:bg-white/10 active:bg-white/20 block px-3 py-2 text-base font-medium transition-all duration-200 rounded-lg"
                onClick={closeMenu}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
});

export default Navbar;
