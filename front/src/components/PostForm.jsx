import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PostForm.module.css";

const STORAGE_KEY = "notice_posts";

export default function PostForm() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [attachment, setAttachment] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const savedPosts =
      JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    const today = new Date().toISOString().slice(0, 10);

    const newPost = {
      id: Date.now(),          // 고유 id
      title,
      content,
      writer: "관리자",
      date: today,
      view: 0,
      attachmentName: attachment ? attachment.name : null,
    };

    // 🔥 새 글을 항상 맨 위에 추가
    const updatedPosts = [newPost, ...savedPosts];

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedPosts)
    );

    // 🔥 등록 후 Noticeboard로 이동
    navigate("/Noticeboard");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>새 게시글 작성</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label>제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label>내용</label>
          <textarea
            rows="10"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label>첨부파일</label>
          <input
            type="file"
            onChange={(e) => setAttachment(e.target.files[0])}
          />
        </div>

        {/* 버튼 텍스트는 '등록' 고정 */}
        <button type="submit" className={styles.submitButton}>
          등록하기
        </button>
      </form>
    </div>
  );
}
