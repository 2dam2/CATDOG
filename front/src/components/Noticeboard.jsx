import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Noticeboard.module.css";


export default function Noticeboard() {
  const navigate = useNavigate();

  const [list, setList] = useState(
    Array.from({ length: 10 }).map((_, i) => ({
      id: i + 1,
      title: "공지사항입니다",
      writer: "관리자",
      date: "2025-12-26",
      view: 0,
    }))
  );

  const [keyword, setKeyword] = useState("");
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const filteredList = list.filter((item) =>
    item.title.includes(keyword.trim())
  );

  const handleWrite = () => {
    if (!newTitle.trim()) return;

    const today = new Date().toISOString().slice(0, 10);

    setList([
      {
        id: list.length + 1,
        title: newTitle,
        writer: "관리자",
        date: today,
        view: 0,
      },
      ...list,
    ]);

    setNewTitle("");
    setIsWriteOpen(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.noticeBoard}>

        <div className={styles.searchArea}>
          <input
            className={styles.searchInput}
            placeholder="검색"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button className={styles.searchButton}>검색</button>
        </div>

        <div className={styles.titleArea}>
          <h2 className={styles.title}>게시판</h2>
          <button
            className={styles.writeButton}
            onClick={() => navigate("/write")}
          >
            글쓰기
          </button>
        </div>

        <div className={styles.filterArea}>
          조회 기간 :
          <span>오늘</span> /
          <span>일주일</span> /
          <span>한달</span> /
          <span>3개월</span> /
          <span>날짜지정</span>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>작성자</th>
                <th>작성일</th>
                <th>조회수</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length > 0 ? (
                filteredList.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.title}</td>
                    <td>{item.writer}</td>
                    <td>{item.date}</td>
                    <td>{item.view}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                    검색 결과가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.pagination}>
          1 2 3 4 5 6 7 8 9 10 &gt;&gt;
        </div>

      </div>
    </div>
  );
}
