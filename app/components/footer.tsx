import React from "react";

export default function Footer() {
  return (
    <footer
      aria-label="Site footer"
      style={{
        background:
          "linear-gradient(90deg, #000000 0%, #0F1626 50%, #000000 100%)",
      }}
      className="w-full text-center"
    >
      <div className="max-w-7xl mx-auto px-4 py-6">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <span className="text-slate-300 font-semibold">Unyul</span>. Developed
          by{" "}
          <a
            href="https://utaaa.my.id"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 font-semibold hover:text-white transition-colors"
          >
            Utaaa
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
