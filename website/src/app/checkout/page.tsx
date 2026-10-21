'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase';
import Link from 'next/link'

export default function CheckoutPage() {
  const [cart, setCart] = useState<any[]>([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('+91 ')
  const [address, setAddress] = useState('')
  const [pincode, setPincode] = useState('')
  const [location, setLocation] = useState('')
const [city, setCity] = useState('')
const [state, setState] = useState('')
  const [checking, setChecking] = useState(false)
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadSavedAddress() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !active) return;

      const { data, error } = await supabase
        .from("customer_addresses")
        .select("full_name, phone, address, city, state, pincode")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Saved address load error:", error);
        return;
      }

      if (data && active) {
        setName(data.full_name || "");
        setPhone(data.phone || "+91");
        setAddress([
          data.address,
          data.city,
          data.state,
          data.pincode
        ].filter(Boolean).join(", "));
        setPincode(data.pincode || "");
        setCity(data.city || "");
        setState(data.state || "");
      }
    }

    loadSavedAddress();
    return () => { active = false; };
  }, []);

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

  const deliverableCart = cart.filter(
    (item) => item.online_delivery_available !== false
  )
  const heavyCart = cart.filter(
    (item) => item.online_delivery_available === false
  )
  const hasUndeliverableItems = heavyCart.length > 0
  const subtotal = deliverableCart.reduce(
    (sum, item) => sum + Number(item.our_price || 0) * Number(item.quantity || 0), 0
  )
  const deliveryCharge = subtotal === 0 || subtotal >= 5500 ? 0 : 499
  const payableTotal = subtotal + deliveryCharge
  const freeDelivery = deliveryCharge === 0

  const phoneDigits = phone.replace(/\D/g, '')
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


  async function placeOrder() {
    if (placingOrder || !valid || !deliverableCart.length) return;

    setPlacingOrder(true);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;

      if (!user) {
        window.location.href = '/login';
        return;
      }

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          customer_name: name.trim(),
          phone: phone.replace(/\D/g, '').slice(-10),
          address: address.trim(),
          pincode: pincode.trim(),
          total_amount: payableTotal,
          delivery_charge: deliveryCharge,
          payment_status: 'pending',
          order_status: 'pending'
        })
        .select('id')
        .single();

      if (orderError) throw orderError;

      const items = deliverableCart.map(item => ({
        order_id: order.id,
        product_id: Number.isFinite(Number(item.id)) ? Number(item.id) : null,
        product_name: String(item.product_name),
        part_number: item.part_number || null,
        quantity: Number(item.quantity),
        price: Number(item.our_price),
        subtotal: Number(item.our_price) * Number(item.quantity)
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(items);

      if (itemsError) {
        alert('Order #' + order.id + ' bana, lekin items save nahi hue. Support se contact karein.');
        return;
      }

      alert('Order #' + order.id + ' save ho gaya. Payment abhi pending hai.');
      window.location.href = '/orders';
    } catch (error) {
      console.error('Order error:', error);
      alert('Order save nahi hua. Login aur Supabase permissions check karein.');
    } finally {
      setPlacingOrder(false);
    }
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
  <div className="flex justify-between py-1"><span>Deliverable products subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
  <div className="flex justify-between py-1"><span>Delivery</span><span>{deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge.toLocaleString('en-IN')}`}</span></div>
  <div className="mt-2 flex justify-between border-t pt-3 text-base font-bold"><span>Total payable</span><span>₹{payableTotal.toLocaleString('en-IN')}</span></div>
  {heavyCart.length > 0 && (
    <div className="mt-4 rounded-lg bg-amber-50 p-3 text-amber-900">
      <p className="font-semibold">Not deliverable online</p>
      {heavyCart.map((item) => (
        <p key={item.id} className="mt-1">
          {item.product_name} × {item.quantity} — ₹{(Number(item.our_price || 0) * Number(item.quantity || 0)).toLocaleString('en-IN')} (excluded from total).
        Due to high shipping charges for heavy and oversized products, online delivery is unavailable for this item. You can continue checkout with the other deliverable products.
        </p>
      ))}
    </div>
  )}
</div>
<button
          type="button"
          disabled={!valid || placingOrder}
          onClick={placeOrder}
          className={`mt-6 w-full rounded-xl px-5 py-3 font-semibold ${
            valid && !placingOrder
              ? 'bg-gray-950 text-white'
              : 'bg-gray-200 text-gray-400'
          }`}
        >
          {placingOrder ? 'Saving Order...' : 'Place Order (Payment Pending)'}
        </button>
          </div>
        </div>
      </section>
    </main>
  )
}
