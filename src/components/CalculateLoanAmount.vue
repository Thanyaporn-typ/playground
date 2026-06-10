<template>
  <div class="container mt-5">
    <div class="row">
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

      <div class="col-md-6 align-self-center" v-if="loanAmount !== null">
        <div class="card card-cal mb-3 text-white">
          <div class="text-center ">
            <h2 class="fw-bold mb-3">ผลการคำนวณ</h2>
            <p>วงเงินกู้เงินโดยเฉลี่ยได้สูงสุด บาท</p>
            <h2 class="fw-bold">{{ formatWithComma(loanAmount.toFixed(0)) }} บาท*</h2>
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

    <div class="p-5 mb-3">
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

    <div class="row g-3">
      <div class="col-md-8">
        <h3 v-if="loanAmount !== null" class="fw-bold">โครงการที่แนะนำ</h3>
        <div v-if="loanAmount !== null">
          จำนวนทั้งหมด <span class="fw-bold">{{ filteredCondos.length }} โครงการ</span>
        </div>
      </div>
      <div class="col-md-2 align-self-center">
        <div v-if="loanAmount !== null" class=" mb-3 text-end"><small>เรียงลำดับ</small></div>
      </div>
      <div class="col-md-2 text-end">

        <select v-if="loanAmount !== null" class="form-select form-select-sm" v-model="sortOrder" @change="sortCondos"
          aria-label="Default select example">
          <option value="1">ราคาน้อย - มาก</option>
          <option value="2">ราคามาก - น้อย</option>
        </select>
      </div>
    </div>

    <!-- <div class="row mt-3" v-if="loanAmount !== null">
      <div class="col-12 col-sm-6 col-md-6 col-lg-3" v-for="(condo, index) in filteredCondos" :key="index">
        <a :href="condo.link_url_condo" target="_blank" class="text-decoration-none">
          <div class="card border-0 mb-3">
            <div class="card-img-overlay bottom-left">
              <p class="card-title text-white">{{ condo.address_condo }}</p>
            </div>
            <img :src="condo.link_image_condo" class="card-img-top" alt="image">
            <div class="card-body card-filteredcondos" style="">

              <div class="row">
                <div class="col-md-5">
                  <div class="project-type mb-1 text-center" v-if="condo.project_type_condo"
                    :style="getProjectTypeStyle(condo.project_type_condo)">{{ condo.project_type_condo }}
                  </div>
                </div>
                <div class="col-md-7 text-end mt-1">
                  <div v-if="condo.price_condo > 0" style="font-size: 13px;">ราคาเริ่มต้น <b>
                      {{ condo.decimal_price_condo }} </b> ล้านบาท</div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12 text-end">
                  <div class="text-see-detail"><small>ดูรายละเอียด <i class="fa-solid fa-angle-right"></i></small></div>
                </div>
              </div>
            </div>
          </div>
        </a>
      </div>
    </div> -->

    <div class="row mt-3" v-if="loanAmount !== null">
      <div class="col-12 col-sm-6 col-md-6 col-lg-3" v-for="(condo, index) in filteredCondos" :key="index" v-show="condo.enable === 1">
        <!-- ใช้ v-show เพื่อตรวจสอบค่า enable -->
        <div >
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
                      :style="getProjectTypeStyle(condo.project_type_condo)">{{ condo.project_type_condo }}
                    </div>
                  </div>
                  <div class="col-md-7 text-end mt-1">
                    <div v-if="condo.price_condo > 0" style="font-size: 13px;">ราคาเริ่มต้น <b>{{
                      condo.decimal_price_condo }} </b> ล้านบาท</div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-12 text-end">
                    <div class="text-see-detail"><small>ดูรายละเอียด <i class="fa-solid fa-angle-right"></i></small></div>
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
import { mapState } from "vuex";
import { GET_CONDO_DETAILS } from "../store/actions.type";

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
    await this.init();
  },
  computed: {
    filteredCondos() {
      let filtered = this.list_condo.filter(condo => condo.price_condo <= this.loanAmount);

      if (this.sortOrder === "1") {
        filtered.sort((a, b) => a.price_condo - b.price_condo);
      } else if (this.sortOrder === "2") {
        filtered.sort((a, b) => b.price_condo - a.price_condo);
      }

      return filtered;
    }
  },
  methods: {
    async init() {
      this.list_condo = await store.dispatch(GET_CONDO_DETAILS);
    },

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
