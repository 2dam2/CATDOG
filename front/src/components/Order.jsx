import React from "react";
import styles from "./Order.module.css";

/**
 * 주문 / 결제 페이지 컴포넌트
 * - 주문자 정보 입력
 * - 배송지 정보 입력
 * - 주문 상품 및 금액 확인
 * - 결제 수단 선택
 * - 결제 버튼 제공
 */
const Order = () => {
  return (
    /* 페이지 전체 영역 */
    <div className={styles.page}>
      {/* 주문/결제 카드 래퍼 */}
      <div className={styles.orderWrap}>

        {/* 페이지 제목 */}
        <div className={styles.orderTitle}>주문 / 결제</div>

        {/* ================= 주문 정보 영역 ================= */}
        <section className={styles.section}>
          {/* 섹션 헤더 */}
          <div className={styles.sectionHeader}>주문 정보</div>

          {/* 입력 폼 영역 */}
          <div className={styles.sectionBody}>
            {/* 주문자 이름 입력 */}
            <div className={styles.formRow}>
              <div className={styles.label}>주문자</div>
              <input className={styles.inputBox} />
            </div>

            {/* 이메일 입력 */}
            <div className={styles.formRow}>
              <div className={styles.label}>이메일</div>
              <input className={styles.inputBox} />
            </div>

            {/* 휴대전화 입력 */}
            <div className={styles.formRow}>
              <div className={styles.label}>휴대전화</div>
              <input className={styles.inputBox} />
            </div>
          </div>
        </section>

        {/* ================= 배송지 정보 영역 ================= */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>배송지</div>

          <div className={styles.sectionBody}>
            {/* 받는 사람 이름 */}
            <div className={styles.formRow}>
              <div className={styles.label}>받는사람</div>
              <input className={styles.inputBox} />
            </div>

            {/* 주소 입력 */}
            <div className={styles.formRow}>
              <div className={styles.label}>주소</div>
              <input className={styles.inputBoxSmall} />
            </div>

            {/* 연락처 입력 */}
            <div className={styles.formRow}>
              <div className={styles.label}>휴대전화</div>
              <input className={styles.inputBox} />
            </div>

            {/* 배송 메시지 선택 영역 (드롭다운 예정) */}
            <div className={styles.messageBox}>-- 메시지 선택 --</div>
          </div>
        </section>

        {/* ================= 주문 상품 정보 ================= */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>주문상품</div>

          <div className={styles.sectionBody}>
            {/* 상품 정보 행 */}
            <div className={styles.productRow}>
              {/* 상품 이미지 영역 */}
              <div className={styles.productImage}></div>

              {/* 상품 설명 영역 */}
              <div className={styles.productInfo}>
                슈퍼 스펀즈 트릿 스틱<br />
                옵션: 치킨<br />
                원
              </div>
            </div>

            {/* 배송비 표시 영역 */}
            <div className={`${styles.priceRow} ${styles.productShipping}`}>
              <span>배송비</span>
              <span>원</span>
            </div>
          </div>
        </section>

        {/* ================= 결제 금액 정보 ================= */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>결제정보</div>

          <div className={styles.sectionBody}>
            {/* 상품 금액 */}
            <div className={styles.priceRow}>
              <span>상품금액</span>
              <span>원</span>
            </div>

            {/* 배송비 */}
            <div className={styles.priceRow}>
              <span>배송비</span>
              <span>원</span>
            </div>

            {/* 최종 결제 금액 */}
            <div className={styles.totalRow}>
              <span>최종 결제 금액</span>
              <span>원</span>
            </div>
          </div>
        </section>

        {/* ================= 결제 수단 선택 ================= */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>결제수단</div>

          {/* 결제 방법 목록 (추후 버튼/라디오로 변경 가능) */}
          <div className={`${styles.sectionBody} ${styles.paymentMethods}`}>
            카드결제<br />
            실시간 계좌이체<br />
            가상계좌<br />
            휴대폰 결제<br />
            네이버페이<br />
            페이코<br />
            토스페이
          </div>
        </section>

        {/* ================= 결제 버튼 ================= */}
        {/* 실제 결제 로직은 onClick 이벤트로 연결 예정 */}
        <button className={styles.payButton}>
          결제하기
        </button>

      </div>
    </div>
  );
};

export default Order;
