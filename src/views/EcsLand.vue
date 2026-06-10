<template>
  <div class="ecs-app">
    <!-- HEADER -->
    <div class="ecs-header">
      <div class="header-inner">
        <div class="header-brand">
          <div class="logo-dot"></div>
          <span class="brand-name">ECS <span>LAND</span></span>
        </div>
        <div class="header-stats">
          <div class="hstat">
            <div class="hstat-num">{{ filteredData.length }}</div>
            <div class="hstat-lbl">แปลงที่ดิน</div>
          </div>
          <div class="hstat-div"></div>
          <div class="hstat">
            <div class="hstat-num">{{ totalAreaRai }}</div>
            <div class="hstat-lbl">รวมไร่ (ไร่)</div>
          </div>
          <div class="hstat-div"></div>
          <div class="hstat">
            <div class="hstat-num">{{ totalPriceMillion }}</div>
            <div class="hstat-lbl">รวมมูลค่า (ล้าน)</div>
          </div>
        </div>
      </div>
    </div>

    <!-- FILTER BAR -->
    <div class="filter-bar">
      <div class="filter-inner">
        <!-- Row 1: search + controls -->
        <div class="filter-top-row">
          <div class="search-wrap">
            <!-- <svg class="search-icon" viewBox="0 0 20 20" fill="none">
              <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" stroke-width="1.8"/>
              <path d="M13 13L17 17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg> -->
            <input
              v-model="search"
              class="search-inp"
              type="text"
              placeholder="ค้นหาทำเล, จังหวัด..."
            />
            <button v-if="search" class="search-clear" @click="search = ''">✕</button>
          </div>
          <div class="filter-controls">
            <button class="filter-toggle-btn" :class="{ 'ftb-active': showFilters }" @click="showFilters = !showFilters">
              <svg viewBox="0 0 20 20" width="15" height="15" fill="none"><path d="M3 5h14M6 10h8M9 15h2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
              <span>ตัวกรอง</span>
              <span v-if="activeFilterCount > 0" class="fcount">{{ activeFilterCount }}</span>
            </button>
            <div class="view-toggle">
              <button :class="['vbtn', viewMode === 'table' && 'active']" @click="viewMode = 'table'" title="ตาราง">
                <svg viewBox="0 0 20 20" width="16" height="16"><rect x="2" y="3" width="16" height="3" rx="1" fill="currentColor" opacity=".7"/><rect x="2" y="8.5" width="16" height="3" rx="1" fill="currentColor" opacity=".7"/><rect x="2" y="14" width="16" height="3" rx="1" fill="currentColor" opacity=".7"/></svg>
              </button>
              <button :class="['vbtn', viewMode === 'card' && 'active']" @click="viewMode = 'card'" title="การ์ด">
                <svg viewBox="0 0 20 20" width="16" height="16"><rect x="2" y="2" width="7" height="7" rx="1.5" fill="currentColor" opacity=".7"/><rect x="11" y="2" width="7" height="7" rx="1.5" fill="currentColor" opacity=".7"/><rect x="2" y="11" width="7" height="7" rx="1.5" fill="currentColor" opacity=".7"/><rect x="11" y="11" width="7" height="7" rx="1.5" fill="currentColor" opacity=".7"/></svg>
              </button>
              <button :class="['vbtn', viewMode === 'heat' && 'active']" @click="viewMode = 'heat'" title="Heat Map">
                <svg viewBox="0 0 20 20" width="16" height="16"><rect x="2" y="13" width="3" height="5" rx="1" fill="currentColor" opacity=".5"/><rect x="6" y="9" width="3" height="9" rx="1" fill="currentColor" opacity=".65"/><rect x="10" y="5" width="3" height="13" rx="1" fill="currentColor" opacity=".8"/><rect x="14" y="2" width="3" height="16" rx="1" fill="currentColor"/></svg>
              </button>
            </div>
          </div>
        </div>
        <!-- Row 2: filter selects (collapsible on mobile) -->
        <div class="filters" :class="{ 'filters-open': showFilters }">
          <select v-model="filterProvince" class="fsel">
            <option value="">จังหวัด (ทั้งหมด)</option>
            <option v-for="p in provinceOptions" :key="p" :value="p">{{ p }}</option>
          </select>
          <select v-model="filterZone" class="fsel">
            <option value="">โซน (ทั้งหมด)</option>
            <option v-for="z in zoneOptions" :key="z" :value="z">{{ z }}</option>
          </select>
          <select v-model="sortBy" class="fsel">
            <option value="">เรียงลำดับ</option>
            <option value="price_asc">ราคา น้อย→มาก</option>
            <option value="price_desc">ราคา มาก→น้อย</option>
            <option value="area_asc">พื้นที่ น้อย→มาก</option>
            <option value="area_desc">พื้นที่ มาก→น้อย</option>
          </select>
        </div>
      </div>
    </div>

    <!-- RESULT COUNT -->
    <div class="result-bar" v-if="search || filterProvince || filterZone">
      <span>ผลลัพธ์: <strong>{{ filteredData.length }}</strong> รายการ</span>
      <button class="clear-all" @click="clearFilters">ล้างตัวกรอง ✕</button>
    </div>

    <!-- TABLE VIEW -->
    <div class="content-area" v-if="viewMode === 'table'">
      <div class="table-wrap">
        <table class="land-table">
          <thead>
            <tr>
              <th class="th-no">#</th>
              <th class="th-location">ทำเล</th>
              <th>จังหวัด</th>
              <th>โซน</th>
              <th class="th-area">ไร่</th>
              <th class="th-area">งาน</th>
              <th class="th-area">ตร.ว.</th>
              <th class="th-area">รวม ตร.ว.</th>
              <th class="th-price">ราคา/ตร.ว.</th>
              <th class="th-price">ราคารวม</th>
              <th class="th-action">Presentation</th>
              <th class="th-action">แผนที่</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in filteredData" :key="idx" class="land-row">
              <td class="td-no">{{ idx + 1 }}</td>
              <td class="td-location">
                <div class="loc-name">{{ item.location || '(ไม่ระบุ)' }}</div>
                <span v-if="item.notes" class="notes-badge">{{ item.notes }}</span>
              </td>
              <td>{{ item.province }}</td>
              <td>
                <span class="zone-badge">{{ item.zone }}</span>
              </td>
              <td class="td-num">{{ item.rai }}</td>
              <td class="td-num">{{ item.ngan }}</td>
              <td class="td-num">{{ item.sqwah }}</td>
              <td class="td-num bold">{{ formatNum(item.totalSqwah) }}</td>
              <td class="td-price">{{ formatNum(item.pricePerSqwah) }}</td>
              <td class="td-price total">
                <span class="price-million">{{ item.totalPriceMillion }}M</span>
                <span class="price-sub">{{ formatNum(item.totalPriceMillion * 1000000) }}</span>
              </td>
              <td class="td-action">
                <div class="action-btns">
                  <a v-if="item.doc1" :href="item.doc1" target="_blank" class="abtn abtn-doc" title="ดาวน์โหลดเอกสาร 1">
                    <svg viewBox="0 0 20 20" width="14" height="14"><path d="M10 2v10M6 8l4 4 4-4M4 16h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
                    Presentation
                  </a>
                </div>
              </td>
              <td class="td-action">
                <a v-if="item.link" :href="item.link" target="_blank" class="abtn abtn-link">
                  <svg viewBox="0 0 20 20" width="14" height="14"><path d="M10 3H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-5M13 3h4v4M10 10L17 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
                  ดูแผนที่
                </a>
              </td>
            </tr>
            <tr v-if="filteredData.length === 0">
              <td colspan="12" class="no-result">ไม่พบข้อมูลที่ค้นหา</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- CARD VIEW -->
    <div class="content-area" v-else-if="viewMode === 'card'">
      <div class="card-grid">
        <div v-for="(item, idx) in filteredData" :key="idx" class="land-card" :class="{ 'card-comparing': isComparing(item) }">
          <div class="card-header">
            <div class="card-no">#{{ idx + 1 }}</div>
            <div style="display:flex;gap:6px;align-items:center">
              <span class="zone-badge">{{ item.zone }}</span>
              <button class="cmp-toggle" :class="{ active: isComparing(item) }" @click="toggleCompare(item)" :disabled="!isComparing(item) && compareList.length >= 3" :title="isComparing(item) ? 'ยกเลิก' : compareList.length >= 3 ? 'เลือกได้สูงสุด 3 แปลง' : 'เพิ่มเปรียบเทียบ'">
                <svg v-if="isComparing(item)" viewBox="0 0 16 16" width="12" height="12"><path d="M2 8l4 4 8-8" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <svg v-else viewBox="0 0 16 16" width="12" height="12"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
              </button>
            </div>
          </div>
          <div class="card-title">{{ item.location || '(ไม่ระบุ)' }}</div>
          <div class="card-meta">
            <span class="prov-tag">{{ item.province }}</span>
            <span v-if="item.notes" class="notes-badge">{{ item.notes }}</span>
          </div>
          <div class="card-area-row">
            <div class="area-box">
              <div class="area-val">{{ item.rai }}</div>
              <div class="area-lbl">ไร่</div>
            </div>
            <div class="area-sep">-</div>
            <div class="area-box">
              <div class="area-val">{{ item.ngan }}</div>
              <div class="area-lbl">งาน</div>
            </div>
            <div class="area-sep">-</div>
            <div class="area-box">
              <div class="area-val">{{ item.sqwah }}</div>
              <div class="area-lbl">ตร.ว.</div>
            </div>
            <div class="area-total">
              <span>รวม</span>
              <strong>{{ formatNum(item.totalSqwah) }} ตร.ว.</strong>
            </div>
          </div>
          <div class="card-price-row">
            <div>
              <div class="price-lbl">ราคา / ตร.ว.</div>
              <div class="price-val">฿{{ formatNum(item.pricePerSqwah) }}</div>
            </div>
            <div class="price-total-box">
              <div class="price-lbl">ราคารวม</div>
              <div class="price-big">{{ item.totalPriceMillion }}<span>ล้าน</span></div>
            </div>
          </div>
          <div class="card-footer">
            <a v-if="item.doc1" :href="item.doc1" target="_blank" class="abtn abtn-doc">
              <svg viewBox="0 0 20 20" width="13" height="13"><path d="M10 2v10M6 8l4 4 4-4M4 16h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
              Presentation
            </a>
            <a v-if="item.link" :href="item.link" target="_blank" class="abtn abtn-link">
              <svg viewBox="0 0 20 20" width="13" height="13"><path d="M10 3H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-5M13 3h4v4M10 10L17 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
              แผนที่
            </a>
          </div>
        </div>
        <div v-if="filteredData.length === 0" class="no-result-card">ไม่พบข้อมูลที่ค้นหา</div>
      </div>
    </div>

    <!-- HEAT MAP VIEW -->
    <div class="content-area" v-else-if="viewMode === 'heat'">
      <div class="heat-legend">
        <span class="hl-dot" style="background:#4ade80"></span>ราคาต่ำ
        <span class="hl-dot" style="background:#fbbf24"></span>ปานกลาง
        <span class="hl-dot" style="background:#f97316"></span>สูง
        <span class="hl-dot" style="background:#ef4444"></span>สูงมาก
        <span class="hl-tip">คลิกการ์ดเพื่อดูแปลงในจังหวัดนั้น</span>
      </div>
      <div class="heat-grid">
        <div v-for="prov in heatmapData" :key="prov.province"
             class="heat-card"
             :style="heatCardStyle(prov.avgPricePerSqwah)"
             @click="filterProvince = prov.province; viewMode = 'card'">
          <div class="heat-top">
            <div class="heat-prov">{{ prov.province || '(ไม่ระบุ)' }}</div>
            <div class="heat-count">{{ prov.count }} แปลง</div>
          </div>
          <div class="heat-bar-wrap">
            <div class="heat-bar" :style="{ width: heatBarWidth(prov.avgPricePerSqwah) + '%', background: heatBarColor(prov.avgPricePerSqwah) }"></div>
          </div>
          <div class="heat-price-main">
            ฿{{ formatNum(prov.avgPricePerSqwah) }}
            <span class="heat-price-unit">/ ตร.ว.</span>
          </div>
          <div class="heat-price-range">
            ฿{{ formatNum(prov.minPricePerSqwah) }} – ฿{{ formatNum(prov.maxPricePerSqwah) }}
          </div>
          <div class="heat-stats-row">
            <div class="heat-stat">
              <div class="hs-val">{{ prov.totalPriceMillion.toLocaleString() }}</div>
              <div class="hs-lbl">ล้านบาท</div>
            </div>
            <div class="heat-stat-div"></div>
            <div class="heat-stat">
              <div class="hs-val">{{ formatNum(prov.totalSqwah) }}</div>
              <div class="hs-lbl">ตร.ว. รวม</div>
            </div>
          </div>
          <div class="heat-hover-hint">คลิกเพื่อดูแปลง →</div>
        </div>
      </div>
    </div>

    <!-- COMPARE BAR -->
    <transition name="slide-up">
      <div class="compare-bar" v-if="compareList.length > 0">
        <div class="cbar-inner">
          <div class="cbar-slots">
            <div v-for="(item, i) in compareList" :key="i" class="cbar-item">
              <div class="cbar-name">{{ item.location || '(ไม่ระบุ)' }}</div>
              <div class="cbar-price">{{ item.totalPriceMillion }}M</div>
              <button class="cbar-remove" @click="compareList.splice(i, 1)">✕</button>
            </div>
            <template v-if="compareList.length < 3">
              <div class="cbar-empty" v-for="n in (3 - compareList.length)" :key="'e'+n">
                <span>+ เพิ่มแปลง</span>
              </div>
            </template>
          </div>
          <div class="cbar-actions">
            <button class="cbar-clear" @click="compareList = []">ล้าง</button>
            <button class="cbar-compare-btn" @click="showCompare = true" :disabled="compareList.length < 2">
              เปรียบเทียบ {{ compareList.length }}/3 แปลง
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- COMPARE MODAL -->
    <transition name="fade">
      <div class="cmp-overlay" v-if="showCompare" @click.self="showCompare = false">
        <div class="cmp-modal">
          <div class="cmp-head">
            <h2 class="cmp-title">เปรียบเทียบที่ดิน</h2>
            <button class="cmp-close" @click="showCompare = false">✕</button>
          </div>
          <div class="cmp-body">
            <div class="cmp-scroll">
              <table class="cmp-table">
                <thead>
                  <tr>
                    <th class="cmp-row-label"></th>
                    <th v-for="(item, i) in compareList" :key="i" class="cmp-col-head">
                      <div class="cmp-col-name">{{ item.location || '(ไม่ระบุ)' }}</div>
                      <div class="cmp-col-prov">{{ item.province }}</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="cmp-row-label">โซน</td>
                    <td v-for="(item, i) in compareList" :key="i"><span class="zone-badge">{{ item.zone || '-' }}</span></td>
                  </tr>
                  <tr>
                    <td class="cmp-row-label">พื้นที่</td>
                    <td v-for="(item, i) in compareList" :key="i" class="cmp-num">{{ item.rai }}-{{ item.ngan }}-{{ item.sqwah }} ไร่-งาน-ว.</td>
                  </tr>
                  <tr class="cmp-alt">
                    <td class="cmp-row-label">รวม ตร.ว.</td>
                    <td v-for="(item, i) in compareList" :key="i" class="cmp-num cmp-bold">{{ formatNum(item.totalSqwah) }}</td>
                  </tr>
                  <tr>
                    <td class="cmp-row-label">ราคา / ตร.ว.</td>
                    <td v-for="(item, i) in compareList" :key="i" class="cmp-num" :class="compareMin('pricePerSqwah', item) ? 'cmp-best' : compareMax('pricePerSqwah', item) ? 'cmp-worst' : ''">฿{{ formatNum(item.pricePerSqwah) }}</td>
                  </tr>
                  <tr class="cmp-alt cmp-price-row">
                    <td class="cmp-row-label">ราคารวม</td>
                    <td v-for="(item, i) in compareList" :key="i" class="cmp-price-cell" :class="compareMin('totalPriceMillion', item) ? 'cmp-best' : compareMax('totalPriceMillion', item) ? 'cmp-worst' : ''">
                      {{ item.totalPriceMillion }}<span style="font-size:12px;font-weight:400"> ล้าน</span>
                    </td>
                  </tr>
                  <tr>
                    <td class="cmp-row-label">พื้นที่ใหญ่สุด</td>
                    <td v-for="(item, i) in compareList" :key="i" :class="compareMax('totalSqwah', item) ? 'cmp-best' : compareMin('totalSqwah', item) ? 'cmp-worst' : ''">
                      {{ compareMax('totalSqwah', item) ? '🏆 ใหญ่ที่สุด' : compareMin('totalSqwah', item) ? 'เล็กสุด' : '–' }}
                    </td>
                  </tr>
                  <tr class="cmp-alt">
                    <td class="cmp-row-label">สถานะ</td>
                    <td v-for="(item, i) in compareList" :key="i">
                      <span v-if="item.notes" class="notes-badge">{{ item.notes }}</span>
                      <span v-else style="color:#9aa3b2">–</span>
                    </td>
                  </tr>
                  <tr>
                    <td class="cmp-row-label">ลิงก์</td>
                    <td v-for="(item, i) in compareList" :key="i">
                      <div style="display:flex;flex-direction:column;gap:4px">
                        <a v-if="item.doc1" :href="item.doc1" target="_blank" class="abtn abtn-doc" style="width:fit-content">Presentation</a>
                        <a v-if="item.link" :href="item.link" target="_blank" class="abtn abtn-link" style="width:fit-content">แผนที่</a>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
const LAND_DATA = [
  { location: 'Krungthep - Kreetha', group: 'กลุ่ม 3 พี่เต๋า', province: 'Bangkok', zone: 'Yor. 3', rai: 7, ngan: 2, sqwah: 74, totalSqwah: 3074, pricePerSqwah: 160000, totalPriceMillion: 492, doc1: 'https://drive.google.com/file/d/1GUQ9skM8likEamFxHI-VZqM0-hKQdzyJ/view?usp=sharing', link: 'https://maps.app.goo.gl/NqWUTodKdo8JqQFn6', notes: '' },
  { location: 'La Salle 83', group: 'กลุ่ม 3 พี่เต๋า', province: 'Bangkok', zone: 'Yor. 4', rai: 7, ngan: 3, sqwah: 13, totalSqwah: 3113, pricePerSqwah: 275000, totalPriceMillion: 856, doc1: 'https://drive.google.com/file/d/1mmH3JKLRf0JpC_DVAi0uxlrF4YCIRYNC/view?usp=sharing', link: 'https://maps.app.goo.gl/UufRDxXyocdbJz5JA', notes: 'EIA Approved (Condo)' },
  { location: 'Ramkhamhaeng 142', group: 'กลุ่ม 3 พี่เต๋า', province: 'Bangkok', zone: 'Yor. 3', rai: 10, ngan: 1, sqwah: 66, totalSqwah: 4166, pricePerSqwah: 142000, totalPriceMillion: 592, doc1: 'https://drive.google.com/file/d/1NG65Eu6sQmtm9joDVbxGvm1tVSj9jcDO/view?usp=sharing', link: 'https://maps.app.goo.gl/XiG6PMn5BsQPHHdb8', notes: '' },
  { location: 'Suwinthawong', group: 'กลุ่ม 3 พี่เต๋า', province: 'Bangkok', zone: 'Por.3', rai: 5, ngan: 3, sqwah: 6, totalSqwah: 2306, pricePerSqwah: 175000, totalPriceMillion: 403, doc1: 'https://drive.google.com/file/d/1zJer1KUEDeCYOdYqJzl8efHopU96Ggm3/view?usp=sharing', link: 'https://maps.app.goo.gl/GxL2mr3c1kJDqt2o7', notes: '' },
  { location: 'Nimitmai', group: 'กลุ่ม 3 พี่เต๋า', province: 'Bangkok', zone: 'Yor. 2', rai: 37, ngan: 1, sqwah: 18, totalSqwah: 14918, pricePerSqwah: 33500, totalPriceMillion: 500, doc1: 'https://drive.google.com/file/d/11eObsAgBdhmQpxbFbPOXLHzRHb6gGJMJ/view?usp=sharing', link: 'https://maps.app.goo.gl/91MaHiyjzTNzFuGWA', notes: '' },
  { location: 'Bangwa Interchange', group: 'กลุ่ม 6 พี่ประสิทธิ์', province: 'Bangkok', zone: 'Yor.9', rai: 4, ngan: 1, sqwah: 45.8, totalSqwah: 1746, pricePerSqwah: 390000, totalPriceMillion: 681, doc1: 'https://drive.google.com/file/d/1Q2GaF2fpyKafRfMozsOpI-r1HLuSVUn7/view?usp=sharing', link: 'https://maps.app.goo.gl/r4TCWVh8gso9hFnP6', notes: 'EIA Approved (Condo)' },
  { location: 'Bangkuntian', group: 'กลุ่ม 6 พี่ประสิทธิ์', province: 'Bangkok', zone: 'Kor. 4', rai: 46, ngan: 1, sqwah: 45, totalSqwah: 18545, pricePerSqwah: 26500, totalPriceMillion: 491, doc1: 'https://drive.google.com/file/d/1p6alGQsSh81G24YunUwYciGEDox1Yc0d/view?usp=sharing', link: 'https://maps.app.goo.gl/ekYLw9UgqcgcM7KT8', notes: '' },
  { location: 'Donmueang Songprapa', group: 'กลุ่ม 6 พี่ประสิทธิ์', province: 'Bangkok', zone: 'Yor. 3', rai: 29, ngan: 1, sqwah: 39, totalSqwah: 11739, pricePerSqwah: 42000, totalPriceMillion: 493, doc1: 'https://drive.google.com/file/d/1kwE0MJp_4DtHqVVfCSvGxiu1wib6d2eC/view?usp=sharing', link: 'https://maps.app.goo.gl/BrXTGbxAKXZYzTYx6', notes: '' },
  { location: 'Phaholyothin 59', group: 'กลุ่ม 6 พี่ประสิทธิ์', province: 'Bangkok', zone: 'Yor.6', rai: 1, ngan: 0, sqwah: 88, totalSqwah: 488, pricePerSqwah: 395000, totalPriceMillion: 193, doc1: 'https://drive.google.com/file/d/1qoXscxmpacoJZc7-jTRAuDu_l-IAUHeQ/view?usp=sharing', link: 'https://maps.app.goo.gl/gv5M6az7eykyn8Sf6', notes: '' },
  { location: 'Yaek Kor Por Aor Station', group: 'กลุ่ม 1 พี่เต้', province: 'Bangkok', zone: 'Yor. 4', rai: 11, ngan: 2, sqwah: 72, totalSqwah: 4672, pricePerSqwah: 230000, totalPriceMillion: 1075, doc1: 'https://drive.google.com/file/d/1SUAUFVEeQP8Evl6t277B8VPD05VPU4Vu/view?usp=sharing', link: 'https://maps.app.goo.gl/wMLNRwFpznoGJksG7', notes: 'Site filled and leveled' },
  { location: 'Ladkrabang 18/1', group: 'กลุ่ม 1 พี่เต้', province: 'Samut Prakan', zone: 'Yor. 5', rai: 3, ngan: 1, sqwah: 7, totalSqwah: 1307, pricePerSqwah: 187500, totalPriceMillion: 245, doc1: 'https://drive.google.com/file/d/1Fr2PF4TCbSKpftUmB9KTWRqaqMdtUbs2/view?usp=sharing', link: 'https://maps.app.goo.gl/giJzAcydsR637MMd8', notes: 'EIA Approved (Condo)' },
  { location: 'Sukhumvit 76', group: 'กลุ่ม 1 พี่เต้', province: 'Samut Prakan', zone: 'Yor.4', rai: 36, ngan: 2, sqwah: 90, totalSqwah: 14690, pricePerSqwah: 45000, totalPriceMillion: 661, doc1: 'https://drive.google.com/file/d/1_78a5xqsfSzf76y1iLdcn9FM6v7xUnuQ/view?usp=sharing', link: 'https://maps.app.goo.gl/gBxnWTZom4tnTuoA7', notes: 'Site filled and leveled' },
  { location: 'Theparak Bangbo', group: 'กลุ่ม 1 พี่เต้', province: 'Samut Prakan', zone: 'Yor. 5', rai: 26, ngan: 3, sqwah: 57, totalSqwah: 10757, pricePerSqwah: 27500, totalPriceMillion: 296, doc1: 'https://drive.google.com/file/d/1MDAIbssTOw0kvFKYTGbRDh_5OGoxrBHm/view?usp=sharing', link: 'https://maps.app.goo.gl/nP8Mowyan4dFdyQf9', notes: '' },
  { location: 'Lum Luk Ka Khlong 6', group: 'กลุ่ม 4 พี่เป๋า', province: 'Pathumthani', zone: '', rai: 36, ngan: 3, sqwah: 6, totalSqwah: 14706, pricePerSqwah: 22000, totalPriceMillion: 324, doc1: 'https://drive.google.com/file/d/1n_TMf6YlEzD8R0twkN5QxH5yQPgnZ-_Q/view?usp=sharing', link: 'https://maps.app.goo.gl/HqPKrF6oQXNRUt2W6', notes: '' },
  { location: 'Ratchaphreuk New Road', group: 'กลุ่ม 4 พี่เป๋า', province: 'Pathumthani', zone: '', rai: 40, ngan: 0, sqwah: 28, totalSqwah: 16028, pricePerSqwah: 33500, totalPriceMillion: 537, doc1: 'https://drive.google.com/file/d/1HIDB0HQ8mu2ju2wUglU7GPmACilNpdw_/view?usp=sharing', link: 'https://maps.app.goo.gl/aE86LTKGi28MLbY97', notes: '' },
  { location: 'Ratchaphreuk Robinson (1)', group: 'กลุ่ม 4 พี่เป๋า', province: 'Nonthaburi', zone: 'Yor.3', rai: 12, ngan: 0, sqwah: 27, totalSqwah: 4827, pricePerSqwah: 53000, totalPriceMillion: 256, doc1: 'https://drive.google.com/file/d/1ellCqLbA0H6UaAwIHNdkC8Fodva7rBAZ/view?usp=sharing', link: 'https://maps.app.goo.gl/4jeXBem41fxnnySA6', notes: '' },
  { location: 'Ratchaphreuk Robinson (2)', group: 'กลุ่ม 4 พี่เป๋า', province: 'Nonthaburi', zone: 'Yor.3', rai: 18, ngan: 3, sqwah: 41, totalSqwah: 7541, pricePerSqwah: 49000, totalPriceMillion: 369, doc1: '', link: 'https://maps.app.goo.gl/4jeXBem41fxnnySA6', notes: '' },
  { location: 'Nakhon In', group: 'กลุ่ม 4 พี่เป๋า', province: 'Nonthaburi', zone: 'Yor.3', rai: 29, ngan: 2, sqwah: 39, totalSqwah: 11839, pricePerSqwah: 68000, totalPriceMillion: 805, doc1: 'https://drive.google.com/file/d/1VAVIzNFGZYv8wtp2J1n_J7DGgPVHfxg2/view?usp=sharing', link: 'https://maps.app.goo.gl/6sQ5znxh1FX7MTuC9', notes: '' },
  { location: 'Chaengwattana', group: 'กลุ่ม 5 พี่ตี๋', province: 'Nonthaburi', zone: 'Yor. 8', rai: 1, ngan: 3, sqwah: 90, totalSqwah: 790, pricePerSqwah: 360000, totalPriceMillion: 284, doc1: 'https://drive.google.com/file/d/1HoAGzhg2Qq0u1Gsh4f0N95tumLCRQWDm/view?usp=sharing', link: 'https://maps.app.goo.gl/i9Wa4sc3PkBwe6Cc6', notes: '' },
  { location: 'Chaophraya Pakkret', group: 'กลุ่ม 5 พี่ตี๋', province: 'Nonthaburi', zone: 'Kor. 3', rai: 24, ngan: 3, sqwah: 36, totalSqwah: 9936, pricePerSqwah: 30000, totalPriceMillion: 298, doc1: 'https://drive.google.com/file/d/1x8uJfG1jWhCh72RWJym297iTBQUL-yBl/view?usp=sharing', link: 'https://maps.app.goo.gl/soucoHK4AUxDG5KB8', notes: '' },
  { location: 'Bang Kruai - Sai Noi', group: 'กลุ่ม 5 พี่ตี๋', province: 'Nonthaburi', zone: 'Yor.2', rai: 46, ngan: 2, sqwah: 91, totalSqwah: 18691, pricePerSqwah: 18000, totalPriceMillion: 336, doc1: 'https://drive.google.com/file/d/18P7UClHfrkGjCEs9d63i3SZHu6Pxe6sh/view?usp=sharing', link: 'https://maps.app.goo.gl/Bang-Kruai', notes: '' },
  { location: 'Nakhonpathom', group: 'กลุ่ม 5 พี่ตี๋', province: 'Nakhonpathom', zone: '', rai: 3, ngan: 3, sqwah: 64, totalSqwah: 1564, pricePerSqwah: 45000, totalPriceMillion: 70, doc1: 'https://drive.google.com/file/d/1Z5W2appq8cpMMt-sA8dHWimmVA3rBmVe/view?usp=sharing', link: 'https://maps.app.goo.gl/4LpsPUxaRkDRy6NR8', notes: '' },
  { location: 'Laem Chabang Meyer', group: 'กลุ่ม 2 พี่กราฟ', province: 'Chonburi', zone: 'EEC', rai: 10, ngan: 0, sqwah: 22, totalSqwah: 4022, pricePerSqwah: 70000, totalPriceMillion: 282, doc1: 'https://drive.google.com/file/d/1kNqr8q2_yTZ40KHoe77oHq-gRg9t1lsn/view?usp=sharing', link: 'https://maps.app.goo.gl/JWxovayA9QaDNn348', notes: '' },
  { location: 'Bangpakong', group: 'กลุ่ม 2 พี่กราฟ', province: 'Chachoengsao', zone: 'EEC', rai: 12, ngan: 0, sqwah: 0, totalSqwah: 4800, pricePerSqwah: 79167, totalPriceMillion: 380, doc1: 'https://drive.google.com/file/d/1dO4vb7ItiRmTD2DtbRBIDalZNUq-8EFR/view?usp=sharing', link: 'https://maps.app.goo.gl/v9cw5dRsPMgTUrnQ8', notes: 'EIA Approved (Condo), Foundation laid' },
  { location: 'Amata Panthong', group: 'กลุ่ม 2 พี่กราฟ', province: 'Chonburi', zone: 'EEC', rai: 38, ngan: 1, sqwah: 73, totalSqwah: 15373, pricePerSqwah: 30000, totalPriceMillion: 461, doc1: 'https://drive.google.com/file/d/1077EzZad8lxCu2aD6X1fWJExw1BCvM0P/view?usp=sharing', link: 'https://maps.app.goo.gl/6NvWPW3Qp5WLuaK7A', notes: '' },
  { location: 'Pattaya Healthland', group: 'กลุ่ม 2 พี่กราฟ', province: 'Chonburi', zone: 'EEC', rai: 3, ngan: 0, sqwah: 25, totalSqwah: 1225, pricePerSqwah: 390000, totalPriceMillion: 478, doc1: 'https://drive.google.com/file/d/1BqRl9VJRKZhKE7N4lKJ5_UAcDovtKwav/view?usp=sharing', link: 'https://maps.app.goo.gl/YYeE2jUA8GYNJ6mj8', notes: 'EIA Approved (Hotel)' },
  { location: 'Pattaya Homepro (2 Plot)', group: 'กลุ่ม 2 พี่กราฟ', province: 'Chonburi', zone: 'EEC', rai: 1, ngan: 3, sqwah: 57, totalSqwah: 757, pricePerSqwah: 181500, totalPriceMillion: 137, doc1: 'https://drive.google.com/file/d/1AMhBWYzSeJ7lfeAFExXFJxpVZhRjLd0K/view?usp=sharing', link: 'https://maps.app.goo.gl/2HRKzYwNejpN2yg3A', notes: '' },
  { location: '', group: 'กลุ่ม 2 พี่กราฟ', province: '', zone: '', rai: 3, ngan: 3, sqwah: 43, totalSqwah: 1543, pricePerSqwah: 140000, totalPriceMillion: 216, doc1: '', link: '', notes: '' },
  { location: 'Sriracha J-Park', group: 'กลุ่ม 9 พี่จิ๊บ', province: 'Chonburi', zone: 'EEC', rai: 0, ngan: 0, sqwah: 0, totalSqwah: 0, pricePerSqwah: 0, totalPriceMillion: 0, doc1: '', link: 'https://maps.app.goo.gl/zkoQAFNsNYs6pbZW9', notes: 'TBD' },
  { location: 'Bangsaen', group: 'กลุ่ม 9 พี่จิ๊บ', province: 'Chonburi', zone: 'EEC', rai: 2, ngan: 3, sqwah: 81, totalSqwah: 1181, pricePerSqwah: 190000, totalPriceMillion: 227, doc1: 'https://drive.google.com/file/d/1txxpx3262srsYqqXTeCYa2TVaMnkim0n/view?usp=sharing', link: 'https://maps.app.goo.gl/vyAiSSsZQSKxfsbz6', notes: 'EIA Approved (Condo)' },
  { location: 'Sriracha Bestbuy', group: 'กลุ่ม 9 พี่จิ๊บ', province: 'Chonburi', zone: 'EEC', rai: 1, ngan: 1, sqwah: 2, totalSqwah: 502, pricePerSqwah: 300000, totalPriceMillion: 151, doc1: 'https://drive.google.com/file/d/1p93NeA3z2ZR2FZgjC4T3_GaCaLRO7CM0/view?usp=sharing', link: 'https://maps.app.goo.gl/vaJHcwVrmwGLG7gM6', notes: '' },
  { location: 'Rayong-Nern Samlee', group: 'กลุ่ม 9 พี่จิ๊บ', province: 'Rayong', zone: 'EEC', rai: 4, ngan: 3, sqwah: 89, totalSqwah: 1989, pricePerSqwah: 55000, totalPriceMillion: 109, doc1: 'https://drive.google.com/file/d/1dYlNf63K9yCg1P8-_UecqRSCmNUeaJvq/view?usp=sharing', link: 'https://maps.app.goo.gl/8VxdvYEiq28fScfq6', notes: '' },
  { location: 'Huahin Petchkasem', group: 'กลุ่ม 8,10 พี่อาย หยิง', province: 'Prachuap Khiri Khan', zone: '', rai: 3, ngan: 3, sqwah: 3.3, totalSqwah: 1503, pricePerSqwah: 310000, totalPriceMillion: 466, doc1: 'https://drive.google.com/file/d/1QB09x4BjSz6F5yrwrpQtSsKT1gsol1a3/view?usp=sharing', link: 'https://maps.app.goo.gl/s2xcgCKRuyVLn2gi8', notes: '' },
  { location: 'Phuket Center (Housing)', group: 'กลุ่ม 8,10 พี่อาย หยิง', province: 'Phuket', zone: '', rai: 13, ngan: 0, sqwah: 38, totalSqwah: 5238, pricePerSqwah: 65000, totalPriceMillion: 340, doc1: 'https://drive.google.com/file/d/1-8p0oz_AtzgJOqoHnImYXOvv8KLJECrB/view?usp=sharing', link: 'https://maps.app.goo.gl/8QqZzQTPqiMVFdNSA', notes: '' },
  { location: 'Phuket Center (condo)', group: 'กลุ่ม 8,10 พี่อาย หยิง', province: 'Phuket', zone: '', rai: 5, ngan: 0, sqwah: 24.2, totalSqwah: 2024, pricePerSqwah: 130000, totalPriceMillion: 263, doc1: '', link: 'https://maps.app.goo.gl/8hj9Rjky8MGMtPtj7', notes: 'EIA Approved (Condo)' },
  { location: 'Phuket Cherngtalay (2)', group: 'กลุ่ม 8,10 พี่อาย หยิง', province: 'Phuket', zone: '', rai: 6, ngan: 0, sqwah: 87.5, totalSqwah: 2488, pricePerSqwah: 125000, totalPriceMillion: 311, doc1: '', link: 'https://maps.app.goo.gl/pXBHgPRD7Wvw7kBQ7', notes: '' },
  { location: 'Phuket Cherngtalay (3)', group: 'กลุ่ม 8,10 พี่อาย หยิง', province: 'Phuket', zone: '', rai: 1, ngan: 0, sqwah: 24.3, totalSqwah: 424, pricePerSqwah: 125000, totalPriceMillion: 53, doc1: '', link: 'https://maps.app.goo.gl/pXBHgPRD7Wvw7kBQ7', notes: '' },
  { location: 'Phuket Kata (1)', group: 'กลุ่ม 8,10 พี่อาย หยิง', province: 'Phuket', zone: '', rai: 5, ngan: 3, sqwah: 91, totalSqwah: 2391, pricePerSqwah: 414471, totalPriceMillion: 991, doc1: 'https://drive.google.com/file/d/1vo3QkpRUn_MJb-ldzbnUkmlipqrFTiV7/view?usp=sharing', link: 'https://maps.app.goo.gl/NAxds2mcMNCRTx6r6', notes: '' },
  { location: 'Phuket Kata (2)', group: 'กลุ่ม 8,10 พี่อาย หยิง', province: 'Phuket', zone: '', rai: 1, ngan: 2, sqwah: 14.9, totalSqwah: 615, pricePerSqwah: 600098, totalPriceMillion: 369, doc1: '', link: 'https://maps.app.goo.gl/MJZFdHKnUFwUq4aWA', notes: '' },
  { location: 'Khaoyai Thanarat', group: 'กลุ่ม 7 ปิง', province: 'Nakhonratchasima', zone: '', rai: 33, ngan: 1, sqwah: 75, totalSqwah: 13375, pricePerSqwah: 55000, totalPriceMillion: 736, doc1: 'https://drive.google.com/file/d/1OyB_sfBhFrc9il-w0kxV3tMr1Rw2b384/view?usp=sharing', link: 'https://maps.app.goo.gl/KpeQUbVuyH6dkP3D9', notes: '' },
  { location: 'Khonkean Nonmuang', group: 'กลุ่ม 7 ปิง', province: 'Khon Kaen', zone: '', rai: 4, ngan: 0, sqwah: 81.9, totalSqwah: 1682, pricePerSqwah: 55000, totalPriceMillion: 93, doc1: 'https://docs.google.com/presentation/d/1hFe7HQHGTmI9wHuddSagmlfEKCL2NPrg/edit?usp=sharing', link: 'https://maps.app.goo.gl/wjJ1RsXY5wyvddQN8', notes: '' },
  { location: 'Khonkean Maliwan', group: 'กลุ่ม 7 ปิง', province: 'Khon Kaen', zone: '', rai: 62, ngan: 3, sqwah: 36.7, totalSqwah: 25137, pricePerSqwah: 15000, totalPriceMillion: 377, doc1: 'https://drive.google.com/file/d/1VU47U0gCaJ5Yq334xLugvu7dWqUywoaY/view?usp=sharing', link: 'https://maps.app.goo.gl/MusBorCBw2y3QkFPA', notes: '' },
]

export default {
  name: 'EcsLand',
  data() {
    return {
      lands: LAND_DATA,
      search: '',
      filterProvince: '',
      filterZone: '',
      sortBy: '',
      viewMode: 'card',
      showFilters: true,
      compareList: [],
      showCompare: false,
    }
  },
  mounted() {
    if (window.innerWidth < 768) {
      this.viewMode = 'card'
      this.showFilters = false
    } else {
      this.viewMode = 'table'
      this.showFilters = true
    }
  },
  computed: {
    provinceOptions() {
      return [...new Set(this.lands.map(d => d.province))].filter(Boolean).sort()
    },
    zoneOptions() {
      return [...new Set(this.lands.map(d => d.zone))].filter(Boolean).sort()
    },
    activeFilterCount() {
      return [this.filterProvince, this.filterZone, this.sortBy].filter(Boolean).length
    },
    filteredData() {
      let list = this.lands.filter(d => {
        const q = this.search.toLowerCase()
        if (q && ![d.location, d.province, d.zone].some(v => v.toLowerCase().includes(q))) return false
        if (this.filterProvince && d.province !== this.filterProvince) return false
        if (this.filterZone && d.zone !== this.filterZone) return false
        return true
      })
      if (this.sortBy === 'price_asc') list = [...list].sort((a, b) => a.totalPriceMillion - b.totalPriceMillion)
      if (this.sortBy === 'price_desc') list = [...list].sort((a, b) => b.totalPriceMillion - a.totalPriceMillion)
      if (this.sortBy === 'area_asc') list = [...list].sort((a, b) => a.totalSqwah - b.totalSqwah)
      if (this.sortBy === 'area_desc') list = [...list].sort((a, b) => b.totalSqwah - a.totalSqwah)
      return list
    },
    totalAreaRai() {
      const total = this.filteredData.reduce((s, d) => s + d.rai + d.ngan / 4 + d.sqwah / 400, 0)
      return total.toFixed(1)
    },
    totalPriceMillion() {
      const total = this.filteredData.reduce((s, d) => s + d.totalPriceMillion, 0)
      return total >= 1000 ? (total / 1000).toFixed(1) + 'B' : total.toLocaleString()
    },
    heatmapData() {
      const map = {}
      this.filteredData.forEach(d => {
        const k = d.province || '(ไม่ระบุ)'
        if (!map[k]) map[k] = { province: k, count: 0, totalSqwah: 0, totalPriceMillion: 0, prices: [] }
        map[k].count++
        map[k].totalSqwah += d.totalSqwah
        map[k].totalPriceMillion += d.totalPriceMillion
        if (d.pricePerSqwah > 0) map[k].prices.push(d.pricePerSqwah)
      })
      return Object.values(map).map(p => ({
        ...p,
        avgPricePerSqwah: p.prices.length ? Math.round(p.prices.reduce((a, b) => a + b, 0) / p.prices.length) : 0,
        minPricePerSqwah: p.prices.length ? Math.min(...p.prices) : 0,
        maxPricePerSqwah: p.prices.length ? Math.max(...p.prices) : 0,
      })).sort((a, b) => b.avgPricePerSqwah - a.avgPricePerSqwah)
    },
  },
  methods: {
    formatNum(n) {
      return Number(n).toLocaleString()
    },
    clearFilters() {
      this.search = ''
      this.filterProvince = ''
      this.filterZone = ''
      this.sortBy = ''
    },
    toggleCompare(item) {
      const idx = this.compareList.findIndex(c => c.location === item.location)
      if (idx >= 0) this.compareList.splice(idx, 1)
      else if (this.compareList.length < 3) this.compareList.push(item)
    },
    isComparing(item) {
      return this.compareList.some(c => c.location === item.location)
    },
    heatCardStyle(avg) {
      if (!avg) return { background: '#f8f9fc', borderColor: '#e4e8f0' }
      if (avg < 35000)  return { background: '#f0fdf4', borderColor: '#4ade80' }
      if (avg < 80000)  return { background: '#fefce8', borderColor: '#fbbf24' }
      if (avg < 200000) return { background: '#fff7ed', borderColor: '#f97316' }
      return { background: '#fff1f2', borderColor: '#ef4444' }
    },
    heatBarColor(avg) {
      if (!avg) return '#e4e8f0'
      if (avg < 35000)  return '#4ade80'
      if (avg < 80000)  return '#fbbf24'
      if (avg < 200000) return '#f97316'
      return '#ef4444'
    },
    heatBarWidth(avg) {
      const max = Math.max(...this.heatmapData.map(p => p.avgPricePerSqwah), 1)
      return Math.round((avg / max) * 100)
    },
    compareMin(field, item) {
      if (this.compareList.length < 2) return false
      return item[field] === Math.min(...this.compareList.map(c => c[field]))
    },
    compareMax(field, item) {
      if (this.compareList.length < 2) return false
      return item[field] === Math.max(...this.compareList.map(c => c[field]))
    },
  },
}
</script>

<style scoped>
* { box-sizing: border-box; }

.ecs-app {
  min-height: 100vh;
  background: #f0f2f5;
  font-family: 'Prompt', 'Sarabun', sans-serif;
}

/* ── HEADER ── */
.ecs-header {
  background: linear-gradient(135deg, #0f1f5c 0%, #1a3a8f 60%, #1e4fd8 100%);
  color: #fff;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 16px rgba(15,31,92,0.35);
}
.header-inner {
  max-width: 1400px;
  margin: 0 auto;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.header-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}
.logo-dot {
  width: 10px;
  height: 10px;
  background: #ffd700;
  border-radius: 50%;
  box-shadow: 0 0 8px #ffd700;
}
.brand-name {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 2px;
}
.brand-name span { color: #ffd700; }
.header-stats {
  display: flex;
  align-items: center;
  gap: 20px;
}
.hstat { text-align: center; }
.hstat-num { font-size: 20px; font-weight: 700; line-height: 1; }
.hstat-lbl { font-size: 11px; opacity: 0.7; margin-top: 2px; }
.hstat-div { width: 1px; height: 32px; background: rgba(255,255,255,0.2); }

/* ── FILTER BAR ── */
.filter-bar {
  background: #fff;
  border-bottom: 1px solid #e4e8f0;
  padding: 12px 24px;
  position: sticky;
  top: 64px;
  z-index: 90;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.filter-inner {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.filter-top-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.filter-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.filter-toggle-btn {
  display: none;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1.5px solid #dde3ee;
  border-radius: 10px;
  background: #f8f9fc;
  font-family: 'Prompt', 'Sarabun', sans-serif;
  font-size: 13px;
  color: #3a4560;
  cursor: pointer;
  position: relative;
  transition: all 0.15s;
}
.filter-toggle-btn.ftb-active { background: #eef2ff; border-color: #1a3a8f; color: #1a3a8f; }
.fcount {
  background: #1a3a8f;
  color: #fff;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}
.search-wrap {
  position: relative;
  flex: 1;
  min-width: 0;
}
.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #9aa3b2;
}
.search-inp {
  width: 100%;
  padding: 9px 36px 9px 36px;
  border: 1.5px solid #dde3ee;
  border-radius: 10px;
  font-family: 'Prompt', 'Sarabun', sans-serif;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  background: #f8f9fc;
}
.search-inp:focus { border-color: #1a3a8f; background: #fff; }
.search-clear {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9aa3b2;
  cursor: pointer;
  font-size: 13px;
  padding: 2px;
}
.filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.fsel {
  padding: 9px 14px;
  border: 1.5px solid #dde3ee;
  border-radius: 10px;
  font-family: 'Prompt', 'Sarabun', sans-serif;
  font-size: 13px;
  background: #f8f9fc;
  outline: none;
  cursor: pointer;
  color: #3a4560;
  min-width: 140px;
  transition: border-color 0.2s;
  flex: 1;
}
.fsel:focus { border-color: #1a3a8f; }
.view-toggle { display: flex; gap: 4px; }
.vbtn {
  padding: 8px 10px;
  border: 1.5px solid #dde3ee;
  border-radius: 8px;
  background: #f8f9fc;
  cursor: pointer;
  color: #9aa3b2;
  display: flex;
  align-items: center;
  transition: all 0.15s;
}
.vbtn.active { background: #1a3a8f; border-color: #1a3a8f; color: #fff; }

/* ── RESULT BAR ── */
.result-bar {
  max-width: 1400px;
  margin: 12px auto 0;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #6b7490;
}
.clear-all {
  background: none;
  border: 1px solid #dde3ee;
  border-radius: 6px;
  padding: 3px 10px;
  font-family: 'Prompt', 'Sarabun', sans-serif;
  font-size: 12px;
  cursor: pointer;
  color: #e05050;
}

/* ── CONTENT ── */
.content-area {
  max-width: 1400px;
  margin: 16px auto;
  padding: 0 24px 40px;
}

/* ── TABLE ── */
.table-wrap {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 16px rgba(0,0,0,0.07);
  overflow-x: auto;
}
.land-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.land-table thead tr {
  background: #f4f6fb;
  border-bottom: 2px solid #e4e8f0;
}
.land-table th {
  padding: 13px 12px;
  text-align: left;
  font-weight: 600;
  color: #5a6480;
  font-size: 12px;
  white-space: nowrap;
  letter-spacing: 0.3px;
}
.th-no { width: 40px; text-align: center; }
.th-location { min-width: 160px; }
.th-area { text-align: center; }
.th-price { text-align: right; }
.th-action { text-align: center; }

.land-row { border-bottom: 1px solid #f0f2f7; transition: background 0.15s; }
.land-row:hover { background: #f8f9fd; }
.land-row:last-child { border-bottom: none; }

.land-table td { padding: 12px 12px; vertical-align: middle; color: #2c3550; }
.td-no { text-align: center; color: #9aa3b2; font-size: 12px; }

.loc-name { font-weight: 600; color: #1a2448; }
.notes-badge {
  display: inline-block;
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fcd34d;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  margin-top: 4px;
  white-space: nowrap;
}
.td-num { text-align: center; color: #4a5270; font-size: 13px; }
.td-num.bold { font-weight: 600; color: #1a2448; }
.td-price { text-align: right; white-space: nowrap; }
.price-million { font-size: 16px; font-weight: 700; color: #1a3a8f; display: block; }
.price-sub { font-size: 11px; color: #9aa3b2; }
.td-action { text-align: center; }

.group-tag {
  display: inline-block;
  background: #eef2ff;
  color: #3a5bd0;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}
.zone-badge {
  display: inline-block;
  background: #fff3e0;
  color: #e07020;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}
.action-btns { display: flex; gap: 6px; justify-content: center; flex-wrap: wrap; }
.abtn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-family: 'Prompt', 'Sarabun', sans-serif;
  text-decoration: none;
  white-space: nowrap;
  font-weight: 500;
  transition: opacity 0.15s, transform 0.1s;
}
.abtn:hover { opacity: 0.8; transform: translateY(-1px); }
.abtn-doc { background: #eef2ff; color: #3a5bd0; }
.abtn-link { background: #fff7ed; color: #c2510a; }
.no-result { text-align: center; padding: 48px; color: #9aa3b2; font-size: 15px; }

/* ── CARD GRID ── */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}
.land-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  border: 1px solid #edf0f7;
  transition: transform 0.15s, box-shadow 0.15s;
}
.land-card:hover { transform: translateY(-3px); box-shadow: 0 6px 24px rgba(0,0,0,0.12); }
.card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.card-no { font-size: 12px; color: #9aa3b2; font-weight: 600; }
.card-title { font-size: 16px; font-weight: 700; color: #1a2448; margin-bottom: 8px; line-height: 1.3; }
.card-meta { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px; }
.prov-tag {
  display: inline-block;
  background: #f0f2f7;
  color: #5a6480;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
}
.card-area-row {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8f9fc;
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 12px;
}
.area-box { text-align: center; }
.area-val { font-size: 18px; font-weight: 700; color: #1a2448; line-height: 1; }
.area-lbl { font-size: 11px; color: #9aa3b2; margin-top: 2px; }
.area-sep { color: #d0d5e8; font-size: 16px; }
.area-total { margin-left: auto; text-align: right; }
.area-total span { font-size: 11px; color: #9aa3b2; display: block; }
.area-total strong { font-size: 14px; color: #1a2448; }
.card-price-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 14px;
  padding-bottom: 14px;
  border-bottom: 1px solid #f0f2f7;
}

.price-lbl { font-size: 11px; color: #9aa3b2; margin-bottom: 3px; }
.price-val { font-size: 14px; font-weight: 600; color: #3a5bd0; }
.price-total-box { text-align: right; }
.price-big { font-size: 26px; font-weight: 800; color: #1a3a8f; line-height: 1; }
.price-big span { font-size: 14px; font-weight: 500; color: #6b7490; margin-left: 3px; }
.card-footer { display: flex; gap: 8px; flex-wrap: wrap; }
.no-result-card {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px;
  color: #9aa3b2;
  font-size: 15px;
  background: #fff;
  border-radius: 16px;
}

/* ── TABLE SCROLL ── */
.table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
.land-table { min-width: 900px; }

/* ── TABLET (≤1024px) ── */
@media (max-width: 1024px) {
  .header-inner { padding: 0; }
  .hstat-num { font-size: 17px; }
  .content-area { padding: 0 16px 40px; }
  .card-grid { grid-template-columns: repeat(2, 1fr); }
}

/* ── MOBILE (≤768px) ── */
@media (max-width: 768px) {
  /* Header */
  .ecs-header {
    padding: 0 16px;
    height: auto;
  }
  .header-inner {
    flex-direction: column;
    align-items: flex-start;
    padding: 12px 0;
    gap: 10px;
    height: auto;
  }
  .brand-name { font-size: 18px; }
  .header-stats {
    width: 100%;
    justify-content: space-between;
    gap: 0;
    background: rgba(255,255,255,0.08);
    border-radius: 10px;
    padding: 8px 12px;
  }
  .hstat-num { font-size: 15px; }
  .hstat-lbl { font-size: 10px; }
  .hstat-div { height: 24px; }

  /* Filter bar */
  .filter-bar { padding: 10px 16px; top: 0; position: relative; }
  .filter-toggle-btn { display: flex; }
  .filters {
    display: none;
    flex-direction: column;
    gap: 8px;
    padding-top: 4px;
  }
  .filters.filters-open { display: flex; }
  .fsel { min-width: 0; width: 100%; font-size: 13px; }

  /* Content */
  .content-area { padding: 0 12px 32px; margin-top: 8px; }

  /* Cards */
  .card-grid { grid-template-columns: 1fr; gap: 12px; }
  .land-card { padding: 16px; }
  .card-title { font-size: 15px; }
  .price-big { font-size: 22px; }

  /* Result bar */
  .result-bar { padding: 0 12px; margin-top: 8px; }
}

/* ── SMALL MOBILE (≤480px) ── */
@media (max-width: 480px) {
  .header-stats { padding: 6px 10px; }
  .hstat-num { font-size: 14px; }
  .brand-name { font-size: 16px; }
  .logo-dot { width: 8px; height: 8px; }
  .card-area-row { flex-wrap: wrap; gap: 6px; }
  .area-total { width: 100%; text-align: left; margin-left: 0; margin-top: 4px; }
}

/* ── COMPARE TOGGLE BUTTON (on cards) ── */
.cmp-toggle {
  width: 26px; height: 26px;
  border-radius: 50%;
  border: 1.5px solid #dde3ee;
  background: #f8f9fc;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #9aa3b2;
  transition: all 0.15s;
  flex-shrink: 0;
}
.cmp-toggle:hover:not(:disabled) { border-color: #1a3a8f; color: #1a3a8f; background: #eef2ff; }
.cmp-toggle.active { background: #1a3a8f; border-color: #1a3a8f; color: #fff; }
.cmp-toggle:disabled { opacity: 0.35; cursor: not-allowed; }
.card-comparing { outline: 2px solid #1a3a8f; outline-offset: 2px; }

/* ── HEAT MAP ── */
.heat-legend {
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
  font-size: 12px; color: #6b7490;
  margin-bottom: 16px;
}
.hl-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 3px; }
.hl-tip { margin-left: auto; font-size: 11px; color: #9aa3b2; font-style: italic; }
.heat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
}
.heat-card {
  border-radius: 14px;
  border: 2px solid;
  padding: 16px;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
  position: relative;
  overflow: hidden;
}
.heat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
.heat-card:hover .heat-hover-hint { opacity: 1; }
.heat-hover-hint {
  position: absolute; bottom: 0; left: 0; right: 0;
  background: rgba(26,58,143,0.08);
  text-align: center; font-size: 11px; color: #1a3a8f;
  padding: 4px; opacity: 0; transition: opacity 0.2s;
}
.heat-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
.heat-prov { font-size: 15px; font-weight: 700; color: #1a2448; }
.heat-count { font-size: 12px; background: rgba(26,58,143,0.08); color: #1a3a8f; padding: 2px 8px; border-radius: 20px; font-weight: 600; }
.heat-bar-wrap { background: rgba(0,0,0,0.06); border-radius: 4px; height: 6px; margin-bottom: 10px; overflow: hidden; }
.heat-bar { height: 100%; border-radius: 4px; transition: width 0.5s ease; }
.heat-price-main { font-size: 22px; font-weight: 800; color: #1a2448; line-height: 1.1; }
.heat-price-unit { font-size: 12px; font-weight: 400; color: #6b7490; }
.heat-price-range { font-size: 11px; color: #9aa3b2; margin-top: 2px; margin-bottom: 10px; }
.heat-stats-row { display: flex; align-items: center; gap: 8px; padding-top: 10px; border-top: 1px solid rgba(0,0,0,0.06); }
.heat-stat { text-align: center; flex: 1; }
.heat-stat-div { width: 1px; height: 28px; background: rgba(0,0,0,0.08); }
.hs-val { font-size: 14px; font-weight: 700; color: #1a2448; }
.hs-lbl { font-size: 10px; color: #9aa3b2; margin-top: 1px; }
@media (max-width: 768px) {
  .heat-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .hl-tip { display: none; }
}
@media (max-width: 480px) {
  .heat-grid { grid-template-columns: 1fr; }
}

/* ── COMPARE BAR ── */
.compare-bar {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  background: #0f1f5c;
  color: #fff;
  z-index: 200;
  box-shadow: 0 -4px 24px rgba(15,31,92,0.4);
  padding: 12px 24px;
}
.cbar-inner {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.cbar-slots { display: flex; gap: 10px; flex: 1; flex-wrap: wrap; }
.cbar-item {
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  padding: 6px 10px 6px 12px;
  display: flex; align-items: center; gap: 8px;
  min-width: 140px;
}
.cbar-name { font-size: 13px; font-weight: 600; flex: 1; }
.cbar-price { font-size: 12px; color: #ffd700; font-weight: 700; }
.cbar-remove {
  background: none; border: none; color: rgba(255,255,255,0.5);
  cursor: pointer; font-size: 12px; padding: 0; line-height: 1;
  transition: color 0.15s;
}
.cbar-remove:hover { color: #fff; }
.cbar-empty {
  border: 1.5px dashed rgba(255,255,255,0.2);
  border-radius: 8px;
  padding: 6px 16px;
  font-size: 12px;
  color: rgba(255,255,255,0.4);
  min-width: 120px;
  display: flex; align-items: center; justify-content: center;
}
.cbar-actions { display: flex; gap: 8px; flex-shrink: 0; }
.cbar-clear {
  background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
  color: rgba(255,255,255,0.7); border-radius: 8px; padding: 8px 16px;
  font-family: 'Prompt','Sarabun',sans-serif; font-size: 13px; cursor: pointer;
  transition: background 0.15s;
}
.cbar-clear:hover { background: rgba(255,255,255,0.2); }
.cbar-compare-btn {
  background: #ffd700; border: none; color: #1a2448;
  border-radius: 8px; padding: 8px 20px;
  font-family: 'Prompt','Sarabun',sans-serif; font-size: 13px; font-weight: 700; cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
}
.cbar-compare-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
.cbar-compare-btn:disabled { opacity: 0.4; cursor: not-allowed; }
@media (max-width: 768px) {
  .compare-bar { padding: 10px 16px; }
  .cbar-slots { gap: 8px; }
  .cbar-item { min-width: 0; padding: 5px 8px 5px 10px; }
  .cbar-name { font-size: 11px; max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .cbar-empty { min-width: 80px; }
}

/* ── COMPARE MODAL ── */
.cmp-overlay {
  position: fixed; inset: 0;
  background: rgba(10,20,60,0.6);
  z-index: 300;
  display: flex; align-items: center; justify-content: center;
  padding: 16px;
  backdrop-filter: blur(4px);
}
.cmp-modal {
  background: #fff;
  border-radius: 20px;
  width: 100%; max-width: 860px;
  max-height: 90vh;
  display: flex; flex-direction: column;
  box-shadow: 0 24px 80px rgba(10,20,60,0.3);
  overflow: hidden;
}
.cmp-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 24px 16px;
  border-bottom: 1px solid #e4e8f0;
  background: #f8f9fc;
}
.cmp-title { font-size: 18px; font-weight: 700; color: #1a2448; margin: 0; }
.cmp-close {
  background: none; border: none; font-size: 18px; cursor: pointer; color: #9aa3b2;
  width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  transition: background 0.15s;
}
.cmp-close:hover { background: #f0f2f7; color: #3a4560; }
.cmp-body { flex: 1; overflow: hidden; padding: 16px 24px 20px; }
.cmp-scroll { overflow-x: auto; overflow-y: auto; max-height: calc(90vh - 100px); }
.cmp-table { width: 100%; border-collapse: collapse; min-width: 400px; }
.cmp-row-label {
  padding: 10px 14px 10px 0;
  font-size: 12px; font-weight: 600; color: #9aa3b2;
  white-space: nowrap; width: 120px;
  border-bottom: 1px solid #f0f2f7;
  text-transform: uppercase; letter-spacing: 0.3px;
}
.cmp-col-head {
  padding: 0 12px 12px;
  text-align: center; min-width: 160px;
}
.cmp-col-name { font-size: 15px; font-weight: 700; color: #1a2448; }
.cmp-col-prov { font-size: 12px; color: #9aa3b2; margin-top: 2px; }
.cmp-table tbody td {
  padding: 10px 12px; text-align: center;
  border-bottom: 1px solid #f0f2f7;
  font-size: 14px; color: #2c3550;
}
.cmp-alt td { background: #fafbfd; }
.cmp-num { font-weight: 600; color: #1a2448; }
.cmp-bold { font-weight: 700; }
.cmp-price-row td { padding: 14px 12px; }
.cmp-price-cell { font-size: 22px; font-weight: 800; color: #1a3a8f; }
.cmp-best { color: #16a34a !important; }
.cmp-best::after { content: ' ✓'; font-size: 11px; }
.cmp-worst { color: #dc2626 !important; }

/* ── TRANSITIONS ── */
.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.3s ease, opacity 0.3s ease; }
.slide-up-enter, .slide-up-leave-to { transform: translateY(100%); opacity: 0; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter, .fade-leave-to { opacity: 0; }
</style>
