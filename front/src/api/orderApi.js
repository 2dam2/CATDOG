// src/api/ordersApi.js
import client from "./client";

export async function getOrders() {
  const res = await client.get("/api/orders");
  return res.data;
}

/**
 * 주문 생성
 * items: [{ product_id, qty }]
 */
export async function createOrder(items) {
  const res = await client.post("/api/orders", { items });
  return res.data; // { order_id: number }
}
