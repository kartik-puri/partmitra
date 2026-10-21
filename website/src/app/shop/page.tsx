import SiteHeader from "../SiteHeader";
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
      <SiteHeader />

      <section className="bg-[#080d12] text-white">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:py-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
            Laxmi Traders • PartMitra Store
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Find the right auto part
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-gray-300 sm:text-base">
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
