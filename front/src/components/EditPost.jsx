import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./EditPost.module.css";

const STORAGE_KEY = "notice_posts";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const post = data.find((p) => p.id === Number(id));
    if (post) {
      setTitle(post.title);
      setContent(post.content);
    }
  }, [id]);

  const handleSave = () => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    const updated = data.map((p) =>
      p.id === Number(id)
        ? { ...p, title, content }
        : p
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // 🔥 저장 후 노티스보드로 이동
    navigate("/Noticeboard");
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h2 className={styles.title}>게시글 수정</h2>

        <div className={styles.field}>
          <label>제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label>내용</label>
          <textarea
            rows="10"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className={styles.buttonArea}>
          <button onClick={handleSave}>저장</button>
          <button onClick={() => navigate(-1)}>취소</button>
        </div>
      </div>
    </div>
  );
}
