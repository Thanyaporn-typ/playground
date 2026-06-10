<template>
  <div>
    <!-- Header Section with Full Background Color -->
    <header class="header-section">
      <img src="../assets/banner-bri.jpg" alt="Website Header Image" class="header-image" />
      <div class="header-text">
        <h1>คำนวณเงินกู้ซื้อบ้าน คำนวณสินเชื่อเบื้องต้น</h1>
      </div>
    </header>

    <!-- Container with Background Color -->
    <div class="container-fluid bg-light"> <!-- Added background color class here -->
      <div class="container">
        <div class="text-center p-5 mb-5">
          <div class="word-break">
            โปรแกรมช่วยคำนวณสินเชื่อบ้าน ช่วยให้คุณคาดการณ์ยอดกู้และค่างวดผ่อนต่อเดือนได้ง่ายๆ
          </div>

          <div class="word-break">
            ไม่ว่าจะเป็นการกู้ซื้อบ้าน หรือรีไฟแนนซ์ เพียงกรอกข้อมูลดอกเบี้ย วงเงิน และระยะเวลาผ่อน
          </div>

          <div class="word-break">
            ระบบจะช่วยแนะนำโครงการและสินเชื่อที่เหมาะสมกับคุณ พร้อมปรับให้สอดคล้องกับรายได้
          </div>

          <div class="word-break">
            และความสามารถในการผ่อนชำระของคุณ
          </div>
        </div>

        <ul class="nav nav-tabs" id="pills-tab" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active m-1" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane"
              type="button" role="tab" aria-controls="profile-tab-pane"
              aria-selected="false">คำนวณวงเงินที่สามารถกู้ได้สูงสุด</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link  m-1" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button"
              role="tab" aria-controls="home-tab-pane" aria-selected="true">คำนวณการผ่อนต่อเดือน</button>
          </li>
        </ul>
        <div class="tab-content bg-white" id="myTabContent">
          <div class="tab-pane fade show active" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab"
            tabindex="0">
            <CalculateLoanAmount />
          </div>
          <div class="tab-pane fade " id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
            <CalculateMonthly />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CalculateMonthly from '@/components/CalculateMonthly.vue';
import CalculateLoanAmount from '@/components/CalculateLoanAmount.vue';

export default {
  name: 'CalculateTabsBri',
  components: {
    CalculateMonthly,
    CalculateLoanAmount,
  },
};
</script>

<style scoped>
.bg-white {
  background-color: white;
  padding: 6px;
}

.header-section {
  width: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.header-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  display: block;
  max-height: 450px; 
  transition: max-height 0.3s ease;
  filter: opacity(0.4);
}

.header-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #000000;
  text-align: center;
  padding: 0 20px;
  z-index: 1;
}

.header-text h1 {
  font-size: 2rem;
  margin-bottom: 10px;
}

.header-text p {
  font-size: 1rem;
  margin-top: 0;
}

.bg-light {
  background-color: #f8f9f9 !important;
}

/* Make image square on smaller screens */
@media (max-width: 768px) {
  .header-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    min-height: 300px;
  }

  .header-text h1 {
    font-size: 1.5rem; 
  }

  .header-text p {
    font-size: 0.875rem; 
  }
}

@media (max-width: 480px) {
  .header-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    min-height: 250px; /* Keeps it square for smaller screens */
  }

  .header-text h1 {
    font-size: 1.2rem;
  }

  .header-text p {
    font-size: 0.75rem;
  }
}

.nav-tabs .nav-link.active, .nav-tabs .nav-item.show .nav-link {
    color: #ffffff;
    background-color: #092c40;
    border-color: var(--bs-nav-tabs-link-active-border-color);
    font-size: 18px;
    margin-top: 20px;
}

.nav-tabs .nav-link:hover {
  color: #092c40;
  background-color: var(--bs-nav-tabs-link-hover-bg, #f1f1f1); 
  border-color: var(--bs-nav-tabs-link-hover-border-color, #ddd); 
  font-size: 18px;
  margin-top: 20px;
}
</style>
