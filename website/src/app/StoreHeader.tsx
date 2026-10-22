"use client";

import { useState } from "react";

export default function StoreHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white text-gray-900 shadow-sm">
      <div className="mx-auto max-w-7xl px-3 sm:px-4">
        <div className="flex min-h-[68px] items-center justify-between gap-2">
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-2xl hover:bg-gray-100"
          >
            ☰
          </button>

          <a href="/" aria-label="PartMitra home" className="min-w-0 flex-1">
            <span className="block text-lg font-extrabold tracking-tight sm:text-2xl">PartMitra</span>
            <span className="hidden text-[10px] text-gray-500 sm:block sm:text-xs">Your Trusted Auto Parts Partner</span>
          </a>

          <nav className="flex shrink-0 items-center gap-1 sm:gap-3" aria-label="Store shortcuts">
            <a href="/shop" className="rounded-lg px-2 py-2 text-sm font-semibold hover:bg-gray-100 sm:px-3">Shop</a>
            <a href="/login" className="flex min-h-10 items-center gap-1 rounded-lg px-1.5 text-sm font-semibold hover:bg-gray-100 sm:gap-2 sm:px-3" aria-label="Login or register">
              <span className="text-xl" aria-hidden="true">👤</span>
              <span className="hidden sm:inline">Login / Register</span>
            </a>
            <a href="/cart" className="flex min-h-10 items-center gap-1 rounded-lg px-1.5 text-sm font-semibold hover:bg-gray-100 sm:gap-2 sm:px-3" aria-label="Shopping cart">
              <span className="text-xl" aria-hidden="true">🛒</span>
              <span className="hidden sm:inline">Cart</span>
            </a>
          </nav>
        </div>

        {menuOpen && (
          <nav className="border-t border-gray-200 py-3" aria-label="Main menu">
            <div className="grid gap-1 text-sm font-medium">
              <a className="rounded-lg px-3 py-2 hover:bg-gray-100" href="/">Home</a>
              <a className="rounded-lg px-3 py-2 hover:bg-gray-100" href="/shop">Shop auto parts</a>
              <a className="rounded-lg px-3 py-2 hover:bg-gray-100" href="/wishlist">Wishlist</a>
              <a className="rounded-lg px-3 py-2 hover:bg-gray-100" href="/cart">Cart</a>
              <a className="rounded-lg px-3 py-2 hover:bg-gray-100" href="/login">Login / Register</a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
