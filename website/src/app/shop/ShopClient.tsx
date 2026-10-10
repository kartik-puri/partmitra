'use client'

import CartButton from './CartButton'
import FloatingCart from './FloatingCart'
import { useMemo, useState } from 'react'

export default function ShopClient({ products }: { products: any[] }) {
  const [search, setSearch] = useState('')

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

  function addToCart(product: any) {
    const cart = JSON.parse(localStorage.getItem('partmitra_cart') || '[]')
    const existing = cart.find((item: any) => item.id === product.id)

    if (existing) {
      existing.quantity += 1
    } else {
      cart.push({
        ...product,
        quantity: 1,
      })
    }

    localStorage.setItem('partmitra_cart', JSON.stringify(cart))
    alert('Added to cart')
  }

  return (
    <>
      <FloatingCart />
      <div className="mb-3 flex justify-end"><CartButton /></div><div className="mt-6">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search part number, name, brand or vehicle..."
          className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 text-sm shadow-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
        />
      </div>

      <p className="mt-5 text-sm font-medium text-gray-500">
        {filteredProducts.length} product
        {filteredProducts.length !== 1 ? 's' : ''} found
      </p>

      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <article
            key={product.id}
            className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="relative flex aspect-[4/3] items-center justify-center bg-gray-50">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.product_name}
                  className="h-full w-full object-contain p-5"
                />
              ) : (
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-400">No Photo</div>
                  <p className="mt-2 text-xs text-gray-400">
                    Product photo coming soon
                  </p>
                </div>
              )}

              <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-bold shadow-sm">
                {product.brand || ''}
              </span>
            </div>

            <div className="p-5">
              <h3 className="text-xl font-bold leading-tight text-gray-950">
                {product.product_name}
              </h3>

              <div className="mt-3 space-y-1 text-sm text-gray-500">
                <p>
                  <span className="font-semibold text-gray-700">Part No:</span>{' '}
                  {product.part_number}
                </p>

                <p>
                  <span className="font-semibold text-gray-700">Vehicle:</span>{' '}
                  {product.compatible_vehicles || 'Multiple vehicles'}
                </p>
              </div>

              <div className="mt-5 flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-gray-500">Our Price</p>
                  <p className="mt-1 text-2xl font-bold text-gray-950">
                    ₹{Number(product.our_price).toLocaleString('en-IN')}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                    product.stock > 0
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <div className="mt-5 space-y-2">
                <a
                  href={`/shop/product/${product.id}`}
                  className="block w-full rounded-xl border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-800"
                >
                  View Details
                </a>

                {product.stock > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full min-w-0 rounded-xl border border-gray-200 px-2 py-3 text-center text-sm font-semibold"
                    >
                      Add to Cart
                    </button>

                    <a
                      href={`https://wa.me/919882036021?text=${encodeURIComponent(
                        `Hello, I want to buy ${product.product_name}.\nPart No: ${product.part_number}\nVehicle: ${product.compatible_vehicles || 'Not specified'}\nPrice: ₹${Number(product.our_price).toLocaleString('en-IN')}\nDelivery: ${
                          Number(product.our_price) >= 5500
                            ? 'Free Delivery'
                            : 'Delivery charges extra'
                        }`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full min-w-0 rounded-xl bg-gray-950 px-2 py-3 text-center text-sm font-semibold text-white"
                    >
                      Buy Now
                    </a>
                  </div>
                ) : (
                  <span className="block rounded-xl bg-gray-100 px-3 py-3 text-center text-sm font-semibold text-gray-400">
                    Out of Stock
                  </span>
                )}
              </div>
                ) : (
                  <span className="rounded-xl bg-gray-100 px-3 py-3 text-center text-sm font-semibold text-gray-400">
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
