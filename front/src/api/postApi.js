// src/api/postApi.js
import client from "./client";

// 게시글 생성 (파일 포함)
export async function createPost(formData) {
  const res = await client.post("/api/post", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// 게시글 수정
export function updatePost(id, payload) {
  return client.patch(`/api/post/${id}`, payload);
}

// 게시글 삭제
export function deletePost(id) {
  return client.delete(`/api/post/${id}`);
}