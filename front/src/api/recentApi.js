import client from "./client";

export function addRecentView(productId) {
    return client.post("/api/recent/view", {productId});
}

export async function fetchRecent(){
    const res = await client.get("/api/recent");
    return res.data.items;
}

