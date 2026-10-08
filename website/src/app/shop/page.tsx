import { supabase } from '@/lib/supabase'
import ShopClient from './ShopClient'

export default async function Shop() {
  const { data: products, error } = await supabase
    .from('Products')
    .select('*')
    .eq('is_active', true)
    .order('id', { ascending: false })

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-3xl font-bold">PartMitra</h1>
        <p className="mt-4 text-red-600">Unable to load products.</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-5 sm:py-5">
          <a href="/" className="min-w-0">
            <h1 className="truncate text-xl font-bold tracking-tight sm:text-2xl">
              PartMitra
            </h1>
            <p className="truncate text-xs text-gray-500 sm:text-sm">
              Your Trusted Auto Parts Partner
            </p>
          </a>

          <a
            href="/"
            className="shrink-0 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-800"
          >
            Home
          </a>
        </div>
      </header>

      <section className="bg-gray-950 text-white">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-400">
            PartMitra Store
          </p>
          <h2 className="mt-3 text-4xl font-bold">
            Find the right auto part
          </h2>
          <p className="mt-3 text-gray-300">
            Search by part number, vehicle, brand or product name.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-8">
        <ShopClient products={products || []} />

        <div className="mt-10 rounded-2xl border bg-white p-5 text-sm">
          <p className="font-bold">🚚 Delivery Information</p>
          <p className="mt-2 text-gray-600">
            Orders of ₹5,500 or more qualify for free delivery.
          </p>
          <p className="text-gray-600">
            Below ₹5,500, delivery charges are extra.
          </p>
        </div>
      </section>

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-5 py-8 text-sm text-gray-500">
          PartMitra — A Laxmi Traders initiative
        </div>
      </footer>
    </main>
  )
}
