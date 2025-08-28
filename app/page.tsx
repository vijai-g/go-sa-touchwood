import Link from 'next/link'
export default function Home(){
  return (
    <div>
      <h1 style={{fontSize:32}}>go sa touchwood</h1>
      <p>Handcrafted wooden furniture & decor.</p>
      <Link href='/shop'><button style={{marginTop:12}}>Shop Now</button></Link>
    </div>
  )
}
