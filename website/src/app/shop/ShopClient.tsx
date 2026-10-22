'use client'
'use client'

import CartButton from './CartButton'
import FloatingCart from './FloatingCart'
import { useMemo, useState } from 'react'

export default function ShopClient({ products }: { products: any[] }) {
  const [search, setSearch] = useState('')
  const [wishlist, setWishlist] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      return JSON.parse(localStorage.getItem('partmitra_wishlist') || '[]').map((item: any) =>
        String(typeof item === 'object' ? item.id : item)
      )
    } catch {
      return []
    }
  })

  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return products

    return products.filter((product) =>
      [
        product.product_name,
        product.part_number,
        product.brand,
        product.compatible_vehicles,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q))
    )
  }, [products, search])

  function toggleWishlist(product: any) {
    const id = String(product.id)
    const current = JSON.parse(localStorage.getItem('partmitra_wishlist') || '[]')
    const exists = current.some((item: any) => String(typeof item === 'object' ? item.id : item) === id)
    const next = exists
      ? current.filter((item: any) => String(typeof item === 'object' ? item.id : item) !== id)
      : [...current, product]
    localStorage.setItem('partmitra_wishlist', JSON.stringify(next))
    setWishlist(next.map((item: any) => String(typeof item === 'object' ? item.id : item)))
  }

  function addToCart(product: any) {
    const cart = JSON.parse(localStorage.getItem('partmitra_cart') || '[]')
    const existing = cart.find((item: any) => item.id === product.id)

    if (existing) existing.quantity += 1
    else cart.push({ ...product, quantity: 1 })

    localStorage.setItem('partmitra_cart', JSON.stringify(cart))
    alert('Added to cart')
  }

  return (
    <>
      <FloatingCart />
      <div className="mb-3 flex justify-end">
        <CartButton />
      </div>

      <div className="mt-6">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search part number, name, brand or vehicle..."
          className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-5 text-base text-gray-900 placeholder:text-gray-400 shadow-md outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <p className="mt-5 text-sm font-medium text-gray-600">
        {filteredProducts.length} product
        {filteredProducts.length !== 1 ? 's' : ''} found
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <article
            key={product.id}
            className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg transition hover:shadow-xl"
          >
            <div className="relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-gray-100 to-white">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.product_name}
                  className="h-full w-full object-contain p-6"
                />
              ) : (
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-400">No Photo</div>
                  <p className="mt-2 text-xs text-gray-400">Product photo coming soon</p>
                </div>
              )}

              <span className="absolute left-4 top-4 max-w-[80%] rounded-full bg-white px-3 py-1.5 text-xs font-bold text-gray-800 shadow-md">
                {product.brand || ''}
              </span>
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                aria-label={wishlist.includes(String(product.id)) ? 'Remove from wishlist' : 'Add to wishlist'}
                title={wishlist.includes(String(product.id)) ? 'Remove from wishlist' : 'Add to wishlist'}
                className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-2xl shadow-sm transition hover:scale-105 ${wishlist.includes(String(product.id)) ? 'text-red-600' : 'text-gray-700'}`}
              >
                {wishlist.includes(String(product.id)) ? '♥' : '♡'}
              </button>
            </div>

            <div className="p-6">
              <h3 className="text-2xl font-bold leading-tight text-gray-950">
                {product.product_name}
              </h3>

              <div className="mt-3 space-y-1 break-words text-sm text-gray-500">
                <p><span className="font-semibold text-gray-700">Part No:</span> {product.part_number}</p>
                <p><span className="font-semibold text-gray-700">Vehicle:</span> {product.compatible_vehicles || 'Multiple vehicles'}</p>
              </div>

              <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500">Our Price</p>
                  <p className="mt-1 text-3xl font-extrabold text-gray-950">
                    ₹{Number(product.our_price).toLocaleString('en-IN')}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${
                  product.stock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 grid grid-cols-2 gap-2">
                <a
                  href={`/shop/product/${product.id}`}
                  className="col-span-2 w-full rounded-xl border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-800"
                >
                  View Details
                </a>

                {product.stock > 0 ? (
                            <div className="grid w-full grid-cols-2 gap-2">
            <button
              onClick={() => addToCart(product)}
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold"
            >
              Add to Cart
            </button>

<button type="button" className="w-full min-w-0 whitespace-nowrap min-w-0 min- whitespace-normal break-words rounded-xl bg-gray-950 px-3 py-3 text-center text-sm font-semibold text-white" onClick={() => { addToCart(product); window.location.href = "/checkout"; }}>Buy Now</button>
          </div>
                ) : (
                  <span className="block rounded-xl bg-gray-100 px-3 py-3 text-center text-sm font-semibold text-gray-400">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>
          </article>
        ))}

        {filteredProducts.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center text-gray-500 sm:col-span-2 lg:col-span-3">
            No matching parts found.
          </div>
        )}
      </div>
    </>
  )
}
