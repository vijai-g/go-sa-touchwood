'use client'
import { useEffect, useState } from 'react'

type Product = { id:string, name:string, description:string, price:number, image:string, available:boolean }
export default function Shop(){
  const [products, setProducts] = useState<Product[]>([])
  useEffect(()=>{ fetch('/api/products').then(r=>r.json()).then(setProducts) },[])
  return (<div>
    <h2>Shop</h2>
    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:16}}>
      {products.map(p=>(
        <div key={p.id} style={{border:'1px solid #eee', padding:12, borderRadius:8}}>
          <img src={p.image} alt={p.name} style={{width:'100%', height:140, objectFit:'cover'}}/>
          <h3>{p.name}</h3>
          <p>{p.description}</p>
          <div>₹{p.price}</div>
          <button onClick={()=>{
            const cart = JSON.parse(localStorage.getItem('cart')||'[]');
            const idx = cart.findIndex((x:any)=>x.id===p.id);
            if(idx>-1) cart[idx].qty+=1; else cart.push({...p, qty:1});
            localStorage.setItem('cart', JSON.stringify(cart));
            alert('Added to cart');
          }}>Add to cart</button>
        </div>
      ))}
    </div>
  </div>)
}
