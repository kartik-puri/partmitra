'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function NewProduct() {
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  async function saveProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formElement = e.currentTarget
    setSaving(true)
    setMessage('')

    try {
      const form = new FormData(e.currentTarget)

      const partNumber = String(form.get('part_number') || '').trim()
      const partName = String(form.get('product_name') || '').trim()
      const vehicle = String(form.get('compatible_vehicles') || '').trim()
      const brand = String(form.get('brand') || '').trim()
      const purchasePrice = Number(form.get('purchase_price') || 0)
      const sellingPrice = Number(form.get('our_price') || 0)
      const stock = Number(form.get('stock') || 0)
      const minimumStock = Number(form.get('minimum_stock') || 0)
      const supplier = String(form.get('supplier') || '').trim()
      const shelf = String(form.get('rack_location') || '').trim()
      const file = form.get('image') as File | null

      if (!partNumber || !partName) {
        setMessage('Part Number and Part Name are required.')
        return
      }

      let imageUrl = ''

      if (file && file.size > 0) {
        const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, file, {
            contentType: file.type || 'image/jpeg',
            upsert: false,
          })

        if (uploadError) {
          throw new Error(`Photo upload failed: ${uploadError.message}`)
        }

        const { data: publicData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName)

        imageUrl = publicData.publicUrl
      }

      const { error } = await supabase.from('Products').insert({
        part_number: partNumber,
        product_name: partName,
        compatible_vehicles: vehicle,
        brand: brand,
        purchase_price: purchasePrice,
        our_price: sellingPrice,
        stock,
        minimum_stock: minimumStock,
        supplier,
        rack_location: shelf,
        image_url: imageUrl,
        is_active: true,
      })

      if (error) {
        throw new Error(`Product save failed: ${error.message}`)
      }

      setMessage('Product saved successfully.')
      formElement.reset()
    } catch (error: any) {
      setMessage(error?.message || 'Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold">Add Product</h1>
        <p className="mt-1 text-gray-500">Add a new spare part</p>

        <form
          onSubmit={saveProduct}
          className="mt-8 space-y-4 rounded-2xl bg-white p-6 shadow"
        >
          <input name="part_number" required placeholder="Part Number *" className="w-full rounded-lg border p-3" />

          <input name="product_name" required placeholder="Part Name *" className="w-full rounded-lg border p-3" />

          <input name="compatible_vehicles" placeholder="Vehicle" className="w-full rounded-lg border p-3" />

          <input name="brand" placeholder="Brand" className="w-full rounded-lg border p-3" />

          <input name="purchase_price" placeholder="Purchase Price" type="number" min="0" className="w-full rounded-lg border p-3" />

          <input name="our_price" placeholder="Selling Price" type="number" min="0" className="w-full rounded-lg border p-3" />

          <input name="stock" placeholder="Quantity in Stock" type="number" min="0" className="w-full rounded-lg border p-3" />

          <input name="minimum_stock" placeholder="Minimum Stock" type="number" min="0" className="w-full rounded-lg border p-3" />

          <input name="supplier" placeholder="Supplier" className="w-full rounded-lg border p-3" />

          <input name="rack_location" placeholder="Location / Shelf" className="w-full rounded-lg border p-3" />

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Product Photo
            </label>
            <input
              name="image"
              type="file"
              accept="image/*"
              className="w-full rounded-lg border p-3"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-black p-3 font-semibold text-white disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Product'}
          </button>

          {message && (
            <p className="rounded-lg bg-gray-100 p-3 text-sm">
              {message}
            </p>
          )}
        </form>
      </div>
    </main>
  )
}
