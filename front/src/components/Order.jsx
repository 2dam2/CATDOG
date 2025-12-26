import React from "react";
import styles from "./Order.module.css";

const Order = () => {
  return (
    <div className={styles.page}>
      <div className={styles.orderWrap}>

        <div className={styles.orderTitle}>주문 / 결제</div>

        {/* 주문 정보 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>주문 정보</div>
          <div className={styles.sectionBody}>
            <div className={styles.formRow}>
              <div className={styles.label}>주문자</div>
              <input className={styles.inputBox} />
            </div>
            <div className={styles.formRow}>
              <div className={styles.label}>이메일</div>
              <input className={styles.inputBox} />
            </div>
            <div className={styles.formRow}>
              <div className={styles.label}>휴대전화</div>
              <input className={styles.inputBox} />
            </div>
          </div>
        </section>

        {/* 배송지 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>배송지</div>
          <div className={styles.sectionBody}>
            <div className={styles.formRow}>
              <div className={styles.label}>받는사람</div>
              <input className={styles.inputBox} />
            </div>
            <div className={styles.formRow}>
              <div className={styles.label}>주소</div>
              <input className={styles.inputBoxSmall} />
            </div>
            <div className={styles.formRow}>
              <div className={styles.label}>휴대전화</div>
              <input className={styles.inputBox} />
            </div>
            <div className={styles.messageBox}>-- 메시지 선택 --</div>
          </div>
        </section>

        {/* 주문상품 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>주문상품</div>
          <div className={styles.sectionBody}>
            <div className={styles.productRow}>
              <div className={styles.productImage}></div>
              <div className={styles.productInfo}>
                슈퍼 스펀즈 트릿 스틱<br />
                옵션: 치킨<br />
                11,700원
              </div>
            </div>
            <div className={`${styles.priceRow} ${styles.productShipping}`}>
            <span>배송비</span>
            <span>3,000원</span>
            </div>
          </div>
        </section>

        {/* 결제 정보 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>결제정보</div>
          <div className={styles.sectionBody}>
            <div className={styles.priceRow}>
              <span>상품금액</span>
              <span>11,700원</span>
            </div>
            <div className={styles.priceRow}>
              <span>배송비</span>
              <span>3,000원</span>
            </div>
            <div className={styles.totalRow}>
              <span>최종 결제 금액</span>
              <span>14,700원</span>
            </div>
          </div>
        </section>

        {/* ✅ 결제수단 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>결제수단</div>
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

        <button className={styles.payButton}>
          14,700원 결제하기
        </button>

      </div>
    </div>
  );
};

export default Order;
