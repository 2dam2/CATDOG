import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./PostForm.module.css";

import { createPost } from "../api/postApi";
import { fetchBoardDetail, updateBoard } from "../api/boardApi";
import { fetchMe } from "../api/authApi";

export default function AdminPostForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [boardType, setBoardType] = useState("이벤트");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [attachment, setAttachment] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [writer, setWriter] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ 1) 토큰 존재 체크 + 내 정보 + 관리자 권한 체크
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    (async () => {
      try {
        const me = await fetchMe();

        // 관리자 판정 (너희 백 구조에 맞춰 둘 다 체크)
        const isAdmin = me?.role === "admin" || me?.user_id === "admin";
        if (!isAdmin) {
          alert("관리자만 접근 가능합니다.");
          navigate("/");
          return;
        }

        setWriter(me?.nickname || "");
        setEmail(me?.email || "");
      } catch (err) {
        // 원본처럼: 로그인 확인 실패 시 토큰 제거 + 로그인 이동
        alert("로그인 정보 확인에 실패했습니다.");
        localStorage.removeItem("accessToken");
        navigate("/login");
      }
    })();
  }, [navigate]);

  // ✅ 2) 수정 모드면 기존 글 로드
  useEffect(() => {
    if (!id) return;

    (async () => {
      setLoading(true);
      try {
        const data = await fetchBoardDetail(id);
        setTitle(data?.title ?? "");
        setContent(data?.content ?? "");
        setBoardType(data?.category ?? "이벤트");
        setStartDate(data?.start_date ?? "");
        setEndDate(data?.end_date ?? "");
      } catch (err) {
        console.error(err);
        alert("게시글 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // ✅ 등록/수정
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    // 이벤트면 날짜 필수 (추가)
    if (boardType === "이벤트" && (!startDate || !endDate)) {
      alert("이벤트 기간을 입력해주세요.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("boardType", boardType);

      if (boardType === "이벤트") {
        formData.append("start_date", startDate);
        formData.append("end_date", endDate);
      }

      if (attachment) formData.append("attachment", attachment);

      if (id) {
        await updateBoard(id, formData);
        alert("게시글이 수정되었습니다.");
      } else {
        await createPost(formData);
        alert("게시글이 등록되었습니다.");
      }

      navigate(boardType === "이벤트" ? "/events" : "/Noticeboard");
    } catch (err) {
      alert(id ? "수정에 실패했습니다." : "등록에 실패했습니다.");
      console.error(err);
    }
  };

  if (loading) return <div style={{ padding: "100px", textAlign: "center" }}>로딩 중...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.notice}>
        {id ? "관리자 게시글 수정 페이지입니다." : "관리자 게시글 작성 페이지입니다."}
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <label>게시판</label>
          <select value={boardType} onChange={(e) => setBoardType(e.target.value)} disabled={!!id}>
            <option value="이벤트">이벤트</option>
            <option value="공지사항">공지사항</option>
            <option value="문의사항">문의사항</option>
          </select>
        </div>

        {boardType === "이벤트" && (
          <div className={styles.row}>
            <label>이벤트 기간</label>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
              <span>~</span>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
            </div>
          </div>
        )}

        <div className={styles.row}>
          <label>제목</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div className={styles.row}>
          <label>작성자</label>
          <input value={writer} disabled />
        </div>

        <div className={styles.row}>
          <label>이메일</label>
          <input value={email} disabled />
        </div>

        <div className={styles.editor}>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
        </div>

        <div className={styles.row}>
          <label>{id ? "썸네일 변경" : "파일 첨부"}</label>
          <input type="file" onChange={(e) => setAttachment(e.target.files?.[0] ?? null)} />
        </div>

        <div className={styles.actions}>
          <button type="submit">{id ? "수정하기" : "등록하기"}</button>
          <button type="button" onClick={() => navigate(-1)}>취소</button>
        </div>
      </form>
    </div>
  );
}
