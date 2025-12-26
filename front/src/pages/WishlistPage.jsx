import React, { useState, useEffect } from "react";
import styles from "./WishlistPage.module.css";
import axios from "axios";

/**
 * WishlistPage
 * - Handles both member (Server API) and non-member (LocalStorage) data.
 * - Implements client-side search and sort.
 */

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("latest"); // 'latest', 'name'
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 1. Load Data on Mount
  useEffect(() => {
    const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
    
    if (token) {
      setIsLoggedIn(true);
      fetchServerWishlist(token);
    } else {
      setIsLoggedIn(false);
      loadLocalWishlist();
    }
  }, []);

  const fetchServerWishlist = async (token) => {
    try {
      // API 호출 (백엔드: localhost:5000 가정, proxy 설정 되어있으면 /api/... 만 써도 됨)
      // Flask strict_slashes=True 대응을 위해 끝에 / 추가
      const response = await axios.get("/api/wishlist/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlistItems(response.data);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
      // 토큰 만료 등의 경우 처리 필요 (로그아웃 등)
    }
  };

  const loadLocalWishlist = () => {
    const localData = localStorage.getItem("tempWishlist");
    if (localData) {
      try {
        setWishlistItems(JSON.parse(localData));
      } catch (e) {
        console.error("Error parsing local wishlist", e);
        setWishlistItems([]);
      }
    } else {
      // 임시 더미 데이터 (테스트용, 실제 배포시 제거 가능)
      const dummy = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        title: `임시 찜 상품 ${i + 1}`,
        price: (i + 1) * 1000,
        imgUrl: "",
        wished_at: new Date().toISOString()
      }));
      setWishlistItems(dummy);
    }
  };

  // 2. Search & Sort Logic
  const getFilteredItems = () => {
    let items = [...wishlistItems];

    // Search
    if (searchQuery) {
      items = items.filter((item) =>
        item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    if (sortOrder === "name") {
      items.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else if (sortOrder === "latest") {
      // wished_at이 있으면 그걸로, 없으면 id 역순(최신 등록 가정)
      items.sort((a, b) => {
        const dateA = new Date(a.wished_at || 0);
        const dateB = new Date(b.wished_at || 0);
        return dateB - dateA; // 내림차순
      });
    }

    return items;
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "latest" ? "name" : "latest"));
  };

  const filteredItems = getFilteredItems();

  return (
    <div className={styles.page}>
      <div className={styles.pageInner}>
        <div className={styles.topSpacer} />

        <section className={styles.bodyWrap}>
          <div className={styles.bodyRow}>
            {/* Left Sidebar */}
            <aside className={styles.sidebar}>
              <div className={styles.sidebarTitle}>마이페이지</div>
              <div className={styles.sidebarMenu}>
                <div className={styles.sidebarCategory}>쇼핑 정보</div>
                <div className={styles.sidebarSubItem}>주문목록</div>
                <div className={styles.sidebarSubItem}>취소/반품내역</div>
                <div className={styles.sidebarSubItem}>찜리스트</div>

                <div className={styles.sidebarCategory}>회원정보</div>
                <div className={styles.sidebarSubItem}>회원정보변경</div>
                <div className={styles.sidebarSubItem}>회원탈퇴</div>

                <div className={styles.sidebarCategory} style={{ marginTop: "25px" }}>
                  나의 상품문의
                </div>
                <div className={styles.sidebarCategory}>나의 상품후기</div>
              </div>
            </aside>

            {/* Right Main */}
            <main className={styles.main}>
              <div className={styles.mainTitle}>
                {isLoggedIn ? "회원" : "비회원"}님의 찜 목록
              </div>

              <div className={styles.toolbar}>
                <input
                  type="text"
                  className={styles.searchInList}
                  placeholder="찜목록 안에서 검색"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <button className={styles.sortBtn} onClick={toggleSort}>
                  {sortOrder === "latest" ? "최신순" : "이름순"}
                </button>
              </div>

              <div className={styles.listArea}>
                {filteredItems.length > 0 ? (
                  filteredItems.map((it) => (
                    <div key={it.id} className={styles.listItem}>
                      {/* 이미지 등 상세 정보 렌더링 가능 */}
                      <span style={{fontWeight: 'bold', marginRight: '10px'}}>
                        [{it.category || '상품'}]
                      </span>
                      {it.title} 
                      <span style={{marginLeft: 'auto', fontSize: '0.9rem', color: '#888'}}>
                        {it.price ? `${it.price.toLocaleString()}원` : ''}
                      </span>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: "center", padding: "20px", color: "#999" }}>
                    검색 결과가 없습니다.
                  </div>
                )}
              </div>
            </main>
          </div>
        </section>

        <div className={styles.bottomSpacer} />
      </div>
    </div>
  );
}

// ==============================================================================
// [Gemini 작업 로그] - 2025.12.26
// 1. 페이지 생성: 마이페이지 레이아웃 + 찜 목록 기능
// 2. 주요 기능:
//    - 사이드바 메뉴 (쇼핑정보, 회원정보 계층화)
//    - Axios API 연동 (회원: /api/wishlist/)
//    - LocalStorage 연동 (비회원: tempWishlist)
//    - 클라이언트 검색 및 정렬 (이름순/최신순) 구현
// ==============================================================================