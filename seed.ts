import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

const usersFile = path.join(dataDir, 'users.json');
const productsFile = path.join(dataDir, 'products.json');
const ordersFile = path.join(dataDir, 'orders.json');

const defaultUsers = [{}];

const defaultProducts = [{}];

const defaultOrders: any[] = [];

if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, JSON.stringify(defaultUsers, null, 2));
if (!fs.existsSync(productsFile)) fs.writeFileSync(productsFile, JSON.stringify(defaultProducts, null, 2));
if (!fs.existsSync(ordersFile)) fs.writeFileSync(ordersFile, JSON.stringify(defaultOrders, null, 2));

console.log('✅ Seed data created in /data');