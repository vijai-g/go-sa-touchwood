import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import fs from 'fs'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const p = path.join(process.cwd(), 'data', 'products.json')
  if (!fs.existsSync(p)) return res.status(200).json([])
  const data = fs.readFileSync(p,'utf8')
  res.status(200).json(JSON.parse(data))
}
