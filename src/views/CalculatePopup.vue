<template>
  <div class="container-fluid"> <!-- Added py-5 for some padding at the top and bottom -->
    <div class="row justify-content-center"> <!-- Center the row content -->
      <div class="col-md-8"> <!-- You can adjust the col size based on your preference -->
        <!-- Tab Navigation -->
        <ul class="nav nav-tabs nav-justified" id="pills-tab" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active m-1" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button"
              role="tab" aria-controls="home-tab-pane" aria-selected="true"><p class="text-tab m-0">คำนวณการผ่อนต่อเดือน</p></button>
          </li>

          <li class="nav-item" role="presentation">
            <button class="nav-link  m-1" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane"
              type="button" role="tab" aria-controls="profile-tab-pane"
              aria-selected="false"><p class="text-tab m-0">คำนวณวงเงินที่สามารถกู้ได้สูงสุด</p></button>
          </li>
        
        </ul>
        <!-- Tab Content -->
        <div class="tab-content bg-white mt-3" id="myTabContent">

          <div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
            <CalculateMonthlyPopup :value="value"/>
          </div>

          <div class="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab"
            tabindex="0">
            <CalculateLoanAmountPopup :value="value" />
          </div>
         
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CalculateMonthlyPopup from '@/components/CalculateMonthlyPopup.vue';
import CalculateLoanAmountPopup from '@/components/CalculateLoanAmountPopup.vue';

export default {
  name: 'CalculateTabs',
  components: {
    CalculateMonthlyPopup,
    CalculateLoanAmountPopup,
  },
  computed: {
    value() {
      return this.$route.params.value;  // หรือสามารถใช้ this.$route.params เพื่อดึงพารามิเตอร์ทั้งหมด
    }
  },
  mounted() {
    console.log(this.$route.params);  // แสดงพารามิเตอร์ทั้งหมดที่รับมาจาก URL
    console.log(this.value);  // แสดงค่าของพารามิเตอร์ value
  }
};
</script>

<style scoped>
.nav-tabs .nav-link {
    background-color: rgb(248, 248, 248);
    height: 50px;
}
/* Add some padding to the container */


/* Ensure the content inside is centered horizontally and vertically */
.row.justify-content-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Center the tab content and adjust spacing */
.nav-tabs {
  justify-content: center;
  margin-bottom: 20px;
}

.bg-light {
  background-color: #f8f9f9 !important;
}

/* Adjusting text-tab font size for responsive design */
.text-tab {
  font-size: 1rem; /* Default font size for larger screens */
}

@media (max-width: 768px) {
  .text-tab {
    font-size: 0.9rem; /* Smaller font size for medium screens */
  }
}

@media (max-width: 576px) {
  .text-tab {
    font-size: 0.8rem; /* Even smaller font size for small screens */
  }
}

</style>
