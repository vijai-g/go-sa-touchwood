"use client";
import { useSearchParams } from "next/navigation";

export default function Success() {
  const sp = useSearchParams();
  const orderId = sp?.get("orderId") ?? "";

  return (
    <div>
      <h2>Order placed</h2>
      <p>Order ID: {orderId}</p>
    </div>
  );
}
