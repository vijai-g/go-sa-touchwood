import fs from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(),'data')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir)

const usersFile = path.join(dataDir,'users.json')
const productsFile = path.join(dataDir,'products.json')
const ordersFile = path.join(dataDir,'orders.json')

const defaultUsers = [{ userId: '1', email: 'admin@gosatouchwood.com', passwordHash: '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36hb7p0URRZ5EixZaYVK1f', role: 'admin' }]
const defaultProducts = [
  { id: 'p1', name: 'Classic Wooden Chair', description: 'Handcrafted wooden chair with natural polish', price: 3500, image: '/images/chair.jpg', category: 'furniture', tags: ['wood','chair','handmade'], available: true },
  { id: 'p2', name: 'Dining Table Set', description: 'Solid wood dining table with 4 chairs', price: 12000, image: '/images/table.jpg', category: 'furniture', tags: ['wood','table','set'], available: true }
]
const defaultOrders:any[] = []

if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, JSON.stringify(defaultUsers,null,2))
if (!fs.existsSync(productsFile)) fs.writeFileSync(productsFile, JSON.stringify(defaultProducts,null,2))
if (!fs.existsSync(ordersFile)) fs.writeFileSync(ordersFile, JSON.stringify(defaultOrders,null,2))
console.log('✅ Seed data created in /data')
