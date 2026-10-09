'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function EditProduct() {
  const [onlineDeliveryAvailable, setOnlineDeliveryAvailable] = useState(true)
  const [products, setProducts] = useState<any[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const [form, setForm] = useState({
    product_name: '',
    part_number: '',
    compatible_vehicles: '',
    brand: '',
    purchase_price: '',
    our_price: '',
    minimum_stock: '',
    supplier: '',
    rack_location: '',
  })

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    const { data } = await supabase
      .from('Products')
      .select('*')
      .order('id')

    setProducts(data || [])
  }

  function selectProduct(id: string) {
    setSelectedId(id)

    const p = products.find((item) => String(item.id) === id)

    if (!p) return

    setForm({
      product_name: p.product_name || '',
      part_number: p.part_number || '',
      compatible_vehicles: p.compatible_vehicles || '',
      brand: p.brand || '',
      purchase_price: String(p.purchase_price || ''),
      our_price: String(p.our_price || ''),
      minimum_stock: String(p.minimum_stock || ''),
      supplier: p.supplier || '',
      rack_location: p.rack_location || '',
    })

    setMessage('')
  }

  async function saveChanges() {
    if (!selectedId) {
      setMessage('Please select a product.')
      return
    }

    setSaving(true)
    setMessage('')

    const { error } = await supabase
      .from('Products')
      .update({
        product_name: form.product_name,
        part_number: form.part_number,
        compatible_vehicles: form.compatible_vehicles,
        brand: form.brand,
        purchase_price: Number(form.purchase_price || 0),
        our_price: Number(form.our_price || 0),
        minimum_stock: Number(form.minimum_stock || 0),
        supplier: form.supplier,
        rack_location: form.rack_location,
      
      online_delivery_available: onlineDeliveryAvailable,})
      .eq('id', Number(selectedId))

    if (error) {
      setMessage('Error: ' + error.message)
    } else {
      setMessage('Product updated successfully!')
      await loadProducts()
    }

    setSaving(false)
  }

  return (
    <main className='min-h-screen bg-gray-50 p-6'>
      <div className='mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow'>
        <h1 className='text-3xl font-bold'>Edit Product</h1>

        <select
          className='mt-6 w-full rounded-lg border p-3'
          value={selectedId}
          onChange={(e) => selectProduct(e.target.value)}
        >
          <option value=''>Select Product</option>

          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.part_number} — {p.product_name}
            </option>
          ))}
        </select>

        {selectedId && (
          <div className='mt-5 space-y-3'>
            <input
              className='w-full rounded-lg border p-3'
              placeholder='Part Number'
              value={form.part_number}
              onChange={(e) =>
                setForm({ ...form, part_number: e.target.value })
              }
            />

            <input
              className='w-full rounded-lg border p-3'
              placeholder='Part Name'
              value={form.product_name}
              onChange={(e) =>
                setForm({ ...form, product_name: e.target.value })
              }
            />

            <input
              className='w-full rounded-lg border p-3'
              placeholder='Vehicle'
              value={form.compatible_vehicles}
              onChange={(e) =>
                setForm({ ...form, compatible_vehicles: e.target.value })
              }
            />

            <input
              className='w-full rounded-lg border p-3'
              placeholder='Brand'
              value={form.brand}
              onChange={(e) =>
                setForm({ ...form, brand: e.target.value })
              }
            />

            <input
              className='w-full rounded-lg border p-3'
              placeholder='MRP'
              type='number'
              value={form.purchase_price}
              onChange={(e) =>
                setForm({ ...form, purchase_price: e.target.value })
              }
            />

            <input
              className='w-full rounded-lg border p-3'
              placeholder='Selling Price'
              type='number'
              value={form.our_price}
              onChange={(e) =>
                setForm({ ...form, our_price: e.target.value })
              }
            />

            <input
              className='w-full rounded-lg border p-3'
              placeholder='Minimum Stock'
              type='number'
              value={form.minimum_stock}
              onChange={(e) =>
                setForm({ ...form, minimum_stock: e.target.value })
              }
            />

            <input
              className='w-full rounded-lg border p-3'
              placeholder='Supplier'
              value={form.supplier}
              onChange={(e) =>
                setForm({ ...form, supplier: e.target.value })
              }
            />

            <input
              className='w-full rounded-lg border p-3'
              placeholder='Shelf / Location'
              value={form.rack_location}
              onChange={(e) =>
                setForm({ ...form, rack_location: e.target.value })
              }
            />

            <div className="mb-4">
        <label className="mb-2 block text-sm font-medium">Online Delivery Available</label>
        <select
          value={onlineDeliveryAvailable ? 'yes' : 'no'}
          onChange={(e) => setOnlineDeliveryAvailable(e.target.value === 'yes')}
          className="w-full rounded-lg border p-3"
        >
          <option value="yes">Yes — Normal online delivery</option>
          <option value="no">No — Heavy / Big-size product</option>
        </select>
      </div>
      <button
              onClick={saveChanges}
              disabled={saving}
              className='w-full rounded-lg bg-black p-3 font-semibold text-white disabled:opacity-50'
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>

            {message && (
              <p className='rounded-lg bg-gray-100 p-3 text-sm'>
                {message}
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
