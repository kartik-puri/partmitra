'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Products() {
  const [products, setProducts] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [editProduct, setEditProduct] = useState<any>(null)
  const [editName, setEditName] = useState('')
  const [editBrand, setEditBrand] = useState('')
  const [editVehicle, setEditVehicle] = useState('')
  const [editBuy, setEditBuy] = useState('')
  const [editSell, setEditSell] = useState('')
  const [editMinimum, setEditMinimum] = useState('')
  const [editSupplier, setEditSupplier] = useState('')
  const [editShelf, setEditShelf] = useState('')

  async function loadProducts() {
    const { data } = await supabase
      .from('Products')
      .select('*')
      .order('id', { ascending: false })

    setProducts(data || [])
  }

  useEffect(() => {
    loadProducts()
  }, [])

  async function stockIn(product: any) {
    const qty = Number(prompt('Kitna stock add karna hai?'))

    if (!qty || qty <= 0) return

    const { error } = await supabase.from('stock_movements').insert({
      product_id: product.id,
      quantity: qty,
      movement_type: 'IN',
      note: 'Stock added',
    })

    if (error) {
      alert('Error: ' + error.message)
      return
    }

    alert('Stock updated successfully')
    loadProducts()
  }

  async function saveEdit() {
    if (!editProduct) return

    const { error } = await supabase
      .from('Products')
      .update({
        product_name: editName,
        brand: editBrand,
        compatible_vehicles: editVehicle,
        purchase_price: Number(editBuy || 0),
        our_price: Number(editSell || 0),
        minimum_stock: Number(editMinimum || 0),
        supplier: editSupplier,
        rack_location: editShelf,
      })
      .eq('id', editProduct.id)

    if (error) {
      alert('Error: ' + error.message)
      return
    }

    alert('Product updated successfully')
    setEditProduct(null)
    loadProducts()
  }

  async function stockOut(product: any) {
    const qty = Number(prompt('Kitna stock nikalna hai?'))

    if (!qty || qty <= 0) return

    if (qty > Number(product.stock)) {
      alert('Stock is not enough')
      return
    }

    const { error } = await supabase.from('stock_movements').insert({
      product_id: product.id,
      quantity: qty,
      movement_type: 'OUT',
      note: 'Stock removed',
    })

    if (error) {
      alert('Error: ' + error.message)
      return
    }

    alert('Stock updated successfully')
    loadProducts()
  }

  const filtered = products.filter((p) =>
    `${p.part_number} ${p.product_name} ${p.compatible_vehicles} ${p.brand} ${p.supplier}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  async function deleteProduct(id: number) {
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete this product? Its stock history will also be deleted.'
    )

    if (!confirmed) return

    const { error } = await supabase
      .from('Products')
      .delete()
      .eq('id', id)

    if (error) {
      alert(`Delete failed: ${error.message}`)
      return
    }

    alert('Product deleted successfully.')
    window.location.reload()
  }

  return (
    <main className='min-h-screen bg-gray-50 p-6'>
      <div className='mx-auto max-w-6xl'>
        <h1 className='text-3xl font-bold'>Products</h1>

        <input
          className='mt-6 w-full rounded-xl border bg-white p-4'
          placeholder='Search part number, name, vehicle, brand, supplier...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className='mt-6 space-y-4'>
          {filtered.map((p) => (
            <div key={p.id} className='rounded-2xl bg-white p-5 shadow'>
              <div className='flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
                <div>
                  <p className='font-bold'>
                    {p.part_number} — {p.product_name}
                  </p>

                  <p className='mt-1 text-sm text-gray-500'>
                    {p.compatible_vehicles || 'Vehicle not set'} · {p.brand || 'Brand not set'} · Stock: {p.stock}
                  </p>

                  <p className='mt-2 text-sm'>
                  </p>

                  <p className='mt-1 text-sm text-gray-500'>
                    Supplier: {p.supplier || 'Not set'} · Shelf: {p.rack_location || 'Not set'}
                  </p>
              <p className="mt-1 text-sm text-gray-600">
                Purchase: ₹{p.purchase_price || 0} · Selling: ₹{p.our_price || 0}
              </p>
                </div>

                <div className='flex flex-wrap gap-2'>
                  <button
                    onClick={() => stockIn(p)}
                    className='rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white'
                  >
                    + Stock In
                  </button>

                  <button
                    onClick={() => stockOut(p)}
                    className='rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white'
                  >
                    − Stock Out
                  </button>

                  <button
                    onClick={() => {
                      setEditProduct(p)
                      setEditName(p.product_name || '')
                      setEditBrand(p.brand || '')
                      setEditVehicle(p.compatible_vehicles || '')
                      setEditBuy(String(p.purchase_price || ''))
                      setEditSell(String(p.our_price || ''))
                      setEditMinimum(String(p.minimum_stock || ''))
                      setEditSupplier(p.supplier || '')
                      setEditShelf(p.rack_location || '')
                    }}
                    className='rounded-lg border px-3 py-2 text-sm font-semibold'
                  >
                    Edit
                  </button>

                  <button onClick={() => deleteProduct(p.id)} className='rounded-lg border px-3 py-2 text-sm font-semibold text-red-600'>Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className='rounded-2xl bg-white p-8 text-center text-gray-500'>
              No products found.
            </div>
          )}
        </div>
      </div>

      {editProduct && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/50 p-5'>
          <div className='max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6'>
            <h2 className='text-2xl font-bold'>Edit Product</h2>

            <input className='mt-4 w-full rounded-lg border p-3' placeholder='Part Name'
              value={editName} onChange={(e) => setEditName(e.target.value)} />

            <input className='mt-3 w-full rounded-lg border p-3' placeholder='Brand'
              value={editBrand} onChange={(e) => setEditBrand(e.target.value)} />

            <input className='mt-3 w-full rounded-lg border p-3' placeholder='Vehicle'
              value={editVehicle} onChange={(e) => setEditVehicle(e.target.value)} />

            <input className='mt-3 w-full rounded-lg border p-3' placeholder='Purchase Price'
              type='number' value={editBuy} onChange={(e) => setEditBuy(e.target.value)} />

            <input className='mt-3 w-full rounded-lg border p-3' placeholder='Selling Price'
              type='number' value={editSell} onChange={(e) => setEditSell(e.target.value)} />

            <input className='mt-3 w-full rounded-lg border p-3' placeholder='Minimum Stock'
              type='number' value={editMinimum} onChange={(e) => setEditMinimum(e.target.value)} />

            <input className='mt-3 w-full rounded-lg border p-3' placeholder='Supplier'
              value={editSupplier} onChange={(e) => setEditSupplier(e.target.value)} />

            <input className='mt-3 w-full rounded-lg border p-3' placeholder='Shelf'
              value={editShelf} onChange={(e) => setEditShelf(e.target.value)} />

            <div className='mt-5 flex gap-3'>
              <button onClick={() => setEditProduct(null)}
                className='flex-1 rounded-lg border p-3 font-semibold'>
                Cancel
              </button>

              <button onClick={saveEdit}
                className='flex-1 rounded-lg bg-black p-3 font-semibold text-white'>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  )
}
