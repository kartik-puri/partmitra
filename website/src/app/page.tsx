export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">PartMitra</h1>
            <p className="text-sm text-gray-500">
              Your Trusted Auto Parts Partner
            </p>
          </div>

          <a
            href="/shop"
            className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white"
          >
            Shop Parts
          </a>
        </div>
      </header>

      <section className="bg-gray-950 text-white">
        <div className="mx-auto max-w-6xl px-5 py-24 sm:py-32">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-400">
            PartMitra Auto Parts
          </p>

          <h2 className="mt-5 max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
            Quality auto parts.
            <br />
            The right part for your vehicle.
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300">
            Find spare parts from trusted brands with easy product search,
            clear pricing and direct WhatsApp enquiry.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="/shop"
              className="rounded-xl bg-white px-6 py-3 text-center font-semibold text-gray-950"
            >
              Browse Auto Parts
            </a>

            <a
              href="https://wa.me/919882036021?text=Hello%2C%20I%20want%20to%20enquire%20about%20auto%20parts."
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-gray-700 px-6 py-3 text-center font-semibold text-white"
            >
              Ask on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border p-6">
            <p className="text-2xl">✓</p>
            <h3 className="mt-4 text-lg font-bold">Trusted Brands</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Quality-focused auto parts from reliable brands.
            </p>
          </div>

          <div className="rounded-2xl border p-6">
            <p className="text-2xl">🚚</p>
            <h3 className="mt-4 text-lg font-bold">Free Delivery</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Free delivery on orders of ₹5,500 or more.
            </p>
          </div>

          <div className="rounded-2xl border p-6">
            <p className="text-2xl">💬</p>
            <h3 className="mt-4 text-lg font-bold">Easy Enquiry</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Enquire directly through WhatsApp.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t bg-gray-50">
        <div className="mx-auto max-w-6xl px-5 py-8 text-sm text-gray-500">
          PartMitra — A Laxmi Traders initiative
        </div>
      </footer>
    </main>
  )
}
