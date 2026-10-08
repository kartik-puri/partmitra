'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function History() {
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    async function loadHistory() {
      const { data } = await supabase
        .from('stock_movements')
        .select('*, Products(product_name, part_number)')
        .order('id', { ascending: false })

      setHistory(data || [])
    }

    loadHistory()
  }, [])

  return (
    <main className='min-h-screen bg-gray-50 p-6'>
      <div className='mx-auto max-w-6xl'>
        <h1 className='text-3xl font-bold'>History</h1>
        <p className='mt-1 text-gray-500'>Stock In and Stock Out history</p>

        <div className='mt-6 space-y-3'>
          {history.map((item) => (
            <div key={item.id} className='rounded-2xl bg-white p-5 shadow'>
              <p className='font-bold'>
                {item.Products?.part_number} — {item.Products?.product_name}
              </p>

              <p className='mt-2 text-sm'>
                {item.movement_type === 'IN' ? '🟢 Stock In' : '🔴 Stock Out'}
                {' · '}
                Quantity: {item.quantity}
              </p>

              <p className='mt-1 text-sm text-gray-500'>
                {item.note || 'No note'}
              </p>
            </div>
          ))}

          {history.length === 0 && (
            <div className='rounded-2xl bg-white p-8 text-center text-gray-500'>
              No stock history yet.
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
