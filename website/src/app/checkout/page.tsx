'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function CheckoutPage() {
  const [cart, setCart] = useState<any[]>([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('+91 ')
  const [address, setAddress] = useState('')
  const [pincode, setPincode] = useState('')
  const [location, setLocation] = useState('')
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('partmitra_cart') || '[]')
    setCart(saved)
  }, [])

  useEffect(() => {
    if (pincode.length !== 6) {
      setLocation('')
      return
    }

    const checkPincode = async () => {
      setChecking(true)

      try {
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${pincode}`
        )

        const data = await response.json()

        if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.length) {
          const postOffice = data[0].PostOffice[0]

          setLocation(
            `${postOffice.Name}, ${postOffice.District}, ${postOffice.State}`
          )
        } else {
          setLocation('Invalid pincode')
        }
      } catch {
        setLocation('Unable to check pincode')
      }

      setChecking(false)
    }

    checkPincode()
  }, [pincode])

  const subtotal = cart.reduce(
    (total, item) =>
      total + Number(item.our_price || 0) * Number(item.quantity || 0),
    0
  )

  const nonEligible = cart.some(
    (item) => item.free_delivery_eligible === false
  )

  const freeDelivery = subtotal >= 5500 && !nonEligible

  const phoneDigits = phone.replace(/\D/g, '').replace(/^91/, '')

  const hasUndeliverableItems = cart.some(
    (item) => item.online_delivery_available === false || item.free_delivery_eligible === false
  )
  const deliveryCharge = hasUndeliverableItems ? 0 : subtotal >= 5500 ? 0 : 499
  const payableTotal = subtotal + deliveryCharge

  const valid =
    name.trim() !== '' &&
    phoneDigits.length === 10 &&
    address.trim() !== '' &&
    pincode.length === 6 &&
    location !== '' &&
    location !== 'Invalid pincode'

  function changePhone(value: string) {
    let digits = value.replace(/\D/g, '')

    if (digits.startsWith('91')) {
      digits = digits.substring(2)
    }

    digits = digits.substring(0, 10)

    setPhone('+91 ' + digits)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-5 py-5">
          <Link href="/shop" className="text-2xl font-bold">
            PartMitra
          </Link>
          <p className="text-sm text-gray-500">Secure Checkout</p>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-8">
        <h1 className="text-3xl font-bold">Checkout</h1>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Customer Details</h2>

            <label className="mt-5 block text-sm font-semibold">
              Full Name *
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-xl border p-3"
              placeholder="Enter your full name"
            />

            <label className="mt-4 block text-sm font-semibold">
              Mobile Number *
            </label>

            <input
              type="tel"
              value={phone}
              onChange={(e) => changePhone(e.target.value)}
              className="mt-2 w-full rounded-xl border p-3"
              placeholder="+91 9876543210"
            />

            <p className="mt-1 text-xs text-gray-500">
              Only +91 Indian mobile numbers are accepted.
            </p>

            <label className="mt-4 block text-sm font-semibold">
              Full Address *
            </label>

            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-2 min-h-28 w-full rounded-xl border p-3"
              placeholder="House/Shop, Street, Village/Area"
            />

            <label className="mt-4 block text-sm font-semibold">
              Pincode *
            </label>

            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={pincode}
              onChange={(e) =>
                setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))
              }
              className="mt-2 w-full rounded-xl border p-3"
              placeholder="6-digit pincode"
            />

            {checking && (
              <p className="mt-2 text-sm text-gray-500">
                Checking pincode...
              </p>
            )}

            {location && !checking && (
              <div className="mt-2 rounded-xl bg-gray-50 p-3 text-sm">
                <b>Location:</b> {location}
              </div>
            )}
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Order Summary</h2>

            <div className="mt-5 space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between gap-4 text-sm"
                >
                  <span>
                    {item.product_name} × {item.quantity}
                  </span>

                  <span className="font-semibold">
                    ₹{(
                      Number(item.our_price || 0) * Number(item.quantity || 0)
                    ).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="mt-2 flex justify-between">
                <span>Delivery</span>
                <span className="font-semibold">
                  {freeDelivery ? 'Free Delivery' : 'Delivery charges extra'}
                </span>
              </div>

              <div className="mt-4 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="my-5 rounded-xl border p-4 text-sm">
  <div className="flex justify-between py-1"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
  {hasUndeliverableItems ? (
    <p className="mt-3 rounded-lg bg-amber-50 p-3 text-amber-900">Due to high delivery charges on heavy / big size products, delivery is unavailable for this product. Please remove heavy products to continue.</p>
  ) : (
    <>
      <div className="flex justify-between py-1"><span>Delivery</span><span>{deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge.toLocaleString('en-IN')}`}</span></div>
      <div className="mt-2 flex justify-between border-t pt-3 text-base font-bold"><span>Total Payable</span><span>₹{payableTotal.toLocaleString('en-IN')}</span></div>
    </>
  )}
</div>
<button
              disabled={!valid || hasUndeliverableItems}
              className={`mt-6 w-full rounded-xl px-5 py-3 font-semibold ${
                valid
                  ? 'bg-gray-950 text-white'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              Pay Now — Coming Next
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
