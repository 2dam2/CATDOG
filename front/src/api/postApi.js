import client from "./client";

// 파일 포함 가능하게 FormData로 전송
export async function createPost(formData) {
  const res = await client.post("/api/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

