"use client";

import { useState } from "react";

export default function StoreHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white text-gray-900 shadow-sm">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-10 items-center">
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-9 w-10 items-center justify-center rounded-lg text-2xl leading-none hover:bg-gray-100"
          >
            ☰
          </button>
          <span className="ml-2 text-xs font-medium text-gray-500">Menu</span>
        </div>

        <div className="flex min-h-[72px] items-center justify-between gap-3 border-t border-gray-100 py-3">
          <a href="/" aria-label="PartMitra home" className="min-w-0">
            <span className="block text-xl font-extrabold tracking-tight sm:text-2xl">PartMitra</span>
            <span className="block text-[10px] text-gray-500 sm:text-xs">Your Trusted Auto Parts Partner</span>
          </a>

          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <a href="/login" className="flex min-h-11 items-center gap-1.5 rounded-xl px-2 text-sm font-semibold hover:bg-gray-100 sm:px-3" aria-label="Login or register">
              <span className="text-xl" aria-hidden="true">👤</span>
              <span className="hidden sm:inline">Login / Register</span>
              <span className="sm:hidden">Login</span>
            </a>
            <a href="/cart" className="flex min-h-11 items-center gap-1.5 rounded-xl border border-gray-200 px-2.5 text-sm font-semibold hover:bg-gray-50 sm:px-3" aria-label="Shopping cart">
              <span className="text-xl" aria-hidden="true">🛒</span>
              <span className="hidden sm:inline">Cart</span>
            </a>
          </div>
        </div>

        <div className="flex min-h-11 items-center border-t border-gray-100">
          <a href="/wishlist" className="inline-flex items-center gap-2 py-2 text-sm font-semibold text-gray-700 hover:text-black">
            <span className="text-xl" aria-hidden="true">♡</span>
            Wishlist
          </a>
        </div>

        {menuOpen && (
          <nav className="border-t border-gray-200 py-3" aria-label="Main menu">
            <div className="grid gap-1 text-sm font-medium">
              <a className="rounded-lg px-3 py-2 hover:bg-gray-100" href="/">Home</a>
              <a className="rounded-lg px-3 py-2 hover:bg-gray-100" href="/shop">Shop auto parts</a>
              <a className="rounded-lg px-3 py-2 hover:bg-gray-100" href="/cart">Cart</a>
              <a className="rounded-lg px-3 py-2 hover:bg-gray-100" href="/wishlist">Wishlist</a>
              <a className="rounded-lg px-3 py-2 hover:bg-gray-100" href="/login">Login / Register</a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
