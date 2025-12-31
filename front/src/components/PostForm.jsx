import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PostForm.module.css";

// 📌 localStorage에 저장될 게시글 목록 키
const STORAGE_KEY = "notice_posts";

export default function PostForm() {
  // 📌 페이지 이동을 위한 navigate 함수
  const navigate = useNavigate();

  // 📌 제목 입력값 상태
  const [title, setTitle] = useState("");

  // 📌 내용 입력값 상태
  const [content, setContent] = useState("");

  // 📌 첨부파일 상태 (파일 객체 저장)
  const [attachment, setAttachment] = useState(null);

  /**
   * 📌 게시글 등록 처리 함수
   * - form 제출 시 실행
   * - 기본 submit 동작(페이지 새로고침) 방지
   * - localStorage에 새 게시글 저장
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // 📌 기존 게시글 목록 불러오기
    const savedPosts =
      JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    // 📌 오늘 날짜를 YYYY-MM-DD 형식으로 생성
    const today = new Date().toISOString().slice(0, 10);

    // 📌 새 게시글 객체 생성
    const newPost = {
      id: Date.now(),          // 고유 id (타임스탬프 사용)
      title,                  // 게시글 제목
      content,                // 게시글 내용
      writer: "관리자",        // 작성자 (고정)
      date: today,            // 작성일
      view: 0,                // 조회수 초기값
      attachmentName: attachment ? attachment.name : null, // 첨부파일 이름
    };

    /**
     * 📌 새 글을 목록 맨 앞에 추가
     * - 최신 글이 항상 위에 보이도록 처리
     */
    const updatedPosts = [newPost, ...savedPosts];

    // 📌 localStorage에 저장
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedPosts)
    );

    // 📌 등록 완료 후 게시판 목록 페이지로 이동
    navigate("/Noticeboard");
  };

  return (
    <div className={styles.container}>
      {/* 📌 페이지 제목 */}
      <h2 className={styles.title}>새 게시글 작성</h2>

      {/* 📌 게시글 작성 폼 */}
      <form className={styles.form} onSubmit={handleSubmit}>
        {/* 📌 제목 입력 영역 */}
        <div className={styles.field}>
          <label>제목</label>
          <input
            type="text"
            value={title} // 상태값과 연결
            onChange={(e) => setTitle(e.target.value)} // 입력 시 상태 변경
            required // 빈 값 제출 방지
          />
        </div>

        {/* 📌 내용 입력 영역 */}
        <div className={styles.field}>
          <label>내용</label>
          <textarea
            rows="10"
            value={content} // 상태값과 연결
            onChange={(e) => setContent(e.target.value)} // 입력 시 상태 변경
            required // 빈 값 제출 방지
          />
        </div>

        {/* 📌 첨부파일 선택 영역 */}
        <div className={styles.field}>
          <label>첨부파일</label>
          <input
            type="file"
            onChange={(e) => setAttachment(e.target.files[0])} // 선택한 파일 저장
          />
        </div>

        {/* 📌 게시글 등록 버튼 */}
        <button type="submit" className={styles.submitButton}>
          등록하기
        </button>
      </form>
    </div>
  );
}
