import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./NoticeDetail.module.css";

const STORAGE_KEY = "notice_posts";

export default function NoticeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const viewIncreased = useRef(false);

  const [post, setPost] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const index = data.findIndex((p) => p.id === Number(id));
    if (index === -1) return;

    if (!viewIncreased.current) {
      data[index].view += 1;
      viewIncreased.current = true;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    setPost(data[index]);
  }, [id]);

  const handleDelete = () => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const filtered = data.filter((p) => p.id !== Number(id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    navigate("/Noticeboard");
  };

  if (!post) return null;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h2 className={styles.title}>{post.title}</h2>

        <div className={styles.info}>
          <span>작성자: {post.writer}</span>
          <span>작성일: {post.date}</span>
          <span>조회수: {post.view}</span>
        </div>

        {/* 🔥 내용 박스 */}
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

        <div className={styles.buttons}>
          <button onClick={() => navigate(`/Noticeboard/edit/${post.id}`)}>
            수정
          </button>
          <button onClick={handleDelete}>삭제</button>
          <button onClick={() => navigate("/Noticeboard")}>목록</button>
        </div>
      </div>
    </div>
  );
}
