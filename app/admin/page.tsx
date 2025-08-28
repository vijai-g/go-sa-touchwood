import fs from 'fs'
import path from 'path'
export default function Admin(){
  // NOTE: This page is not fully secured in the static scaffold.
  // When integrating NextAuth, protect this route server-side using middleware or session check.
  const productsPath = path.join(process.cwd(),'data','products.json')
  let products = []
  try{ products = JSON.parse(fs.readFileSync(productsPath,'utf8')) }catch(e){}
  return (<div>
    <h2>Admin Dashboard (stub)</h2>
    <p>Products count: {products.length}</p>
    <p>Implement server-side auth for production.</p>
  </div>)
}
