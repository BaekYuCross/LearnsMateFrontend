<template>
  <div class="clientvoc-app-container">
    <ClientHeader />
      <InactivityModal
        v-if="showActivityModal"
        :show="showActivityModal"
        @continue="closeActivityModal"
        @logout="activityLogout"
      />

    <!-- 강의 상세 섹션 -->
    <div class="lecture-detail-header">
      <div class="lecture-header-left">
        <span class="lecture-badge">Best</span>
        <p class="lecture-category">개발 &gt; 프로그래밍 / 앱 개발</p>
        <h1 class="lecture-title">안드로이드 앱 제작 배우기</h1>
        <p class="lecture-subtitle">
          비전공자 입장에서도 쉽게 이해할 수 있고, 실전에서 바로 적용 가능한 Android 입문 강의를 제작해보았습니다 :)
        </p>
        <div class="lecture-meta">
          <span>⭐ 4.6</span>
          <span>수강평 130개</span>  
          <span>수강생 190명</span>
        </div>
        <div class="lecture-author">
          <span> 👨‍🏫 &nbsp; Cho 조제온 👑</span>
        </div>
        <div class="lecture-tags">
          <span class="author-badge" style="font-size:20px;"> # </span>
          <span class="tag">Docker</span>
          <span class="tag">CI/CD</span>
          <span class="tag">Infra</span>
        </div>
      </div>
      <div class="lecture-header-right">
        <img :src="selectedCourse.image" alt="강의 대표 이미지" class="lecture-image" />
        <button class="lecture-preview-button">3개 무료 보기 ▶</button>
        <div class="lecture-highlight">신규 강의 오픈 깜짝 할인 중</div>
      </div>
    </div>

    <!-- 탭 메뉴 -->
    <div class="lecture-tabs">
  <button class="lecture-tab active">강의 소개</button>
  <button class="lecture-tab">커리큘럼</button>
  <button class="lecture-tab">
    수강평 <span class="lecture-tab-number">130</span>
  </button>
  <button class="lecture-tab">수강 전 문의</button>
  <button class="lecture-tab">댓글</button>
  <button class="lecture-tab">새소식</button>
</div>


    <!-- 강의 소개 및 가격 섹션 -->
    <div class="lecture-detail-body">
      <!-- 왼쪽 강의 소개 -->
      <div class="lecture-content">
        <h2>초급자를 위해 준비한</h2>
        <p><strong>[앱 개발 , Android]</strong> 강의입니다.</p>
        <div class="lecture-intro-section">
          <div class="lecture-intro-icon">
  <img src="@/assets/icons/doit.svg" alt="이런 걸 배워요" />
  <span>이런 걸 배워요!</span>
</div>
          <div class="lecture-intro-content">
            <ul>
  <li>모바일 애플리케이션 아키텍처 설계</li>
  <li>Android 및 iOS 개발 환경 구축</li>
  <li>UI/UX 디자인 및 구현</li>
  <li>React Native를 이용한 크로스플랫폼 앱 개발</li>
  <li>백엔드 API와의 통신 및 데이터 처리</li>
  <li>실시간 데이터 동기화를 위한 WebSocket 활용</li>
  <li>애플리케이션 보안 및 데이터 보호</li>
  <li>테스트 주도 개발(TDD)로 안정성 확보</li>
  <li>앱 배포 및 스토어 최적화</li>
</ul>
          </div>
        </div>
      </div>

      <!-- 우측 구매 섹션 -->
      <div class="lecture-purchase-section">
        <div class="lecture-highlight-wrapper">
        </div>
        <div class="lecture-price">
          <p class="lecture-discounted-price">{{ selectedCourse.discountedPrice }}</p>
          <div class="lecture-discount-wrapper">
            <span class="lecture-discount">30%</span>
            <span class="lecture-original-price">{{ selectedCourse.originalPrice }}</span>
          </div>
        </div>
        <button class="lecture-enroll-button">수강신청 하기</button>
        <button class="lecture-cart-button"   @click="goToCart">바구니에 담기</button>
        <div class="lecture-extra-info">
          <span>📂 강의 폴더</span>
          <span>❤️ 435</span>
          <span>📤 공유</span>
        </div>
        <div class="lecture-details">
          <p><strong>지식공유자 </strong> &nbsp;&nbsp;  Cho 조제온</p>
          <p><strong>수업 수 </strong> &nbsp;&nbsp;총 66개 (4시간 16분)</p>
          <p><strong>수강기한 </strong> &nbsp;&nbsp;무제한</p>
          <p><strong>수료증 </strong> &nbsp;&nbsp;제공</p>
          <p><strong>난이도 </strong> &nbsp;&nbsp;입문 · 초급 · 중급 이상</p>
        </div>
        <div class="lecture-footer">지식공유자 답변이 제공되는 강의입니다.</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ClientHeader from "@/components/client/ClientHeader.vue";
import Android from "@/assets/icons/Android.svg";
import { useRouter } from 'vue-router';
import InactivityModal from '@/components/client/InactivityModal.vue';
import { useActivityMonitor } from "@/composables/useActivityMonitor";

const { showActivityModal, closeActivityModal, activityLogout } = useActivityMonitor(30);
const router = useRouter();

// 페이지 이동 함수
const goToCart = () => {
  router.push('/client-lecturecart');
};

const selectedCourse = {
  image: Android,
  discountedPrice: "₩31,500",
  originalPrice: "₩45,000",
};
</script>


<style lang="scss" scoped>
.clientvoc-app-container  {
  font-family: "Arial", sans-serif;
  color: #333;

  /* 강의 상세 섹션 */
  .lecture-detail-header {
    display: flex;
    justify-content: space-between;
    background: #000;
    color: #fff;
    padding: 30px 20px;

    .lecture-header-left {
      flex: 0.7;
      padding-top: 10px;
      padding-left: 50px;

      .lecture-badge {
        display: inline-block;
        background-color: #ff477e;
        color: #fff;
        font-size: 12px;
        font-weight: bold;
        padding: 5px 10px;
        border-radius: 12px;
        margin-bottom: 10px;
      }

      .lecture-category {
        font-size: 14px;
        color: #bbb;
        margin-bottom: 8px;
      }

      .lecture-title {
        font-size: 28px;
        font-weight: bold;
        margin-bottom: 15px;
      }

      .lecture-subtitle {
        font-size: 16px;
        color: #bbb;
        line-height: 1.5;
        margin-bottom: 20px;
      }

      .lecture-meta {
        display: flex;
        gap: 15px;
        margin-bottom: 15px;

        span {
          background-color: #333;
          color: #fff;
          padding: 5px 10px;
          border-radius: 20px;
        }
      }

      .lecture-author {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 10px;

        span:first-child {
          font-size: 16px;
          color: #fff;
          font-weight: bold;
        }

       
      }

      .lecture-tags {
        display: flex;
        gap: 10px;

        .tag {
          background-color: rgba(98, 148, 255, 0.3);
          color: #fff;
          font-size: 14px;
          padding: 5px 10px;
          border-radius: 15px;
        }
      }
    }

    .lecture-header-right {
      padding-right: 60px;
  position: relative;
  text-align: center;

  .lecture-image {
    width: 350px;
    height: 250px;
    border-radius: 15px;
    object-fit: cover;
    box-shadow: 0 13px 60px rgba(255, 255, 255, 0.9);
    margin-bottom: 20px;
  }


  .lecture-preview-button {
    width: 300px;
    margin-bottom: 30px;
    position: absolute;
    bottom: 20px;
    padding-left: 520px;
    border: none;
    left: 40%;
    transform: translateX(-50%);
    background-color: #ffffff;
    color: #000000;
    font-size: 18px;
    font-weight: bold;
    padding: 8px 30px;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.9);

    &:hover {
      background-color: #f0f0f0;
    }
  }

  .lecture-highlight {
    
    background-color: #e60000;
    color: #ffffff;
    font-size: 14px;
    font-weight: bold;
    padding: 10px 25px;
    border-radius: 10px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
}
  }


  .lecture-tabs {
    padding-left: 70px;
  display: flex;
  justify-content: left;
  align-items: left;
  border-bottom: 1px solid #ddd;
  background-color: #ffffff;

  .lecture-tab {
    background-color: #ffffff;
    text-align: left;
    border: none;
    font-size: 16px;
    color: #A29D9D;
    font-weight: 500;
   
    padding: 15px 15px;
    cursor: pointer;
    position: relative; /* underline 위치 조정용 */
    transition: color 0.3s ease;

    &.active {
      color: #000;
      font-weight: bold;
    }

    &.active::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background-color: #4a90e2; /* 활성화된 탭의 밑줄 색상 */
    }

    &:hover {
      color: #4a90e2;
    }
  }

  .lecture-tab-number {
    background-color: #4a90e2;
    color: #fff;
    font-size: 12px;
    font-weight: bold;
    padding: 2px 6px;
    border-radius: 12px;
    margin-left: 5px;
  }
}


  /* 강의 소개 및 구매 섹션 */
  .lecture-detail-body {
    display: flex;
    gap: 20px;
    padding: 30px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

    .lecture-content {
      padding-top: 20px;
      flex: 0.8;
      padding-left: 50px;
      h2 {
        font-size: 22px;
        font-weight: bold;
        margin-bottom: 15px;
      }

      p {
        font-size: 22px;
        font-weight: bold;
        color: #555;
        margin-bottom: 20px;
      }

      .lecture-intro-section {
        border: 2px solid #e3e3e3; /* 테두리 색상 */
        border-radius: 20px;
        padding-top: 30px;
        padding-left: 120px;
        display: flex;
        gap: 60px;

        .lecture-intro-icon {
  display: flex;
  flex-direction: column; /* 자식 요소를 세로로 정렬 */
  align-items: center; /* 수평 가운데 정렬 */
  justify-content: center; /* 수직 가운데 정렬 */
  gap: 10px; /* 이미지와 텍스트 사이 간격 */
  margin-bottom: 20px;

  img {
    width: 60px; /* 이미지 크기 조정 */
    height: 60px;
    object-fit: cover;
    margin-bottom: 5px; /* 이미지와 텍스트 간격 */
  }

  /* 텍스트 스타일 */
  span {
    font-size: 18px;
    width: 125px;
    font-weight: bold;
    color: #333;
    text-align: center; /* 텍스트 가운데 정렬 */
  }
}
        .lecture-intro-content ul {
          
          list-style: none;
          width: 600px;
         padding-left: 90px;
         margin-bottom: 23px;
          li {
            font-size: 18px;
            font-weight: 500;
            margin-bottom: 8px;

            &::before {
              content: "✔️";
              color: #4a90e2;
              margin-right: 20px;
            }
          }
        }
      }
    }

    .lecture-purchase-section {
      margin-right: 20px;
      flex: 0.3;
      padding: 20px;
      background: #f9f9f9;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
     

      .lecture-price {
        margin-bottom: 20px;

        .lecture-discounted-price {
          font-size: 36px;
          color: #e60000;
          font-weight: bold;
        }

        .lecture-discount-wrapper {
          display: flex;
          justify-content: left;
          gap: 5px;

          .lecture-original-price {
            font-size: 16px;
            color: #999;
            text-decoration: line-through;
          }

          .lecture-discount {
            font-size: 18px;
            color: #e60000;
            font-weight: bold;
          }
        }
      }

      .lecture-enroll-button {
        width: 100%;
        background-color: #7671f4;
        color: #fff;
        font-size: 18px;
        font-weight: bold;
        padding: 12px 20px;
        border-radius: 10px;
        border: none;
        cursor: pointer;
        transition: background-color 0.3s ease;

        &:hover {
          background-color: #3576b2;
        }
      }

      .lecture-cart-button {

    width: 100%;
    background-color: #fff;
    color: #000000;
    font-size: 18px;
    font-weight: bold;
    padding: 12px 20px;
    border: 2px solid #c2c2c2;
    border-radius: 10px;
    cursor: pointer;
    margin-top: 10px;
    margin-bottom: 20px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #f7f7f7;
    }
  }

  .lecture-extra-info {
    display: flex;
    justify-content: space-between;
    gap: 13px;
    margin-bottom: 20px;
    padding: 2px 10px;

    span {
      display: flex;
      align-items: center;
      gap: 3px;
      font-size: 17px;
      font-weight: bold;
      color: #555;
    }
  }

  .lecture-details {
    background-color: #ffffff;
    padding: 15px;
    border: 1px solid #e6e6e6;
    border-radius: 10px;
    font-weight: bold;
    font-size: 15px;
    color: #5a5a5a;
    line-height: 1.8;

    p {
      margin: 5px 0;

      strong {
        color: #b8b8b8;
        margin-right: 5px;
      }
    }
  }

  .lecture-footer {
    margin-top: 15px;
    padding: 10px;
    font-size: 14px;
    color: #007e37;
    background-color: #e9f7ef;
    font-weight: bold;
    border-radius: 15px;
    text-align: center;
  }
}
  }
}
</style>

