import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./EditPost.module.css";

// 📌 localStorage에 저장된 게시글 목록 키
const STORAGE_KEY = "notice_posts";

export default function EditPost() {
  // 📌 URL 파라미터에서 게시글 id 가져오기
  const { id } = useParams();

  // 📌 페이지 이동을 위한 navigate 함수
  const navigate = useNavigate();

  // 📌 수정할 게시글 제목 상태
  const [title, setTitle] = useState("");

  // 📌 수정할 게시글 내용 상태
  const [content, setContent] = useState("");

  /**
   * 📌 컴포넌트 마운트 시 실행
   * - localStorage에서 게시글 목록을 불러옴
   * - URL의 id와 일치하는 게시글을 찾아
   *   제목과 내용을 입력창에 세팅
   */
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    // id가 같은 게시글 찾기
    const post = data.find((p) => p.id === Number(id));

    // 게시글이 존재하면 상태에 반영
    if (post) {
      setTitle(post.title);
      setContent(post.content);
    }
  }, [id]);

  /**
   * 📌 저장 버튼 클릭 시 실행
   * - localStorage의 게시글 목록을 순회
   * - 수정 중인 게시글(id 일치)만 제목/내용 변경
   * - 변경된 목록을 다시 localStorage에 저장
   */
  const handleSave = () => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    // 수정된 게시글 배열 생성
    const updated = data.map((p) =>
      p.id === Number(id)
        ? { ...p, title, content } // 제목, 내용만 수정
        : p
    );

    // localStorage에 저장
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // 📌 저장 후 게시판 목록으로 이동
    navigate("/Noticeboard");
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* 📌 페이지 제목 */}
        <h2 className={styles.title}>게시글 수정</h2>

        {/* 📌 제목 입력 영역 */}
        <div className={styles.field}>
          <label>제목</label>
          <input
            type="text"
            value={title} // 상태값과 연결
            onChange={(e) => setTitle(e.target.value)} // 입력 시 상태 업데이트
          />
        </div>

        {/* 📌 내용 입력 영역 */}
        <div className={styles.field}>
          <label>내용</label>
          <textarea
            rows="10"
            value={content} // 상태값과 연결
            onChange={(e) => setContent(e.target.value)} // 입력 시 상태 업데이트
          />
        </div>

        {/* 📌 버튼 영역 */}
        <div className={styles.buttonArea}>
          {/* 저장 버튼 */}
          <button onClick={handleSave}>저장</button>

          {/* 취소 버튼 → 이전 페이지로 이동 */}
          <button onClick={() => navigate(-1)}>취소</button>
        </div>
      </div>
    </div>
  );
}
