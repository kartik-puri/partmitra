"use client";

import { useState } from "react";

export default function MenuButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen(!open)}
        style={{ fontSize: 28, padding: "6px 12px", background: "transparent", border: 0, cursor: "pointer" }}
      >
        ☰
      </button>

      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,.45)" }} onClick={() => setOpen(false)}>
          <nav aria-label="Main menu" style={{ width: 280, maxWidth: "85vw", height: "100%", background: "white", color: "#222", padding: 24, boxSizing: "border-box" }} onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setOpen(false)} style={{ float: "right", fontSize: 24, border: 0, background: "transparent" }}>×</button>
            <h2 style={{ margin: "20px 0" }}>PartMitra</h2>
            {[
              ["Home", "/"],
              ["Shop", "/shop"],
              ["Wishlist", "/wishlist"],
              ["Cart", "/cart"],
              ["Login / Register", "/login"]
            ].map(([label, href]) => (
              <a key={label} href={href} style={{ display: "block", padding: "14px 0", color: "inherit", textDecoration: "none", borderBottom: "1px solid #eee" }}>{label}</a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
