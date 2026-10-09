export type CartItem = {
  id: number
  product_name: string
  part_number: string
  brand: string
  compatible_vehicles: string
  our_price: number
  image_url: string
  online_delivery_available: boolean
  quantity: number
}

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return []

  return JSON.parse(
    localStorage.getItem('partmitra_cart') || '[]'
  )
}

export function saveCart(cart: CartItem[]) {
  localStorage.setItem(
    'partmitra_cart',
    JSON.stringify(cart)
  )
}
