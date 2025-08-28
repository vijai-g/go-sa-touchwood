import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
export default function handler(req: NextApiRequest, res: NextApiResponse){
  const ordersFile = path.join(process.cwd(),'data','orders.json')
  if (req.method === 'POST') {
    const body = req.body
    const orderId = 'o' + Date.now()
    const newOrder = { orderId, ...body, subtotal: body.items.reduce((s:any,i:any)=>s+i.price*i.qty,0), total: body.items.reduce((s:any,i:any)=>s+i.price*i.qty,0), status:'Pending', createdAt: new Date().toISOString() }
    const orders = fs.existsSync(ordersFile) ? JSON.parse(fs.readFileSync(ordersFile,'utf8')) : []
    orders.push(newOrder)
    fs.writeFileSync(ordersFile, JSON.stringify(orders,null,2))
    return res.status(200).json({ ok:true, orderId })
  }
  const orders = fs.existsSync(ordersFile) ? JSON.parse(fs.readFileSync(ordersFile,'utf8')) : []
  res.status(200).json(orders)
}
