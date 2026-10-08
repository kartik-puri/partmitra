'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('Products').select('*')
      setProducts(data || [])
    }
    load()
  }, [])

  const totalQuantity = products.reduce((sum, p) => sum + Number(p.stock || 0), 0)
  const stockValue = products.reduce(
    (sum, p) => sum + Number(p.stock || 0) * Number(p.our_price || 0),
    0
  )
  const lowStock = products.filter(
    (p) => Number(p.stock || 0) <= Number(p.minimum_stock || 0)
  )

  return (
    <main className='min-h-screen bg-gray-50 p-6'>
      <div className='mx-auto max-w-6xl'>
        <h1 className='text-3xl font-bold'>Laxmi Traders</h1>
        <p className='mt-1 text-gray-500'>Spare Parts Stock Manager</p>

        <div className='mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <div className='rounded-2xl bg-white p-5 shadow'>
            <p className='text-gray-500'>Products</p>
            <p className='mt-2 text-3xl font-bold'>{products.length}</p>
          </div>

          <div className='rounded-2xl bg-white p-5 shadow'>
            <p className='text-gray-500'>Total Quantity</p>
            <p className='mt-2 text-3xl font-bold'>{totalQuantity}</p>
          </div>

          <div className='rounded-2xl bg-white p-5 shadow'>
            <p className='text-gray-500'>Stock Value</p>
            <p className='mt-2 text-3xl font-bold'>
              ₹{stockValue.toLocaleString('en-IN')}
            </p>
          </div>

          <div className='rounded-2xl bg-white p-5 shadow'>
            <p className='text-gray-500'>Low Stock</p>
            <p className='mt-2 text-3xl font-bold'>{lowStock.length}</p>
          </div>
        </div>

        <div className='mt-8 rounded-2xl bg-white p-6 shadow'>
          <h2 className='text-xl font-bold'>Low Stock</h2>

          {lowStock.length === 0 ? (
            <p className='mt-4 text-gray-500'>No low-stock products.</p>
          ) : (
            <div className='mt-4 space-y-3'>
              {lowStock.map((p) => (
                <div key={p.id} className='rounded-lg bg-gray-50 p-4'>
                  <p className='font-semibold'>
                    {p.part_number} — {p.product_name}
                  </p>
                  <p className='text-sm text-gray-500'>
                    Stock: {p.stock} · Minimum: {p.minimum_stock}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
