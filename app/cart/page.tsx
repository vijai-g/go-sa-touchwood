'use client'
import { useEffect, useState } from 'react'
export default function CartPage(){
  const [cart, setCart] = useState<any[]>([])
  useEffect(()=> setCart(JSON.parse(localStorage.getItem('cart')||'[]')),[])
  const total = cart.reduce((s,c)=>s + (c.price*c.qty),0)
  return (<div>
    <h2>Cart</h2>
    {cart.length===0 ? <p>Cart empty</p> : <>
      <ul>
        {cart.map(item=> <li key={item.id}>{item.name} x {item.qty} - ₹{item.price*item.qty}</li>)}
      </ul>
      <div>Total: ₹{total}</div>
      <a href="/checkout"><button>Checkout</button></a>
    </>}
  </div>)
}
