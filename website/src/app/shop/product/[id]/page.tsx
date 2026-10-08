import { supabase } from '@/lib/supabase'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { data: product, error } = await supabase
    .from('Products')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error || !product) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <a href="/shop" className="mt-4 inline-block underline">
          Back to Shop
        </a>
      </main>
    )
  }

  const message = `Hello, I want to enquire about ${product.product_name}.
Part No: ${product.part_number}
Vehicle: ${product.compatible_vehicles || 'Not specified'}
Price: ₹${Number(product.our_price).toLocaleString('en-IN')}

Please confirm availability and delivery charges.`

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-5 py-5">
          <a href="/shop" className="text-sm text-gray-500">
            ← Back to Shop
          </a>

          <h1 className="mt-2 text-2xl font-bold">PartMitra</h1>

          <p className="text-sm text-gray-500">
            Your Trusted Auto Parts Partner
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-8">
        <div className="grid gap-8 rounded-3xl bg-white p-5 shadow-sm sm:p-8 md:grid-cols-2">
          <div className="flex aspect-square items-center justify-center rounded-2xl bg-gray-100">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.product_name}
                className="h-full w-full object-contain p-6"
              />
            ) : (
              <span className="text-gray-400">No product photo</span>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <p className="font-semibold text-gray-500">
              {product.brand || 'Auto Parts'}
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {product.product_name}
            </h2>

            <div className="mt-5 space-y-2 text-gray-600">
              <p>
                <strong>Part No:</strong> {product.part_number}
              </p>

              <p>
                <strong>Vehicle:</strong>{' '}
                {product.compatible_vehicles || 'Multiple vehicles'}
              </p>
            </div>

            <div className="mt-6">
              <p className="text-3xl font-bold">
                ₹{Number(product.our_price).toLocaleString('en-IN')}
              </p>
            </div>

            <p
              className={`mt-4 font-semibold ${
                product.stock > 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {product.stock > 0
                ? `✓ In Stock (${product.stock})`
                : '✕ Out of Stock'}
            </p>

            <div className="mt-5 rounded-xl bg-gray-50 p-4 text-sm">
              <p className="font-semibold">🚚 Delivery</p>

              <p className="mt-1 text-gray-600">
                Orders ₹5,500+ qualify for free delivery.
              </p>

              <p className="text-gray-600">
                Below ₹5,500, delivery charges are extra.
              </p>
            </div>

            <a
              href={`https://wa.me/919882036021?text=${encodeURIComponent(message)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 block rounded-xl bg-black px-5 py-3 text-center font-semibold text-white"
            >
              💬 Enquire on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
