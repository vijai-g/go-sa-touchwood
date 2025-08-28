export const currency = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));