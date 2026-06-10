<template>
  <div>
    <!-- Form for loan details -->
    <div class="row mt-3">
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
      <div class="col-md-6 align-self-center">
        <div class="card card-cal mb-3 text-white">
          <div class="text-center">
            <h1>ผลการคำนวณ</h1>

            <h5 v-if="emi !== null" class="mb-3 mt-3">
              จำนวนเงินผ่อนต่อเดือน
              <span class="animate__animated animate__bounceIn emi-amount">
                {{ formatWithComma(emi.toFixed(0)) }}
              </span> บาท*
            </h5>

            <a href="https://origin.co.th/contact-us/" target="_blank" class="mt-5">
              <button class="btn btn-outline-secondary rounded-pill btn-earn-interest" type="button">
                <span>รับดอกเบี้ย <span class="special-word">‘พิเศษ’</span> จากออริจิ้น <b>คลิกที่นี่</b></span>
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Notes Section -->
    <div class="p-1 mb-3">
      <div class="fw-bold">หมายเหตุ</div>
      <div class="text-secondary">
        <small>- อัตราดอกเบี้ยที่ใช้ในการคำนวณ คือ อัตราดอกเบี้ย 5 % เป็นอัตราดอกเบี้ยเบื้องต้น</small>
      </div>
      <div class="text-secondary">
        <small>- การคำนวณการกู้สินเชื่อเป็นเพียงการคำนวณแค่เบื้องต้นเท่านั้น
          ทั้งนี้ขึ้นอยู่กับการอนุมัติสินเชื่อตามหลักเกณฑ์ของทางธนาคาร</small>
      </div>
      <div class="text-secondary">
        <small> - การคำนวณนี้เป็นวงเงินที่ประมาณการยอดเงินกู้ได้สูงสุดซึ่งขึ้นอยู่กับรายได้.</small>
      </div>
    </div>

    <!-- Condo List and Sorting (Only shown after EMI is calculated) -->

  </div>
</template>

<script>
export default {
  name: 'CalculateTabs',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loanAmount: parseInt(this.value.replace(/,/g, ''), 10) || 0,  // Convert value to number
      interestRate: 5.3,       // อัตราดอกเบี้ยเฉลี่ย 3 ปีแรก
      loanTerm: 30,            // ระยะเวลาที่ขอกู้ (ปี)
      emi: null,               // ยอดผ่อนชำระรายเดือน
      errorMessage: "",        // ข้อความแนะนำเมื่อกรอกข้อมูลไม่ครบ
      formattedLoanAmount: this.formatWithComma(this.value), // Use formatted version of value
      list_condo: "",          // รายการคอนโดทั้งหมด
      sortOrder: "2"           // Sorting order (1: ราคาน้อย - มาก, 2: ราคามาก - น้อย)
    };
  },
  async created() {
    // Initial EMI calculation when the page is first loaded (if there's an initial value)
    this.calculateEMI();
  },
  methods: {
    // Function to calculate EMI
    calculateEMI() {
      if (this.loanAmount <= 0 || this.interestRate <= 0 || this.loanTerm <= 0 || this.loanTerm > 30) {
        this.errorMessage = "กรุณาใส่ข้อมูลให้ครบถ้วน";
        this.emi = null;  // Set EMI to null if there is an error
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

    // Function to format loan amount with commas
    formatAmount() {
      let value = this.formattedLoanAmount.replace(/[^0-9]/g, '');
      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      this.formattedLoanAmount = value;
      this.loanAmount = parseInt(value.replace(/,/g, ''), 10) || 0;

      // Automatically trigger EMI calculation
      this.calculateEMI();
    },

    // Function to format number with commas (used when displaying loan amount)
    formatWithComma(value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    // New method to reset to default values
    StartcalculateEMI() {
      this.loanAmount = parseInt(this.value.replace(/,/g, ''), 10) || 0;
      this.interestRate = 5.3;
      this.loanTerm = 30;
      this.formattedLoanAmount = this.formatWithComma(this.value);
      this.emi = null;
      this.errorMessage = "";
    }
  },
  watch: {
    // Watch changes in formattedLoanAmount and recalculate the EMI immediately
    formattedLoanAmount(newValue) {
      this.calculateEMI();
    },
    // Watch changes in interestRate or loanTerm and recalculate the EMI immediately
    interestRate(newValue) {
      this.calculateEMI();
    },
    loanTerm(newValue) {
      this.calculateEMI();
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
}

.animate__animated.animate__bounceIn {
  --animate-duration: 4s; /* เปลี่ยนจาก 2s เป็น 4s */
}

/* ตัวแปร global สำหรับอนิเมชันทั้งหมด */
:root {
  --animate-duration: 4000ms; /* เปลี่ยนจาก 1200ms เป็น 4000ms */
  --animate-delay: 2s;
}


.emi-amount {
  font-size: 2rem; /* Adjust the size as needed */
  font-weight: bold;
}
</style>
