import client from "./client";


// ✅ "내 정보 가져오기"
export async function getMyProfile() {
  const res = await client.get("/api/auth/me");
  return res.data;

  throw new Error("API 연결 필요");
}

// ✅ "내 정보 수정하기"
export async function updateMyProfile(payload) {
  const res = await client.put("/api/auth/me", payload);
  return res.data;

  throw new Error("API 연결 필요");
}

// ✅ "비밀번호 변경" (보통 프로필 수정 API랑 분리하는 게 안전)
export async function changePassword(payload) {
  const res = await client.post("/api/auth/me/password", payload);
  return res.data;

  throw new Error("API 연결 필요");
}
