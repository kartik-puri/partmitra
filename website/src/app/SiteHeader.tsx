 "use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
const [user, setUser] = useState<any>(null);

useEffect(() => {
  supabase.auth.getUser().then(({ data }) => setUser(data.user));
  const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null);
  });
  return () => listener.subscription.unsubscribe();
}, []);

async function handleLogout() {
  await supabase.auth.signOut();
  setOpen(false);
  window.location.href = "/login";
}

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-[#080d12] text-white shadow-lg">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 sm:px-5">
        <button
          type="button"
          aria-label="Open navigation menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="flex h-10 w-9 shrink-0 flex-col items-center justify-center gap-1.5 rounded-md hover:bg-white/10"
        >
          <span className="h-0.5 w-6 rounded bg-white" />
          <span className="h-0.5 w-6 rounded bg-white" />
          <span className="h-0.5 w-6 rounded bg-white" />
        </button>

        <a href="/" className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-xl font-black sm:h-11 sm:w-11">
            ⚙
          </span>
          <span className="min-w-0">
            <span className="block whitespace-nowrap text-xl font-extrabold tracking-tight sm:text-2xl">
              Part<span className="text-blue-400">Mitra</span>
            </span>
            <span className="block whitespace-nowrap text-[10px] text-gray-300 sm:text-xs">
              Right Parts. Better Drives.
            </span>
          </span>
        </a>

        <nav className="flex shrink-0 items-center gap-3 text-sm font-semibold sm:gap-5 sm:text-base">
          <a href="/shop" className="text-gray-200 hover:text-blue-400">Shop</a>

          
    <a href="/account" aria-label="Account" title="Account" className="flex h-9 w-9 items-center justify-center">
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M5 21a7 7 0 0 1 14 0" />
  </svg>
</a>
<a href="/cart" aria-label="Cart" className="flex h-9 w-8 items-center justify-center border-l border-gray-700 pl-3">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
            </svg>
          </a>
        
</nav>
      </div>

      {open && (
        <nav className="border-t border-gray-800 px-5 py-3"><a href="/" onClick={() => setOpen(false)} className="block py-2 hover:text-blue-400">🏠 Home</a>
{user ? (
<button type="button" onClick={handleLogout} className="block py-2 hover:text-blue-400">Logout</button>
) : (
<a href="/login" onClick={() => setOpen(false)} className="block py-2 hover:text-blue-400">Login / Sign Up</a>
)}
<a href="/shop" onClick={() => setOpen(false)} className="block py-2 hover:text-blue-400">🔧 Shop Parts</a>
<a href="/categories" onClick={() => setOpen(false)} className="block py-2 hover:text-blue-400">🚘 Categories</a>
<a href="/wishlist" onClick={() => setOpen(false)} className="block py-2 hover:text-blue-400">❤️ My Wishlist</a>
<a href="/cart" onClick={() => setOpen(false)} className="block py-2 hover:text-blue-400">🛒 Shopping Cart</a>
<a href="/orders" onClick={() => setOpen(false)} className="block py-2 hover:text-blue-400">📦 My Orders</a>
<a href="/track-order" onClick={() => setOpen(false)} className="block py-2 hover:text-blue-400">🚚 Track Order</a>
<a href="/delivery" onClick={() => setOpen(false)} className="block py-2 hover:text-blue-400">🚛 Delivery Information</a>
<a href="/contact" onClick={() => setOpen(false)} className="block py-2 hover:text-blue-400">💬 Contact Us / WhatsApp</a>
<a href="/about" onClick={() => setOpen(false)} className="block py-2 hover:text-blue-400">ℹ️ About PartMitra</a></nav>
      )}
    </header>
  );
}
