'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([])

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('partmitra_cart') || '[]')
    setCart(saved)
  }, [])

  function updateQuantity(id: number, change: number) {
    const updated = cart
      .map((item) =>
        item.id === id
          ? { ...item, quantity: Math.min(item.quantity + change, Number(item.stock || 0)) }
          : item
      )
      .filter((item) => item.quantity > 0)

    setCart(updated)
    localStorage.setItem('partmitra_cart', JSON.stringify(updated))
  }

  const total = cart.reduce(
    (sum, item) => sum + Number(item.our_price || 0) * item.quantity,
    0
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <Link href="/" className="text-2xl font-bold">
            PartMitra
          </Link>

          <Link
            href="/shop"
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold"
          >
            Continue Shopping
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-5 py-10">
        <h1 className="text-3xl font-bold">Your Cart</h1>

        {cart.length === 0 ? (
          <div className="mt-6 rounded-3xl bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-semibold">Your cart is empty</p>

            <Link
              href="/shop"
              className="mt-6 inline-block rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white"
            >
              Browse Auto Parts
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-6 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm"
                >
                  <div className="h-24 w-24 shrink-0 rounded-xl bg-gray-100">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.product_name}
                        className="h-full w-full object-contain p-2"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="font-bold">{item.product_name}</h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Part No: {item.part_number}
                    </p>

                    <p className="mt-2 font-bold">
                      ₹{Number(item.our_price).toLocaleString('en-IN')}
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="h-9 w-9 rounded-lg border"
                      >
                        −
                      </button>

                      <span className="font-semibold">{item.quantity}</span>

                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="h-9 w-9 rounded-lg border"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>

              <Link
                href="/checkout"
                className="mt-5 block w-full rounded-xl bg-gray-950 px-5 py-3 text-center font-semibold text-white"
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </section>
    </main>
  )
}
