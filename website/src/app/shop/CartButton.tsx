'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function CartButton() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const update = () => {
      try {
        const cart = JSON.parse(
          localStorage.getItem('partmitra_cart') || '[]'
        )

        setCount(
          cart.reduce(
            (total: number, item: any) =>
              total + Number(item.quantity || 0),
            0
          )
        )
      } catch {
        setCount(0)
      }
    }

    update()
    window.addEventListener('storage', update)

    return () => {
      window.removeEventListener('storage', update)
    }
  }, [])

  return (
    <Link
      href="/cart"
      className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold"
    >
      Cart{count > 0 ? ` (${count})` : ''}
    </Link>
  )
}
