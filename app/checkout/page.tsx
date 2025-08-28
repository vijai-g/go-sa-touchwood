'use client'
import { useState } from 'react'
export default function Checkout(){
  const [name,setName]=useState(''); const [phone,setPhone]=useState(''); const [address,setAddress]=useState('')
  const handle = async ()=>{
    const cart = JSON.parse(localStorage.getItem('cart')||'[]')
    if(cart.length===0){ alert('Cart empty'); return; }
    const res = await fetch('/api/orders', {method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ customerName:name, customerPhone:phone, customerAddress:address, items:cart })})
    const data = await res.json()
    if(data.ok){ localStorage.removeItem('cart'); window.location.href='/order-success?orderId='+data.orderId }
    else alert('Failed')
  }
  return (<div>
    <h2>Checkout</h2>
    <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)}/><br/>
    <input placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)}/><br/>
    <textarea placeholder="Address" value={address} onChange={e=>setAddress(e.target.value)}></textarea><br/>
    <button onClick={handle}>Place Order (test)</button>
  </div>)
}
