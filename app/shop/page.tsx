import fs from 'fs';
import path from 'path';

type Product = { id: string, name: string, price: number, image: string };

async function getProducts(): Promise<Product[]> {
  const filePath = path.join(process.cwd(), 'data', 'products.json');
  const data = await fs.promises.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

export default async function Shop() {
  const products = await getProducts();
  return (
    <div>
      <h2 className="text-2xl font-bold">Shop</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {products.map((p) => (
          <div key={p.id} className="border p-4 rounded shadow">
            <img src={p.image} alt={p.name} className="w-full h-40 object-cover"/>
            <h3 className="text-lg font-bold">{p.name}</h3>
            <p>${p.price}</p>
            <button className="bg-yellow-400 px-3 py-1 rounded mt-2">Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}