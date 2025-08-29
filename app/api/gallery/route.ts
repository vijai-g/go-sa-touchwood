import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const dir = path.join(process.cwd(), 'public', 'images')
    const files = fs.readdirSync(dir)
      .filter(f => /\.(png|jpe?g|webp|svg|gif)$/i.test(f))
      .map(f => `/images/${f}`)
    return NextResponse.json({ files })
  } catch {
    return NextResponse.json({ files: [] })
  }
}
