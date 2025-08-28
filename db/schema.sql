create table if not exists users (
  user_id text primary key,
  email text unique not null,
  password_hash text not null,
  role text not null check (role in ('admin','customer'))
);

create table if not exists products (
  id text primary key,
  name text not null,
  description text not null,
  price integer not null,
  image text not null,
  category text not null,
  tags text[] not null default '{}',
  available boolean not null default true
);

create table if not exists orders (
  order_id text primary key,
  customer_id text not null,
  customer_name text not null,
  customer_phone text not null,
  customer_address text not null,
  items jsonb not null,
  subtotal integer not null,
  total integer not null,
  status text not null check (status in ('pending','paid','shipped','cancelled')) default 'pending',
  created_at timestamptz not null default now()
);

insert into users (user_id,email,password_hash,role) values
('1','admin@gosatouchwood.com','$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36hb7p0URRZ5EixZaYVK1f','admin')
on conflict (email) do nothing;

insert into products (id,name,description,price,image,category,tags,available) values
('p1','Classic Wooden Chair','Handcrafted wooden chair with natural polish',3500,'/images/chair.jpg','furniture',array['wood','chair','handmade'],true),
('p2','Dining Table Set','Solid wood dining table with 4 chairs',12000,'/images/table.jpg','furniture',array['wood','table','set'],true)
on conflict (id) do nothing;