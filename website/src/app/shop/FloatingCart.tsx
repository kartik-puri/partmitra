'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function FloatingCart() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 500)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!show) return null

  function goToCart() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <Link
        href="/cart"
        onClick={(e) => {
          e.preventDefault()
          goToCart()
        }}
        className="rounded-full bg-gray-950 px-5 py-3 text-sm font-semibold text-white shadow-lg"
      >
        🛒 Cart
      </Link>
    </div>
  )
}
