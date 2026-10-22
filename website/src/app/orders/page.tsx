'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadOrders() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = '/login'
        return
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) setMessage('Orders load nahi ho paaye.')
      else setOrders(data || [])

      setLoading(false)
    }

    loadOrders()
  }, [])

  if (loading) return <main className="p-8">Loading orders...</main>

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <Link href="/account" className="text-sm text-blue-700">
          ← My Account
        </Link>

        <h1 className="mb-6 mt-4 text-3xl font-bold">My Orders</h1>

        {message && <p className="rounded bg-red-50 p-3">{message}</p>}

        {orders.length === 0 && !message && (
          <div className="rounded-xl border bg-white p-6">
            <p className="font-semibold">Abhi koi order nahi hai.</p>
            <p className="mt-2 text-sm text-gray-600">
              Aapke orders yahan dikhai denge.
            </p>
            <Link href="/shop" className="mt-4 inline-block rounded bg-black px-5 py-3 text-white">
              Shop Now
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {orders.map((order) => (
            <section key={order.id} className="rounded-xl border bg-white p-5">
              <div className="flex flex-wrap justify-between gap-2">
                <div>
                  <h2 className="font-bold">Order #{order.id}</h2>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">
                    ₹{Number(order.total_amount).toLocaleString('en-IN')}
                  </p>
                  <p className="text-sm capitalize">
                    Payment: {order.payment_status}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-sm">
                Delivery status: <strong className="capitalize">{order.order_status}</strong>
              </p>

              <div className="mt-4 border-t pt-3">
                {(order.order_items || []).map((item: any) => (
                  <div key={item.id} className="flex justify-between gap-3 py-2 text-sm">
                    <div>
                      <p className="font-medium">{item.product_name}</p>
                      {item.part_number && <p className="text-gray-500">Part No: {item.part_number}</p>}
                      <p>Qty: {item.quantity}</p>
                    </div>
                    <p>₹{Number(item.subtotal ?? item.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
