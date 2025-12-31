import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./NoticeDetail.module.css";

// 📌 localStorage에 저장된 게시글 키
const STORAGE_KEY = "notice_posts";

export default function NoticeDetail() {
  // 📌 URL 파라미터에서 게시글 id 가져오기 (/Noticeboard/:id)
  const { id } = useParams();

  // 📌 페이지 이동을 위한 navigate 함수
  const navigate = useNavigate();

  // 📌 조회수 중복 증가 방지용 ref (렌더링과 무관)
  const viewIncreased = useRef(false);

  // 📌 현재 게시글 상태
  const [post, setPost] = useState(null);

  // 📌 컴포넌트 마운트 시 / id 변경 시 실행
  useEffect(() => {
    // localStorage에서 게시글 목록 가져오기
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    // 현재 id와 일치하는 게시글 찾기
    const index = data.findIndex((p) => p.id === Number(id));

    // 게시글이 없으면 종료
    if (index === -1) return;

    // 📌 조회수 증가 (한 번만)
    if (!viewIncreased.current) {
      data[index].view += 1; // 조회수 +1
      viewIncreased.current = true; // 중복 증가 방지
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    // 상태에 게시글 저장
    setPost(data[index]);
  }, [id]);

  // 📌 게시글 삭제 처리
  const handleDelete = () => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    // 현재 게시글을 제외한 목록 생성
    const filtered = data.filter((p) => p.id !== Number(id));

    // localStorage 갱신
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

    // 게시판 목록으로 이동
    navigate("/Noticeboard");
  };

  // 📌 게시글이 아직 로드되지 않았으면 아무것도 렌더링 안 함
  if (!post) return null;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* 📌 게시글 제목 */}
        <h2 className={styles.title}>{post.title}</h2>

        {/* 📌 게시글 정보 영역 */}
        <div className={styles.info}>
          <span>작성자: {post.writer}</span>
          <span>작성일: {post.date}</span>
          <span>조회수: {post.view}</span>
        </div>

        {/* 📌 게시글 내용 박스 */}
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "6px",
            padding: "20px",
            backgroundColor: "#fafafa",
            minHeight: "200px",
            marginBottom: "30px",
          }}
        >
          <div className={styles.content}>{post.content}</div>
        </div>

        {/* 📌 하단 버튼 영역 */}
        <div className={styles.buttons}>
          {/* 수정 페이지로 이동 */}
          <button onClick={() => navigate(`/Noticeboard/edit/${post.id}`)}>
            수정
          </button>

          {/* 게시글 삭제 */}
          <button onClick={handleDelete}>삭제</button>

          {/* 목록으로 이동 */}
          <button onClick={() => navigate("/Noticeboard")}>목록</button>
        </div>
      </div>
    </div>
  );
}
