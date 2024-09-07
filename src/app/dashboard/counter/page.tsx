import { Metadata } from 'next'
import { CartCounter } from '@/shopping-cart'

export const metadata: Metadata = {
  title: 'Shopping Cart',
  description: 'Your shopping cart',
}

export default function CounterPage() {
  return (
    <div className='flex flex-col items-center justify-center w-full h-full'>
      <span>Productos en el carrito</span>
      <CartCounter value={10} />
    </div>
  )
}