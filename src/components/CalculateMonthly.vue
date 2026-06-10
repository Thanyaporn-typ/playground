<template>
  <div class="container mt-5">
    <!-- Form for loan details -->
    <div class="row">
      <div class="col-md-6">
        <div class="mb-3">
          <label for="loanAmount" class="mb-1">จำนวนเงินที่ขอกู้ (บาท)</label>
          <input v-model="formattedLoanAmount" class="form-control" type="text" id="loanAmount" @input="formatAmount" />
        </div>

        <div class="mb-3">
          <label for="interestRate" class="mb-1">อัตราดอกเบี้ยเฉลี่ย 3 ปีแรก (% ต่อปี)</label>
          <input v-model="interestRate" class="form-control" type="number" id="interestRate" />
        </div>

        <div class="mb-3">
          <label for="loanTerm" class="mb-1">ระยะเวลาที่ขอกู้ (ปี)</label>
          <input v-model="loanTerm" class="form-control" type="number" id="loanTerm" :max="30" />
          *สูงสุดไม่ควรเกิน 30 ปี
        </div>

        <div v-if="errorMessage" class="text-danger mt-1">
          <p>{{ errorMessage }}</p>
        </div>

        <div class="d-flex justify-content-end">
          <button class="btn btn-outline-secondary btn-start-cal mb-3 w-50 m-2" type="button"
            @click="StartcalculateEMI">เริ่มใหม่</button>
          <button class="btn btn-primary mb-3 w-50 m-2" type="button" @click="calculateEMI">คำนวณ</button>
        </div>
      </div>

      <!-- EMI Result Section -->
      <div class="col-md-6 align-self-center" v-if="emi !== null">
        <div class="card card-cal mb-3 text-white">
          <div class="text-center">
            <h1>ผลการคำนวณ</h1>
            <p>จำนวนเงินผ่อนต่อเดือน {{ formatWithComma(emi.toFixed(0)) }} บาท*</p>
          </div>
        </div>
        <div class="d-grid gap-2 col-8 mx-auto">
          <a href="https://origin.co.th/contact-us/" target="_blank">
            <button class="btn btn-outline-secondary btn-lg rounded-pill btn-earn-interest" type="button">
              <span>รับดอกเบี้ย <span class="special-word">‘พิเศษ’</span> จากออริจิ้น <b>คลิกที่นี่</b></span>
            </button>
          </a>
        </div>
        <div class="m-3 text-secondary text-center">ดูโครงการที่อยู่ในงบประมาณของคุณ <i
            class="fa-solid fa-angle-down"></i></div>
      </div>
    </div>

    <!-- Notes Section -->
    <div class="p-5">
      <div class="fw-bold">หมายเหตุ</div>
      <div class="text-secondary">
        <small>- อัตราดอกเบี้ยที่ใช้ในการคำนวณ คือ อัตราดอกเบี้ย 5 % เป็นอัตราดอกเบี้ยเบื้องต้น</small>
      </div>
      <div class="text-secondary">
        <small>- การคำนวณการกู้สินเชื่อเป็นเพียงการคำนวณแค่เบื้องต้นเท่านั้น
          ทั้งนี้ขึ้นอยู่กับการอนุมัติสินเชื่อตามหลักเกณฑ์ของทางธนาคาร</small>
      </div>
      <div class="text-secondary">
        <small> - การคำนวณนี้เป็นวงเงินที่ประมาณการยอดเงินกู้ได้สูงสุดซึ่งขึ้นอยู่กับรายได้</small>
      </div>
    </div>

    <!-- Condo List and Sorting (Only shown after EMI is calculated) -->
    <div v-if="emi !== null">
      <div class="row g-3">
        <div class="col-md-8">
          <h3 class="fw-bold">โครงการที่แนะนำ</h3>
          <div>จำนวนทั้งหมด <span class="fw-bold">{{ filteredCondos.length }} โครงการ</span></div>
        </div>
        <div class="col-md-2 align-self-center">
          <div class="mb-3 text-end"><small>เรียงลำดับ</small></div>
        </div>
        <div class="col-md-2 text-end">
          <!-- Dropdown for Sorting -->
          <select class="form-select form-select-sm" v-model="sortOrder" @change="sortCondos"
            aria-label="Default select example">
            <option value="1">ราคาน้อย - มาก</option>
            <option value="2">ราคามาก - น้อย</option>
          </select>
        </div>
      </div>

      <div class="row mt-3" v-if="loanAmount !== null">
        <div class="col-12 col-sm-6 col-md-6 col-lg-3" v-for="(condo, index) in filteredCondos" :key="index" v-show="condo.enable === 1">
          <a :href="condo.link_url_condo" target="_blank" class="text-decoration-none">
            <div class="card border-0 mb-3">
              <div class="card-img-overlay bottom-left">
                <p class="card-title text-white">{{ condo.address_condo }}</p>
              </div>
              <img :src="condo.link_image_condo" class="card-img-top" alt="image">
              <div class="card-body card-filteredcondos">
                <div class="row">
                  <div class="col-md-5">
                    <div class="project-type mb-1 text-center" v-if="condo.project_type_condo"
                      :style="getProjectTypeStyle(condo.project_type_condo)">
                      {{ condo.project_type_condo }}
                    </div>
                  </div>
                  <div class="col-md-7 text-end mt-1">
                    <div v-if="condo.price_condo > 0" style="font-size: 13px;">
                      ราคาเริ่มต้น <b>{{ condo.decimal_price_condo }}</b> ล้านบาท
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-12 text-end">
                    <div class="text-see-detail">
                      <small>ดูรายละเอียด <i class="fa-solid fa-angle-right"></i></small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from "@/store";
import { GET_CONDO_DETAILS } from "../store/actions.type";

export default {
  name: 'CalculateTabs',
  data() {
    return {
      loanAmount: 3500000,     // จำนวนเงินที่ขอกู้
      interestRate: 5.3,       // อัตราดอกเบี้ยเฉลี่ย 3 ปีแรก
      loanTerm: 30,            // ระยะเวลาที่ขอกู้ (ปี)
      emi: null,               // ยอดผ่อนชำระรายเดือน
      errorMessage: "",        // ข้อความแนะนำเมื่อกรอกข้อมูลไม่ครบ
      formattedLoanAmount: '3,500,000', // Formatted loan amount (string with commas)
      list_condo: "",          // รายการคอนโดทั้งหมด
      sortOrder: "2"           // Sorting order (1: ราคาน้อย - มาก, 2: ราคามาก - น้อย)
    };
  },
  async created() {
    await this.init();
  },
  computed: {
    // Filter and Sort Condos
    filteredCondos() {
      const maxLoanAmount = this.loanAmount;

      if (!Array.isArray(this.list_condo)) {
        return [];
      }

      // Filter condos by loan amount
      let filtered = this.list_condo.filter(condo => {
        const condoPrice = parseFloat(condo.price_condo);
        return condoPrice <= maxLoanAmount;
      });

      // Sort condos based on the selected sortOrder
      if (this.sortOrder === "1") {
        filtered.sort((a, b) => parseFloat(a.price_condo) - parseFloat(b.price_condo));
      } else if (this.sortOrder === "2") {
        filtered.sort((a, b) => parseFloat(b.price_condo) - parseFloat(a.price_condo));
      }

      return filtered;
    }
  },
  methods: {
    async init() {
      this.list_condo = await store.dispatch(GET_CONDO_DETAILS);
    },

    calculateEMI() {
      if (this.loanAmount <= 0 || this.interestRate <= 0 || this.loanTerm <= 0 || this.loanTerm > 30) {
        this.errorMessage = "กรุณาใส่ข้อมูลให้ครบถ้วน";
        return;
      }

      const P = this.loanAmount;  // จำนวนเงินที่ขอกู้
      const annualRate = this.interestRate / 100;  // แปลงอัตราดอกเบี้ยเป็นทศนิยม
      const r = annualRate / 12;  // อัตราดอกเบี้ยรายเดือน
      const n = this.loanTerm * 12;  // จำนวนเดือนในการผ่อนชำระ

      if (r > 0) {
        const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        this.emi = emi;
      } else {
        this.emi = P / n;
      }
    },

    formatAmount() {
      let value = this.formattedLoanAmount.replace(/[^0-9]/g, '');
      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      this.formattedLoanAmount = value;
      this.loanAmount = parseInt(value.replace(/,/g, ''), 10) || 0;
    },

    formatWithComma(value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    sortCondos() {
      // This triggers re-sorting of the filteredCondos list based on the selected option
    },

    getProjectTypeStyle(projectType) {
      let backgroundColor = '';

      if (!projectType) {
        projectType = 'โครงการพร้อมอยู่';
      }

      switch (projectType) {
        case 'โครงการพร้อมอยู่':
          backgroundColor = '#008D72';
          break;
        case 'โครงการใหม่':
          backgroundColor = '#E87C2D';
          break;
        case ' ':
          backgroundColor = '#008D72';
          break;
        default:
          backgroundColor = '#808080';
      }

      return {
        backgroundColor: backgroundColor,
        color: '#ffffff',
        padding: '5px',
        borderRadius: '10px',
        fontSize: '12px'
      };
    },

    // New method to reset to default values
    StartcalculateEMI() {
      this.loanAmount = 3500000;
      this.interestRate = 5.3;
      this.loanTerm = 30;
      this.formattedLoanAmount = '3,500,000';
      this.emi = null;
      this.errorMessage = "";
    }
  }
};
</script>

<style>
.card-img-overlay.bottom-left {
  position: absolute;
  top: 255px;
  z-index: 1;
}

.card {
  min-height: 350px;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}

.card-img-top {
  width: 100%;
  height: 320px;
  object-fit: cover;
  filter: brightness(0.7);
}</style>
