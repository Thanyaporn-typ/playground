<template>
  <div>
    <div class="row mt-3">
      <div class="col-md-6">
        <div class="mb-3">
          <label for="monthlyIncome">รายได้ต่อเดือน (รวมรายได้ผู้กู้ร่วม ถ้ามี)</label>
          <input v-model="monthlyIncome" @input="formatInput" class="form-control" type="text" id="monthlyIncome" />
        </div>

        <div class="mb-3">
          <label for="existingDebt">ภาระหนี้ที่ต้องผ่อนชำระต่อเดือน (ถ้ามี)</label>
          <input v-model="existingDebt" class="form-control" type="number" id="existingDebt" />
        </div>

        <div class="mb-3">
          <label for="loanTerm">ระยะเวลาที่ขอกู้ (ปี)</label>
          <input v-model="loanTerm" class="form-control" type="number" id="loanTerm" />
          <small class="text-secondary">*สูงสุด 30 ปี</small>
        </div>

        <div v-if="errorMessage" class="text-danger mt-1">
          <p>{{ errorMessage }}</p>
        </div>

        <div class="d-flex justify-content-end">
          <button class="btn btn-outline-secondary btn-start-cal mb-3 w-50 m-2" type="button"
            @click="StartcalculateLoanAmount">เริ่มใหม่</button>
          <button class="btn btn-primary mb-3 w-50 m-2" type="button" @click="calculateLoanAmount">คำนวณ</button>
        </div>
      </div>

      <div class="col-md-6 align-self-center" >
        <div class="card card-cal mb-3 text-white">
          <div class="text-center">
            <h2 class="fw-bold mb-3">ผลการคำนวณ</h2>
            <p>วงเงินกู้เงินโดยเฉลี่ยได้สูงสุด บาท</p>

            <transition name="fade">
            <h2 v-if="loanAmount !== null" class="fw-bold">{{ formatWithComma(loanAmount.toFixed(0)) }} บาท*</h2>
            </transition>

            <a href="https://origin.co.th/contact-us/" target="_blank" class="mt-5">
              <button class="btn btn-outline-secondary btn-lg rounded-pill btn-earn-interest" type="button">
                <span>รับดอกเบี้ย <span class="special-word">‘พิเศษ’</span> จากออริจิ้น <b>คลิกที่นี่</b></span>
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="p-1 mb-3">
      <div class="fw-bold">
        หมายเหตุ
      </div>
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
  </div>
</template>

<script>

export default {
  name: 'LoanAmountCalculation',
  data() {
    return {
      monthlyIncome: "20,000",       // รายได้ต่อเดือน
      existingDebt: 0,          // ภาระหนี้ที่ต้องผ่อนชำระต่อเดือน
      loanTerm: 30,             // ระยะเวลาที่ขอกู้ (ปี)
      loanAmount: null,         // วงเงินที่สามารถกู้ได้
      errorMessage: "",         // ข้อความแนะนำเมื่อกรอกข้อมูลไม่ครบ
      list_condo: [],           // คอนโดทั้งหมด
      sortOrder: "2"            // สถานะการเรียงลำดับ (1: ราคาน้อย - มาก, 2: ราคามาก - น้อย)
    };
  },
  async created() {
    // await this.init();
  },
  methods: {
    calculateLoanAmount() {
      const monthlyIncomeNum = this.parseNumber(this.monthlyIncome);
      const existingDebtNum = parseFloat(this.existingDebt);

      if (isNaN(monthlyIncomeNum) || monthlyIncomeNum <= 0) {
        this.errorMessage = "กรุณาใส่ รายได้ต่อเดือน ที่ถูกต้อง";
        return;
      }

      if (isNaN(existingDebtNum) || existingDebtNum < 0) {
        this.errorMessage = "กรุณาใส่ ภาระหนี้ที่ต้องผ่อนชำระต่อเดือน";
        return;
      }

      if (this.loanTerm <= 0 || this.loanTerm > 30) {
        this.errorMessage = "กรุณาใส่ ระยะเวลาที่ขอกู้ (สูงสุด 30 ปี)";
        return;
      }

      this.errorMessage = "";

      const availableDebt = monthlyIncomeNum * 0.4 - existingDebtNum;

      if (availableDebt <= 0) {
        this.errorMessage = "รายได้ของคุณไม่สามารถรองรับการผ่อนชำระได้";
        this.loanAmount = null;
        return;
      }

      const loanMultiplier = 150;
      this.loanAmount = availableDebt * loanMultiplier;
    },

    formatWithComma(value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    formatInput(event) {
      let value = event.target.value.replace(/[^\d]/g, '');
      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      this.monthlyIncome = value;
    },

    parseNumber(value) {
      return parseFloat(value.replace(/[^\d.-]/g, ''));
    },

    sortCondos() {
      // This triggers re-sorting of the filteredCondos list based on the selected option
    },

    // Function to reset input fields to default values
    StartcalculateLoanAmount() {
      this.monthlyIncome = "20,000";
      this.existingDebt = 0;
      this.loanTerm = 30;
      this.loanAmount = null;
      this.errorMessage = "";
    }
  },
};
</script>
<style scoped>
/* Define transition for the element */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

/* Optional: You can also add a bit of animation for a smoother transition */
.fade-enter, .fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
</style>