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
        <p className="text-white text-sm">
          Copyright 2025 Unyul. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
