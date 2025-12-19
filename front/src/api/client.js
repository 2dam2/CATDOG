import axios from "axios";

//axios 가 어디로 향할지 정하는 api 
const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000", // env파일에 링크가있으면 그곳으로 향하고 없으면 http://127.0.0.1:5000여기로 가라는 코드
  withCredentials: true, // withCredentials는 axios요청에 쿠키/인증정보를 같이 보내도 된다고 브라우저에 허용하는 코드 
                         // 쿠키기반으로 상품정보를 저장해둬야하는 페이지 때문에 .false로 하면안됨
  timeout: 10000,         // 요청이 10초 넘으면 끊어버림 (무한 대기 방지)
});

/**
 * 요청 인터셉터: 요청 보내기 "직전"에 공통 작업
 * 예) 토큰이 있으면 Authorization 헤더 붙이기
 */
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); //localStorage 현재 상태를 저장해두는곳 localStorage가있으면 껏다키든 새로고침을 하던 유지
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // 왜 Bearer? "이 토큰은 Bearer 방식이야" 라고 서버에 알려주는 관례
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * 응답 인터셉터: 응답 받기 "직후"에 공통 처리
 * 예) 에러 메시지 정리해서 던지기
 */
client.interceptors.response.use(
  (response) => response,
  (error) => {
    // 서버가 응답을 준 에러(400/401/500 등)
    if (error.response) {
      const { status, data } = error.response;
      return Promise.reject({
        status,
        message: data?.message || "요청 처리 중 오류가 발생했습니다.",
        data,
      });
    }

    // 서버 응답 자체가 없던 에러(네트워크/서버 다운/CORS 등)
    return Promise.reject({
      status: null,
      message: "네트워크 오류 또는 서버 응답 없음",
      data: null,
    });
  }
);

export default client;
