<template>
  <div class="myroom-app">
    <!-- bg bubbles -->
    <div class="bubbles-bg" ref="bbg"></div>

    <!-- SCREEN 1: INTRO -->
    <div class="screen" :class="{ hidden: currentScreen !== 'intro' }" id="s-intro">
      <div style="text-align:center;position:relative;z-index:2;padding:0 20px">
        <div class="intro-badge">✨ ORIGIN VERTICAL × BRITANIA</div>
        <div class="intro-title">ดีล<span>สิ้ง</span><br>กู้ดดดด
</div>
        <div
          style="background:var(--blue);color:#fff;display:inline-block;padding:6px 20px;border-radius:12px;font-family:'Prompt',sans-serif;font-size:16px;font-weight:600;margin-top:6px;box-shadow:0 4px 14px rgba(59,91,219,0.35)">
          แต่งห้องอยู่เลย !</div>
        <div class="deal-tag" style="margin-top:10px">🏠 ราคาและของแถมพร้อมอยู่ เริ่ม 1.39-35 ล้านบาท</div>
        <div class="intro-chars-row">
          <div v-for="(ch, idx) in introChars" :key="ch.id" class="ic"
            :style="`--icd:${2 + idx * 0.4}s;--icde:${idx * 0.3}s;display:inline-block;transform:scale(0.7);margin:0 -6px`"
            v-html="ch.svg"></div>
        </div>
        <p style="font-size:13px;color:rgba(80,40,0,0.7);margin-top:4px;font-weight:400">ตั้งชื่อ · เลือกตัวละคร ·
          แต่งห้องในฝัน</p>
        <button class="btn-start" @click="goTo('name')">🛋️ เริ่มแต่งห้องเลย!</button>
        <div class="brand-row" style="margin-top:16px;justify-content:center">
          <span style="color:rgba(80,40,0,0.5);font-size:10px;letter-spacing:2px">ORIGIN VERTICAL</span>
          <span style="color:rgba(80,40,0,0.3)">×</span>
          <span style="color:rgba(80,40,0,0.5);font-size:10px;letter-spacing:2px">BRITANIA</span>
        </div>
      </div>
    </div>

    <!-- SCREEN 2: NAME -->
    <div class="screen" :class="{ hidden: currentScreen !== 'name' }" id="s-name">
      <div class="name-card fu">
        <div class="step-pills">
          <div class="sp a"></div>
          <div class="sp"></div>
          <div class="sp"></div>
        </div>
        <div class="char-mini-prev" v-html="namePrevSvg"></div>
        <div class="nc-title">ห้องของคุณชื่ออะไร? 🏡</div>
        <div class="nc-sub">ชื่อนี้จะใช้เป็นชื่อห้องและชื่อตัวละคร</div>
        <input class="name-inp" v-model="uNameInput" type="text" placeholder="พิมชื่อที่นี่..." maxlength="16"
          @keydown.enter="nextName" />
        <div class="greet-bubble">{{ greetText }}</div>
        <button class="btn-next" @click="nextName">ถัดไป →</button>
        <div><button class="btn-back-sm" @click="goTo('intro')">← กลับ</button></div>
      </div>
    </div>

    <!-- SCREEN 3: CHARACTER -->
    <div class="screen" :class="{ hidden: currentScreen !== 'char' }" id="s-char">
      <div class="inner fu">
        <div style="margin-bottom:6px">
          <div class="step-pills" style="justify-content:center;margin-bottom:12px">
            <div class="sp d"></div>
            <div class="sp d"></div>
            <div class="sp a"></div>
          </div>
          <div class="char-section-title">เลือกตัวละครประจำห้อง 🏠</div>
          <div class="char-section-sub">สำหรับห้องของ {{ uName || '...' }}</div>
        </div>
        <div class="char-grid">
          <div v-for="ch in CHARS" :key="ch.id" class="cc" :class="{ sel: selChar === ch.id }" @click="selChar = ch.id">
            <div v-html="ch.svg"></div>
            <div class="cc-name">{{ uName || 'เจ้าของห้อง' }}</div>
            <div class="cc-job">โดย {{ ch.job }}</div>
            <span class="gb" :class="ch.g === 'f' ? 'gb-f' : 'gb-m'">{{ ch.g === 'f' ? 'สไตล์หวาน' : 'สไตล์เท่' }}</span>
          </div>
        </div>
        <div style="display:flex;gap:12px;justify-content:center;margin-top:18px">
          <button @click="goTo('name')"
            style="background:#fff;border:1.5px solid var(--peach3);color:var(--muted);padding:10px 26px;border-radius:50px;font-family:'Prompt',sans-serif;font-size:13px;cursor:pointer">←
            กลับ</button>
          <button class="btn-enter" @click="enterRoom">🏠 เข้าห้องเลย!</button>
        </div>
      </div>
    </div>

    <!-- SCREEN 4: ROOM -->
    <div class="screen" :class="{ hidden: currentScreen !== 'room' }" id="s-room">
      <div class="room-layout">

        <!-- LEFT SIDEBAR -->
        <div class="sl">
          <!-- row 1: user + room styles -->
          <div class="sl-row">
            <div class="user-pill">
              <div class="up-av"
                :style="`border-color:${selectedChar ? selectedChar.c : '#FF8C5A'};background:${selectedChar ? selectedChar.c + '22' : '#FFD4B5'}`">
                <div v-if="selectedChar" v-html="selectedChar.svg"
                  style="transform:scale(0.42);transform-origin:center;margin-top:10px"></div>
              </div>
              <div>
                <div class="up-name">{{ uName || 'ผู้เล่น' }}</div>
                <div class="up-role">นักออกแบบห้อง ✨</div>
              </div>
            </div>
            <div class="sl-title">สไตล์ห้อง</div>
            <button v-for="room in ROOMS" :key="room.id" class="rb" :class="{ active: curRoom === room.id }"
              @click="selRoom(room.id)">
              <div v-html="room.thumb" style="width:100%;height:58px;display:block"></div>
              <div class="rb-lbl">
                <span>{{ room.name }}</span>
                <small>{{ room.label }}</small>
              </div>
            </button>
          </div>

          <!-- row 2: wallpaper -->
          <div class="sl-row">
            <div class="sl-title" style="margin-top:4px">วอลเปเปอร์</div>
            <div class="wp-grid">
              <div v-for="wp in WALLPAPERS" :key="wp.id" class="wpc" :class="{ 'sel-wp': currentWP === wp.id }"
                :title="wp.label" :style="`background:${wp.color} ${wp.pattern}`" @click="setWP(wp.id)">
                <span v-if="wp.id === 'wp0'"
                  style="font-size:9px;color:#ccc;display:flex;height:100%;align-items:center;justify-content:center;">✕</span>
              </div>
            </div>
          </div>

          <div class="sl-footer" style="margin-top:auto;padding-top:6px">
            <button @click="goTo('char')" class="sl-back-btn">← เปลี่ยนตัวละคร</button>
          </div>
        </div>

        <!-- CENTER -->
        <div class="sc">
          <div class="canvas-shell">
          <div class="canvas-wrap">
            <div id="room-cv" ref="roomCv" class="room-cv" :class="curRoom" @dragover.prevent="onDO" @drop="onDrop"
              @dragleave="onDL">
              <div class="wp-overlay" :style="wpOverlayStyle"></div>
              <div class="floor-line"></div>
              <!-- window decoration -->
              <svg style="position:absolute;top:14px;left:28px;opacity:0.5" width="60" height="65" viewBox="0 0 60 65">
                <rect x="1" y="1" width="58" height="63" rx="5" fill="#D4E8F0" />
                <rect x="1" y="1" width="58" height="63" rx="5" fill="none" stroke="rgba(100,150,180,0.4)"
                  stroke-width="2" />
                <line x1="30" y1="1" x2="30" y2="64" stroke="rgba(100,150,180,0.3)" stroke-width="1.5" />
                <line x1="1" y1="33" x2="59" y2="33" stroke="rgba(100,150,180,0.3)" stroke-width="1.5" />
                <rect x="1" y="1" width="58" height="9" rx="4" fill="rgba(100,150,180,0.1)" />
                <rect x="5" y="4" rx="1.5" width="5" height="5" fill="rgba(255,100,100,0.5)" />
                <rect x="13" y="4" rx="1.5" width="5" height="5" fill="rgba(255,200,50,0.5)" />
                <rect x="21" y="4" rx="1.5" width="5" height="5" fill="rgba(50,200,100,0.5)" />
              </svg>
              <div v-show="placed.length === 0" class="drop-hint">ลากเฟอร์นิเจอร์มาวางในห้อง</div>
              <!-- placed items -->
              <div v-for="item in placed" :key="item.id" class="pi" :class="{ sel: selId === item.id }"
                :id="'pi-' + item.id" :style="`left:${item.x}px;top:${item.y}px;width:${item.w}px;height:${item.h}px`"
                @mousedown="startDragItem($event, item)" @touchstart="startDragItem($event, item)" @click.stop="selItem(item.id)">
                <div v-html="getFurnSvg(item.fid)" style="width:100%;height:100%;pointer-events:none"></div>
                <button class="dbtn" @click.stop="delItem(item.id)">✕</button>
                <div class="scale-handle"></div>
              </div>
              <!-- room character -->
              <div v-if="showChar && selectedChar" class="room-char-el"
                :class="{ bob: !charDragging, sel: selId === 'rce-char' }" id="rce-char"
                :style="`left:${charPos.x}px;bottom:${charPos.bottom}px;width:${charW}px;height:${charH}px`"
                @mousedown="startDragChar" @touchstart="startDragChar" @click.stop="selItem('rce-char')">
                <div class="char-name-label">{{ uName || selectedChar.name }}</div>
                <div v-html="selectedChar.svg" style="width:100%;height:100%"></div>
                <button class="dbtn" @click.stop="hideChar">✕</button>
                <div class="scale-handle" style="background:var(--blue)"></div>
              </div>
              <div class="brand-strip"><span>ORIGIN VERTICAL</span><span
                  style="font-size:7px">×</span><span>BRITANIA</span></div>
              <!-- <div
                style="position:absolute;bottom:8px;right:70px;font-family:'Prompt',sans-serif;font-size:9px;color:rgba(100,60,20,0.35)">
                {{ uName ? uName + "'s" : '' }}Room</div> -->
            </div>
          </div>
          </div>
          <div class="cv-ctrl">
            <button class="cbtn" @click="clearAll">🗑 ล้างห้อง</button>
            <button class="cbtn" @click="toggleChar" id="tchar-btn">{{ showChar ? '🤎 ซ่อนตัวละคร' : '🤎 แสดงตัวละคร'
            }}</button>
            <div class="ic-cnt"><span>{{ placed.length }}</span> ชิ้น</div>
          </div>
          <div class="cv-hint">
            <span>💡 คลิก/แตะชิ้นส่วน → ลาก/ย้าย/ปรับขนาด</span>
          </div>
        </div>

        <!-- RIGHT PANEL -->
        <div class="sr">
          <div class="ph">
            <div class="ph-title">
              <span class="ph-icon">🛒</span>
              <span>ของแต่งห้อง</span>
            </div>
            <div class="cat-row">
              <button v-for="cat in CATS" :key="cat.id" class="catpill" :class="{ a: curCat === cat.id }"
                @click="curCat = cat.id">{{ cat.label }}</button>
            </div>
          </div>
          <div class="fg">
            <div v-for="f in filteredFurn" :key="f.id" class="fc"
              draggable="true" @dragstart="dragFurnId = f.id" @click="tapPlace(f.id)">
              <div class="fc-dot"></div>
              <div class="fc-preview">
                <div v-html="f.svg"></div>
              </div>
              <span>{{ f.n }}</span>
            </div>
          </div>
          <div class="pf">
            <span>วางแล้ว</span>
            <strong>{{ placed.length }}</strong>
            <span>ชิ้น</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
const WALLPAPERS = [
  { id: 'wp0', label: 'ไม่มี', color: 'transparent', pattern: '' },
  { id: 'wp1', label: 'ลายดอก', color: '#FFE8E0', pattern: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='3' fill='%23FFB0A0' opacity='0.4'/%3E%3Ccircle cx='20' cy='20' r='8' fill='none' stroke='%23FFB0A0' stroke-width='0.8' opacity='0.3'/%3E%3Ccircle cx='0' cy='0' r='2' fill='%23FFB0A0' opacity='0.3'/%3E%3Ccircle cx='40' cy='0' r='2' fill='%23FFB0A0' opacity='0.3'/%3E%3Ccircle cx='0' cy='40' r='2' fill='%23FFB0A0' opacity='0.3'/%3E%3Ccircle cx='40' cy='40' r='2' fill='%23FFB0A0' opacity='0.3'/%3E%3C/svg%3E")` },
  { id: 'wp2', label: 'ลายตาราง', color: '#F5F0FF', pattern: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='30' height='30' fill='none'/%3E%3Cpath d='M0 0 L30 0 M0 30 L30 30 M0 0 L0 30 M30 0 L30 30' stroke='%23C8B8E0' stroke-width='0.5' opacity='0.5'/%3E%3C/svg%3E")` },
  { id: 'wp3', label: 'ลายอิฐ', color: '#FFF0E8', pattern: `url("data:image/svg+xml,%3Csvg width='60' height='30' viewBox='0 0 60 30' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='1' y='1' width='28' height='13' rx='1' fill='none' stroke='%23E0C0A8' stroke-width='0.8' opacity='0.5'/%3E%3Crect x='31' y='1' width='28' height='13' rx='1' fill='none' stroke='%23E0C0A8' stroke-width='0.8' opacity='0.5'/%3E%3Crect x='16' y='16' width='28' height='13' rx='1' fill='none' stroke='%23E0C0A8' stroke-width='0.8' opacity='0.5'/%3E%3C/svg%3E")` },
  { id: 'wp4', label: 'ลายขาว', color: '#F0F8FF', pattern: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='0' y1='0' x2='0' y2='20' stroke='%23B0CCE0' stroke-width='0.8' opacity='0.5'/%3E%3C/svg%3E")` },
  { id: 'wp5', label: 'ลายหัวใจ', color: '#FFF5F8', pattern: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M16 18 Q20 14 24 18 Q20 22 16 18Z' fill='%23FFB0D0' opacity='0.4'/%3E%3Cpath d='M16 22 Q20 26 24 22 Q20 18 16 22Z' fill='%23FFB0D0' opacity='0.4'/%3E%3Ccircle cx='20' cy='20' r='2' fill='%23FFB0D0' opacity='0.5'/%3E%3C/svg%3E")` },
  { id: 'wp6', label: 'ลายเส้น', color: '#FFFFF0', pattern: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='0' y1='15' x2='30' y2='15' stroke='%23D0D080' stroke-width='0.7' opacity='0.5'/%3E%3C/svg%3E")` },
  { id: 'wp7', label: 'ลายจุด', color: '#F8F0FF', pattern: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='1.5' fill='%23C0A0E0' opacity='0.5'/%3E%3C/svg%3E")` },
]

const CHARS = [
  { id: 'f1', name: 'อาย', job: 'นักออกแบบ', g: 'f', c: '#FF8C69', svg: `<svg width="64" height="88" viewBox="0 0 64 88"><ellipse cx="32" cy="26" rx="15" ry="16" fill="#FFD4AA"/><ellipse cx="32" cy="24" rx="17" ry="11" fill="#E8A878" opacity="0.6"/><circle cx="26" cy="24" r="3" fill="#3A2010"/><circle cx="38" cy="24" r="3" fill="#3A2010"/><circle cx="27" cy="23" r="1.2" fill="white"/><circle cx="39" cy="23" r="1.2" fill="white"/><ellipse cx="32" cy="30" rx="3.5" ry="2" fill="#E88070"/><path d="M28 34 Q32 37 36 34" stroke="#E88070" stroke-width="1.5" fill="none" stroke-linecap="round"/><ellipse cx="26" cy="27" rx="2" ry="1" fill="#FFAAA0" opacity="0.6"/><ellipse cx="38" cy="27" rx="2" ry="1" fill="#FFAAA0" opacity="0.6"/><path d="M17 18 Q32 6 47 18" fill="#8B4513" stroke="#8B4513" stroke-width="0.5"/><path d="M17 18 Q14 25 18 32" stroke="#8B4513" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M47 18 Q50 25 46 32" stroke="#8B4513" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M47 16 Q56 20 48 28" stroke="#8B4513" stroke-width="2" fill="none"/><rect x="20" y="40" width="24" height="30" rx="7" fill="#FF8C69"/><rect x="28" y="46" width="8" height="3" rx="1.5" fill="rgba(255,255,255,0.5)"/><rect x="30" y="52" width="4" height="2" rx="1" fill="rgba(255,255,255,0.3)"/><rect x="14" y="41" width="9" height="20" rx="4.5" fill="#FFB090"/><rect x="41" y="41" width="9" height="20" rx="4.5" fill="#FFB090"/><rect x="20" y="68" width="10" height="16" rx="5" fill="#F0A080"/><rect x="34" y="68" width="10" height="16" rx="5" fill="#F0A080"/><ellipse cx="20" cy="84" rx="6" ry="3" fill="#E09070"/><ellipse cx="44" cy="84" rx="6" ry="3" fill="#E09070"/></svg>` },
  { id: 'f2', name: 'มิ้ง', job: 'นักกฎหมาย', g: 'f', c: '#FF6B9D', svg: `<svg width="64" height="88" viewBox="0 0 64 88"><ellipse cx="32" cy="26" rx="14" ry="15" fill="#FFE0CC"/><circle cx="26" cy="25" r="2.8" fill="#2A1A0A"/><circle cx="38" cy="25" r="2.8" fill="#2A1A0A"/><circle cx="27" cy="24" r="1.1" fill="white"/><circle cx="39" cy="24" r="1.1" fill="white"/><ellipse cx="32" cy="30" rx="3" ry="1.8" fill="#FF9898"/><path d="M28 33 Q32 36 36 33" stroke="#FF9898" stroke-width="1.5" fill="none" stroke-linecap="round"/><ellipse cx="26" cy="28" rx="2" ry="1" fill="#FFAACC" opacity="0.6"/><ellipse cx="38" cy="28" rx="2" ry="1" fill="#FFAACC" opacity="0.6"/><path d="M18 16 Q32 6 46 16 Q48 22 46 28 Q43 18 32 16 Q21 18 18 28 Q16 22 18 16Z" fill="#CC2255"/><path d="M18 16 Q15 12 17 10 Q20 13 18 16Z" fill="#CC2255"/><path d="M46 16 Q49 12 47 10 Q44 13 46 16Z" fill="#CC2255"/><rect x="21" y="40" width="22" height="30" rx="7" fill="#FF6B9D"/><path d="M24 46 L28 50 L32 46 L36 50 L40 46" stroke="rgba(255,255,255,0.4)" stroke-width="1.2" fill="none"/><rect x="15" y="41" width="9" height="20" rx="4.5" fill="#FF9DBD"/><rect x="40" y="41" width="9" height="20" rx="4.5" fill="#FF9DBD"/><rect x="21" y="68" width="10" height="16" rx="5" fill="#E86090"/><rect x="33" y="68" width="10" height="16" rx="5" fill="#E86090"/><ellipse cx="21" cy="84" rx="6" ry="3" fill="#D05080"/><ellipse cx="43" cy="84" rx="6" ry="3" fill="#D05080"/></svg>` },
  { id: 'f3', name: 'กิ้ง', job: 'ศิลปิน', g: 'f', c: '#A8EDEA', svg: `<svg width="64" height="88" viewBox="0 0 64 88"><ellipse cx="32" cy="26" rx="14" ry="15" fill="#FFD4B0"/><circle cx="26" cy="25" r="2.8" fill="#3A2010"/><circle cx="38" cy="25" r="2.8" fill="#3A2010"/><circle cx="27" cy="24" r="1.1" fill="white"/><circle cx="39" cy="24" r="1.1" fill="white"/><ellipse cx="32" cy="30" rx="2.8" ry="1.8" fill="#E09090"/><path d="M29 33 Q32 35 35 33" stroke="#E09090" stroke-width="1.5" fill="none" stroke-linecap="round"/><ellipse cx="26" cy="28" rx="1.8" ry="1" fill="#FF9898" opacity="0.6"/><ellipse cx="38" cy="28" rx="1.8" ry="1" fill="#FF9898" opacity="0.6"/><path d="M18 18 Q21 9 32 11 Q43 9 46 18" fill="#2A4A8A" stroke="#2A4A8A" stroke-width="0.5"/><path d="M18 18 Q16 26 20 31" stroke="#2A4A8A" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M46 18 Q48 26 44 31" stroke="#2A4A8A" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="14" y="18" width="7" height="9" rx="3.5" fill="#2A4A8A"/><rect x="20" y="40" width="24" height="30" rx="7" fill="#64D0D0"/><rect x="25" y="47" width="14" height="3" rx="1.5" fill="rgba(255,255,255,0.5)"/><rect x="15" y="41" width="9" height="20" rx="4.5" fill="#90E0E0"/><rect x="40" y="41" width="9" height="20" rx="4.5" fill="#90E0E0"/><rect x="21" y="68" width="10" height="16" rx="5" fill="#FFD4B0"/><rect x="33" y="68" width="10" height="16" rx="5" fill="#FFD4B0"/><ellipse cx="21" cy="84" rx="6" ry="3" fill="#E0B890"/><ellipse cx="43" cy="84" rx="6" ry="3" fill="#E0B890"/><circle cx="26" cy="27" r="2.2" fill="#FF7070" opacity="0.55"/><circle cx="38" cy="27" r="2.2" fill="#FF7070" opacity="0.55"/></svg>` },
  { id: 'f4', name: 'แพท', job: 'นักกายภาพบำบัด', g: 'f', c: '#7BED9F', svg: `<svg width="64" height="88" viewBox="0 0 64 88"><ellipse cx="32" cy="26" rx="14" ry="15" fill="#FFC8A0"/><circle cx="26" cy="25" r="2.8" fill="#3A2010"/><circle cx="38" cy="25" r="2.8" fill="#3A2010"/><circle cx="27" cy="24" r="1.1" fill="white"/><circle cx="39" cy="24" r="1.1" fill="white"/><path d="M29 33 Q32 35 35 33" stroke="#E08080" stroke-width="1.5" fill="none" stroke-linecap="round"/><ellipse cx="26" cy="28" rx="2" ry="1" fill="#FFAA88" opacity="0.5"/><ellipse cx="38" cy="28" rx="2" ry="1" fill="#FFAA88" opacity="0.5"/><path d="M18 20 Q32 8 46 20" fill="#5A3000" stroke="#5A3000" stroke-width="0.5"/><path d="M18 20 Q16 28 20 34" stroke="#5A3000" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M46 20 Q48 28 44 34" stroke="#5A3000" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="15" cy="16" rx="7" ry="6" fill="#4A8040" opacity="0.8"/><ellipse cx="49" cy="16" rx="7" ry="6" fill="#4A8040" opacity="0.8"/><rect x="21" y="40" width="22" height="30" rx="7" fill="#5A9A50"/><rect x="26" y="47" width="12" height="3" rx="1.5" fill="rgba(255,255,255,0.4)"/><rect x="15" y="41" width="9" height="20" rx="4.5" fill="#7ABA70"/><rect x="40" y="41" width="9" height="20" rx="4.5" fill="#7ABA70"/><rect x="21" y="68" width="10" height="16" rx="5" fill="#FFC8A0"/><rect x="33" y="68" width="10" height="16" rx="5" fill="#FFC8A0"/><ellipse cx="21" cy="84" rx="6" ry="3" fill="#E0A880"/><ellipse cx="43" cy="84" rx="6" ry="3" fill="#E0A880"/></svg>` },
  { id: 'f5', name: 'แก้ว', job: 'นักเดินทาง', g: 'f', c: '#FFD166', svg: `<svg width="64" height="88" viewBox="0 0 64 88"><ellipse cx="32" cy="26" rx="14" ry="15" fill="#FFE8C0"/><circle cx="26" cy="25" r="2.8" fill="#2A1800"/><circle cx="38" cy="25" r="2.8" fill="#2A1800"/><circle cx="27" cy="24" r="1.1" fill="white"/><circle cx="39" cy="24" r="1.1" fill="white"/><ellipse cx="32" cy="30" rx="3" ry="1.8" fill="#E09060"/><path d="M28 33 Q32 36 36 33" stroke="#E09060" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M18 20 Q25 9 32 11 Q39 9 46 20" fill="#C8A000" stroke="#C8A000" stroke-width="0.5"/><path d="M18 20 Q15 28 19 34" stroke="#C8A000" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M46 20 Q49 28 45 34" stroke="#C8A000" stroke-width="3.5" fill="none" stroke-linecap="round"/><rect x="20" y="40" width="24" height="30" rx="7" fill="#FFD166"/><rect x="25" y="47" width="14" height="3" rx="1.5" fill="rgba(255,255,255,0.5)"/><rect x="15" y="41" width="9" height="20" rx="4.5" fill="#FFE090"/><rect x="40" y="41" width="9" height="20" rx="4.5" fill="#FFE090"/><rect x="21" y="68" width="10" height="16" rx="5" fill="#FFE8C0"/><rect x="33" y="68" width="10" height="16" rx="5" fill="#FFE8C0"/><ellipse cx="21" cy="84" rx="6" ry="3" fill="#E8C890"/><ellipse cx="43" cy="84" rx="6" ry="3" fill="#E8C890"/><path d="M23 11 Q32 7 41 11 L39 15 Q32 12 25 15 Z" fill="#FF9900" opacity="0.6"/></svg>` },
  { id: 'm1', name: 'เต', job: 'นักธุรกิจ', g: 'm', c: '#74B9FF', svg: `<svg width="64" height="88" viewBox="0 0 64 88"><ellipse cx="32" cy="26" rx="15" ry="16" fill="#FFD0A0"/><circle cx="25" cy="25" r="3" fill="#2A1800"/><circle cx="39" cy="25" r="3" fill="#2A1800"/><circle cx="26" cy="24" r="1.2" fill="white"/><circle cx="40" cy="24" r="1.2" fill="white"/><path d="M28 33 Q32 35 36 33" stroke="#C08060" stroke-width="1.5" fill="none" stroke-linecap="round"/><ellipse cx="25" cy="29" rx="2" ry="1" fill="#FFB888" opacity="0.5"/><ellipse cx="39" cy="29" rx="2" ry="1" fill="#FFB888" opacity="0.5"/><path d="M17 18 Q32 7 47 18" fill="#3A2000" stroke="#3A2000" stroke-width="0.5"/><path d="M17 18 Q15 24 18 30" stroke="#3A2000" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M47 18 Q49 24 46 30" stroke="#3A2000" stroke-width="3.5" fill="none" stroke-linecap="round"/><rect x="20" y="40" width="24" height="30" rx="5" fill="#2050A0"/><rect x="24" y="40" width="16" height="30" rx="3" fill="#E8E8F0"/><rect x="29" y="41" width="6" height="11" rx="2" fill="#2050A0"/><line x1="32" y1="40" x2="32" y2="70" stroke="#2050A0" stroke-width="0.8" opacity="0.4"/><rect x="14" y="41" width="9" height="21" rx="4.5" fill="#2A60C0"/><rect x="41" y="41" width="9" height="21" rx="4.5" fill="#2A60C0"/><rect x="21" y="68" width="10" height="17" rx="5" fill="#2A2030"/><rect x="33" y="68" width="10" height="17" rx="5" fill="#2A2030"/><ellipse cx="21" cy="85" rx="6" ry="3" fill="#1A1020"/><ellipse cx="43" cy="85" rx="6" ry="3" fill="#1A1020"/></svg>` },
  { id: 'm2', name: 'กอ', job: 'นักดนตรี', g: 'm', c: '#A29BFE', svg: `<svg width="64" height="88" viewBox="0 0 64 88"><ellipse cx="32" cy="26" rx="15" ry="16" fill="#FFC890"/><circle cx="25" cy="25" r="3.2" fill="#2A1800"/><circle cx="39" cy="25" r="3.2" fill="#2A1800"/><circle cx="26" cy="24" r="1.3" fill="white"/><circle cx="40" cy="24" r="1.3" fill="white"/><path d="M28 34 Q32 37 36 34" stroke="#C07050" stroke-width="1.5" fill="none" stroke-linecap="round"/><ellipse cx="25" cy="29" rx="2.2" ry="1.2" fill="#FFB090" opacity="0.5"/><ellipse cx="39" cy="29" rx="2.2" ry="1.2" fill="#FFB090" opacity="0.5"/><path d="M17 17 Q23 7 32 9 Q41 7 47 17" fill="#1A1A1A" stroke="#1A1A1A" stroke-width="0.5"/><path d="M17 17 Q15 25 18 32" stroke="#1A1A1A" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M47 17 Q49 25 46 32" stroke="#1A1A1A" stroke-width="4" fill="none" stroke-linecap="round"/><rect x="20" y="40" width="24" height="30" rx="7" fill="#6C5CE7"/><rect x="24" y="46" width="16" height="3" rx="1.5" fill="rgba(255,255,255,0.4)"/><rect x="26" y="52" width="12" height="2" rx="1" fill="rgba(255,255,255,0.3)"/><rect x="14" y="41" width="9" height="21" rx="4.5" fill="#8880F0"/><rect x="41" y="41" width="9" height="21" rx="4.5" fill="#8880F0"/><rect x="21" y="68" width="10" height="17" rx="5" fill="#1A1A1A"/><rect x="33" y="68" width="10" height="17" rx="5" fill="#1A1A1A"/><ellipse cx="21" cy="85" rx="6" ry="3" fill="#0A0A0A"/><ellipse cx="43" cy="85" rx="6" ry="3" fill="#0A0A0A"/></svg>` },
  { id: 'm3', name: 'เอง', job: 'เชฟ', g: 'm', c: '#FD79A8', svg: `<svg width="64" height="88" viewBox="0 0 64 88"><ellipse cx="32" cy="26" rx="14" ry="15" fill="#FFE0C0"/><circle cx="25" cy="25" r="2.8" fill="#3A2010"/><circle cx="39" cy="25" r="2.8" fill="#3A2010"/><circle cx="26" cy="24" r="1.1" fill="white"/><circle cx="40" cy="24" r="1.1" fill="white"/><path d="M29 33 Q32 35 35 33" stroke="#D08060" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M23 20 Q32 15 41 20 L43 11 Q32 7 21 11 Z" fill="white" opacity="0.9"/><path d="M17 26 Q19 20 23 20" stroke="#C0A060" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M47 26 Q45 20 41 20" stroke="#C0A060" stroke-width="2.5" fill="none" stroke-linecap="round"/><rect x="21" y="40" width="22" height="30" rx="5" fill="#E8E8E8"/><rect x="26" y="47" width="12" height="2" rx="1" fill="#C0C0C0"/><rect x="26" y="52" width="12" height="2" rx="1" fill="#C0C0C0"/><rect x="15" y="41" width="9" height="21" rx="4.5" fill="#F0F0F0"/><rect x="40" y="41" width="9" height="21" rx="4.5" fill="#F0F0F0"/><rect x="21" y="68" width="10" height="17" rx="5" fill="#2A2020"/><rect x="33" y="68" width="10" height="17" rx="5" fill="#2A2020"/><ellipse cx="21" cy="85" rx="6" ry="3" fill="#1A1010"/><ellipse cx="43" cy="85" rx="6" ry="3" fill="#1A1010"/></svg>` },
  { id: 'm4', name: 'แจมส์', job: 'นักกีฬา', g: 'm', c: '#00CEC9', svg: `<svg width="64" height="88" viewBox="0 0 64 88"><ellipse cx="32" cy="26" rx="15" ry="15" fill="#FFCC99"/><circle cx="24" cy="25" r="3.2" fill="#3A2010"/><circle cx="40" cy="25" r="3.2" fill="#3A2010"/><circle cx="25" cy="24" r="1.3" fill="white"/><circle cx="41" cy="24" r="1.3" fill="white"/><path d="M28 34 Q32 38 36 34" stroke="#C08060" stroke-width="1.7" fill="none" stroke-linecap="round"/><ellipse cx="24" cy="29" rx="2.2" ry="1.2" fill="#FFAA78" opacity="0.5"/><ellipse cx="40" cy="29" rx="2.2" ry="1.2" fill="#FFAA78" opacity="0.5"/><path d="M17 19 Q32 8 47 19" fill="#4A3010" stroke="#4A3010" stroke-width="0.5"/><path d="M17 19 Q14 26 16 33" stroke="#4A3010" stroke-width="4.5" fill="none" stroke-linecap="round"/><path d="M47 19 Q50 26 48 33" stroke="#4A3010" stroke-width="4.5" fill="none" stroke-linecap="round"/><rect x="19" y="40" width="26" height="30" rx="7" fill="#00A0A0"/><path d="M19 51 L45 51" stroke="rgba(255,255,255,0.35)" stroke-width="2.5"/><rect x="13" y="40" width="9" height="22" rx="4.5" fill="#00C0C0"/><rect x="42" y="40" width="9" height="22" rx="4.5" fill="#00C0C0"/><rect x="20" y="68" width="10" height="17" rx="5" fill="#2A2020"/><rect x="34" y="68" width="10" height="17" rx="5" fill="#2A2020"/><ellipse cx="20" cy="85" rx="6" ry="3" fill="#1A1010"/><ellipse cx="44" cy="85" rx="6" ry="3" fill="#1A1010"/><path d="M25 45 L32 42 L39 45" stroke="rgba(255,255,255,0.5)" stroke-width="1.2" fill="none"/></svg>` },
  { id: 'm5', name: 'ลีโอ', job: 'วิศวกร', g: 'm', c: '#FDCB6E', svg: `<svg width="64" height="88" viewBox="0 0 64 88"><ellipse cx="32" cy="26" rx="14" ry="15" fill="#FFD4AA"/><circle cx="25" cy="25" r="2.8" fill="#2A1800"/><circle cx="39" cy="25" r="2.8" fill="#2A1800"/><circle cx="26" cy="24" r="1.1" fill="white"/><circle cx="40" cy="24" r="1.1" fill="white"/><path d="M29 33 Q32 35 35 33" stroke="#C09070" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M18 20 Q32 9 46 20" fill="#5C4010" stroke="#5C4010" stroke-width="0.5"/><path d="M18 20 Q16 27 19 33" stroke="#5C4010" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M46 20 Q48 27 45 33" stroke="#5C4010" stroke-width="3.5" fill="none" stroke-linecap="round"/><rect x="20" y="15" width="24" height="7" rx="3" fill="#5C4010" opacity="0.55"/><rect x="20" y="40" width="24" height="30" rx="5" fill="#E8A820"/><rect x="24" y="46" width="6" height="5" rx="1" fill="rgba(255,255,255,0.4)"/><rect x="32" y="46" width="6" height="5" rx="1" fill="rgba(255,255,255,0.4)"/><rect x="24" y="54" width="16" height="2" rx="1" fill="rgba(255,255,255,0.3)"/><rect x="14" y="41" width="9" height="21" rx="4.5" fill="#FFC030"/><rect x="41" y="41" width="9" height="21" rx="4.5" fill="#FFC030"/><rect x="20" y="68" width="10" height="17" rx="5" fill="#3A3030"/><rect x="34" y="68" width="10" height="17" rx="5" fill="#3A3030"/><ellipse cx="20" cy="85" rx="6" ry="3" fill="#2A2020"/><ellipse cx="44" cy="85" rx="6" ry="3" fill="#2A2020"/></svg>` },
]

const FURN = [
  { id: 's1', n: 'โซฟาเมจิร์', cat: 'sofa', w: 130, h: 60, compat: ['r-modern', 'r-cozy'], svg: `<svg width="130" height="60" viewBox="0 0 130 60"><rect x="3" y="12" width="124" height="44" rx="9" fill="#E8C4A0"/><rect x="3" y="20" width="14" height="34" rx="7" fill="#F0D0B0"/><rect x="113" y="20" width="14" height="34" rx="7" fill="#F0D0B0"/><rect x="5" y="26" width="120" height="22" rx="7" fill="#F8DCC0"/><line x1="46" y1="26" x2="46" y2="48" stroke="#E0C0A0" stroke-width="1.5"/><line x1="84" y1="26" x2="84" y2="48" stroke="#E0C0A0" stroke-width="1.5"/><rect x="3" y="8" width="124" height="8" rx="4" fill="#D8B490"/></svg>` },
  { id: 's2', n: 'โซฟา L-Shape', cat: 'sofa', w: 130, h: 90, compat: ['r-modern', 'r-loft'], svg: `<svg width="130" height="90" viewBox="0 0 130 90"><rect x="3" y="30" width="124" height="55" rx="8" fill="#C8D0E0"/><rect x="3" y="38" width="13" height="44" rx="6.5" fill="#D8E0F0"/><rect x="114" y="38" width="13" height="44" rx="6.5" fill="#D8E0F0"/><rect x="5" y="44" width="118" height="34" rx="6" fill="#E0E8F8"/><rect x="60" y="3" width="67" height="35" rx="8" fill="#C8D0E0"/><rect x="60" y="11" width="13" height="26" rx="6.5" fill="#D8E0F0"/><rect x="3" y="26" width="127" height="8" rx="4" fill="#B8C0D0"/></svg>` },
  { id: 's3', n: 'เก้าอี้อี้กำมะหยี่', cat: 'sofa', w: 65, h: 65, compat: ['r-modern', 'r-cozy', 'r-fresh'], svg: `<svg width="65" height="65" viewBox="0 0 65 65"><rect x="5" y="18" width="55" height="42" rx="9" fill="#C0A8D8"/><rect x="5" y="24" width="11" height="34" rx="5.5" fill="#CEB8E0"/><rect x="49" y="24" width="11" height="34" rx="5.5" fill="#CEB8E0"/><rect x="7" y="30" width="51" height="24" rx="6" fill="#D8C8E8"/><rect x="5" y="14" width="55" height="8" rx="4" fill="#B898C8"/><line x1="10" y1="58" x2="10" y2="64" stroke="#906888" stroke-width="3" stroke-linecap="round"/><line x1="55" y1="58" x2="55" y2="64" stroke="#906888" stroke-width="3" stroke-linecap="round"/></svg>` },
  { id: 's4', n: 'โซฟาหวาย', cat: 'sofa', w: 120, h: 55, compat: ['r-cozy', 'r-fresh'], svg: `<svg width="120" height="55" viewBox="0 0 120 55"><rect x="5" y="12" width="110" height="40" rx="10" fill="#C8A870"/><rect x="5" y="18" width="12" height="32" rx="6" fill="#D8B880"/><rect x="103" y="18" width="12" height="32" rx="6" fill="#D8B880"/><rect x="7" y="22" width="106" height="24" rx="7" fill="#E0C888"/><line x1="42" y1="22" x2="42" y2="46" stroke="#C0A860" stroke-width="1"/><line x1="78" y1="22" x2="78" y2="46" stroke="#C0A860" stroke-width="1"/><line x1="10" y1="50" x2="14" y2="55" stroke="#A08848" stroke-width="2.5" stroke-linecap="round"/><line x1="106" y1="50" x2="110" y2="55" stroke="#A08848" stroke-width="2.5" stroke-linecap="round"/></svg>` },
  { id: 's5', n: 'โซฟากำมะหยี่', cat: 'sofa', w: 120, h: 55, compat: ['r-cozy', 'r-loft'], svg: `<svg width="120" height="55" viewBox="0 0 120 55"><rect x="4" y="11" width="112" height="42" rx="8" fill="#90B890"/><rect x="4" y="18" width="12" height="33" rx="6" fill="#A0C8A0"/><rect x="104" y="18" width="12" height="33" rx="6" fill="#A0C8A0"/><rect x="6" y="24" width="108" height="22" rx="6" fill="#B0D8B0"/><line x1="43" y1="24" x2="43" y2="46" stroke="#80A880" stroke-width="1.2"/><line x1="77" y1="24" x2="77" y2="46" stroke="#80A880" stroke-width="1.2"/></svg>` },
  { id: 't1', n: 'โต๊ะกระจก', cat: 'table', w: 95, h: 42, compat: ['r-modern'], svg: `<svg width="95" height="42" viewBox="0 0 95 42"><rect x="3" y="6" width="89" height="15" rx="4" fill="#B8D8F0" opacity="0.8"/><rect x="3" y="6" width="89" height="15" rx="4" fill="none" stroke="#90C0E0" stroke-width="1.2"/><rect x="6" y="9" width="83" height="7" rx="2" fill="#D0E8F8" opacity="0.5"/><rect x="8" y="19" width="3" height="20" rx="1.5" fill="#90C0D8"/><rect x="84" y="19" width="3" height="20" rx="1.5" fill="#90C0D8"/></svg>` },
  { id: 't2', n: 'โต๊ะไม้ขา V', cat: 'table', w: 90, h: 48, compat: ['r-cozy', 'r-modern'], svg: `<svg width="90" height="48" viewBox="0 0 90 48"><rect x="4" y="5" width="82" height="14" rx="5" fill="#D4A870"/><path d="M14 17 L8 44" stroke="#A87840" stroke-width="3" stroke-linecap="round"/><path d="M76 17 L82 44" stroke="#A87840" stroke-width="3" stroke-linecap="round"/><path d="M20 17 L14 44" stroke="#A87840" stroke-width="3" stroke-linecap="round"/><path d="M70 17 L76 44" stroke="#A87840" stroke-width="3" stroke-linecap="round"/></svg>` },
  { id: 't3', n: 'โต๊ะกลมไม้', cat: 'table', w: 72, h: 72, compat: ['r-cozy', 'r-fresh'], svg: `<svg width="72" height="72" viewBox="0 0 72 72"><ellipse cx="36" cy="24" rx="30" ry="13" fill="#C8A870"/><ellipse cx="36" cy="22" rx="30" ry="13" fill="#D8B880"/><line x1="36" y1="35" x2="36" y2="62" stroke="#A87840" stroke-width="3" stroke-linecap="round"/><ellipse cx="36" cy="64" rx="8" ry="3" fill="#986830"/></svg>` },
  { id: 't4', n: 'โต๊ะเตี้ยไม้', cat: 'table', w: 100, h: 36, compat: ['r-cozy', 'r-loft'], svg: `<svg width="100" height="36" viewBox="0 0 100 36"><rect x="3" y="5" width="94" height="18" rx="5" fill="#A88040"/><rect x="5" y="7" width="90" height="5" rx="3" fill="#C09858" opacity="0.5"/><rect x="6" y="21" width="8" height="13" rx="3" fill="#886028"/><rect x="86" y="21" width="8" height="13" rx="3" fill="#886028"/></svg>` },
  { id: 't5', n: 'โต๊ะกาแฟ', cat: 'table', w: 88, h: 38, compat: ['r-modern', 'r-fresh', 'r-loft'], svg: `<svg width="88" height="38" viewBox="0 0 88 38"><rect x="4" y="6" width="80" height="14" rx="4" fill="#B0C8E0"/><rect x="6" y="8" width="76" height="6" rx="2" fill="#C8E0F0" opacity="0.5"/><rect x="8" y="18" width="4" height="17" rx="2" fill="#90A8C0"/><rect x="76" y="18" width="4" height="17" rx="2" fill="#90A8C0"/><rect x="20" y="26" width="48" height="2.5" rx="1.2" fill="#90A8C0" opacity="0.5"/></svg>` },
  { id: 'st1', n: 'ตู้วางของ', cat: 'storage', w: 80, h: 105, compat: ['r-modern', 'r-loft'], svg: `<svg width="80" height="105" viewBox="0 0 80 105"><rect x="3" y="3" width="74" height="99" rx="5" fill="#D8C8B0"/><rect x="7" y="8" width="66" height="18" rx="3" fill="#E8D8C0"/><rect x="7" y="32" width="66" height="18" rx="3" fill="#E8D8C0"/><rect x="7" y="56" width="66" height="18" rx="3" fill="#E8D8C0"/><rect x="7" y="80" width="66" height="18" rx="3" fill="#E8D8C0"/><rect x="10" y="11" width="12" height="12" rx="2" fill="#E08060"/><rect x="26" y="11" width="9" height="12" rx="2" fill="#6080C0"/><rect x="39" y="11" width="14" height="12" rx="2" fill="#70A870"/><rect x="10" y="35" width="18" height="12" rx="2" fill="#A07050"/><rect x="32" y="35" width="11" height="12" rx="2" fill="#9070C0"/></svg>` },
  { id: 'st2', n: 'ตู้เมิ้ม', cat: 'storage', w: 72, h: 72, compat: ['r-cozy', 'r-loft'], svg: `<svg width="72" height="72" viewBox="0 0 72 72"><rect x="3" y="3" width="66" height="66" rx="6" fill="#C8B090"/><line x1="3" y1="36" x2="69" y2="36" stroke="#B09878" stroke-width="1.5"/><circle cx="36" cy="20" r="4.5" fill="#A08868"/><circle cx="36" cy="53" r="4.5" fill="#A08868"/><line x1="10" y1="68" x2="10" y2="70" stroke="#A08868" stroke-width="5" stroke-linecap="round"/><line x1="62" y1="68" x2="62" y2="70" stroke="#A08868" stroke-width="5" stroke-linecap="round"/></svg>` },
  { id: 'st3', n: 'ตั้งหนังสือ', cat: 'storage', w: 78, h: 98, compat: ['r-modern', 'r-fresh', 'r-cozy'], svg: `<svg width="78" height="98" viewBox="0 0 78 98"><rect x="3" y="3" width="72" height="92" rx="4" fill="#E0D0BC"/><rect x="7" y="8" width="64" height="16" rx="2" fill="#EEE0CC"/><rect x="7" y="30" width="64" height="16" rx="2" fill="#EEE0CC"/><rect x="7" y="52" width="64" height="16" rx="2" fill="#EEE0CC"/><rect x="7" y="74" width="64" height="16" rx="2" fill="#EEE0CC"/><rect x="11" y="11" width="9" height="10" rx="1" fill="#E07050"/><rect x="23" y="11" width="7" height="10" rx="1" fill="#5080B0"/><rect x="34" y="11" width="11" height="10" rx="1" fill="#70A870"/><rect x="11" y="33" width="14" height="10" rx="1" fill="#A07050"/><rect x="29" y="33" width="8" height="10" rx="1" fill="#9060B0"/></svg>` },
  { id: 'st4', n: 'ตู้เบิร์ช', cat: 'storage', w: 70, h: 90, compat: ['r-modern', 'r-fresh'], svg: `<svg width="70" height="90" viewBox="0 0 70 90"><rect x="3" y="3" width="64" height="84" rx="5" fill="#D0E8F0"/><rect x="3" y="3" width="64" height="84" rx="5" fill="none" stroke="#A8C8E0" stroke-width="1.5"/><line x1="35" y1="3" x2="35" y2="87" stroke="#A8C8E0" stroke-width="1"/><line x1="3" y1="45" x2="67" y2="45" stroke="#A8C8E0" stroke-width="1"/><rect x="6" y="7" width="26" height="34" rx="2" fill="#B8D8E8" opacity="0.4"/><rect x="38" y="7" width="26" height="34" rx="2" fill="#B8D8E8" opacity="0.4"/><circle cx="26" cy="43" r="3" fill="#90B8D0"/><circle cx="44" cy="43" r="3" fill="#90B8D0"/></svg>` },
  { id: 'l1', n: 'โคมพื้น', cat: 'light', w: 38, h: 90, compat: ['r-modern', 'r-cozy', 'r-loft'], svg: `<svg width="38" height="90" viewBox="0 0 38 90"><line x1="19" y1="28" x2="19" y2="80" stroke="#B0A090" stroke-width="2.5"/><ellipse cx="19" cy="82" rx="12" ry="4.5" fill="#A09080"/><path d="M5 13 L33 13 L29 28 L9 28 Z" fill="#F0E8D0"/><ellipse cx="19" cy="13" rx="14" ry="5" fill="#F8F0E0"/><circle cx="19" cy="21" r="3.5" fill="#FFD890" opacity="0.9"/></svg>` },
  { id: 'l2', n: 'โคมเพดาน', cat: 'light', w: 50, h: 65, compat: ['r-modern', 'r-cozy', 'r-fresh', 'r-loft'], svg: `<svg width="50" height="65" viewBox="0 0 50 65"><line x1="25" y1="2" x2="25" y2="20" stroke="#B0A090" stroke-width="1.5"/><path d="M10 20 L40 20 L34 46 L16 46 Z" fill="#E8D0B0"/><ellipse cx="25" cy="46" rx="9" ry="3.5" fill="#D8C0A0"/><circle cx="25" cy="33" r="4" fill="#FFD890" opacity="0.85"/><ellipse cx="25" cy="20" rx="15" ry="4.5" fill="#E0C8A8"/></svg>` },
  { id: 'l3', n: 'โคมตั้งโต๊ะ', cat: 'light', w: 34, h: 52, compat: ['r-modern', 'r-cozy', 'r-fresh', 'r-loft'], svg: `<svg width="34" height="52" viewBox="0 0 34 52"><ellipse cx="17" cy="48" rx="11" ry="3.5" fill="#B0A090"/><line x1="17" y1="28" x2="17" y2="48" stroke="#C0B098" stroke-width="2.5"/><path d="M4 12 L30 12 L26 28 L8 28 Z" fill="#FFE8B0"/><ellipse cx="17" cy="12" rx="13" ry="4" fill="#FFF0C0"/><circle cx="17" cy="20" r="3" fill="#FFD060" opacity="0.9"/></svg>` },
  { id: 'l4', n: 'โคมลอยดาว', cat: 'light', w: 60, h: 32, compat: ['r-modern', 'r-cozy', 'r-fresh'], svg: `<svg width="60" height="32" viewBox="0 0 60 32"><line x1="30" y1="2" x2="30" y2="12" stroke="#B0A090" stroke-width="1.5"/><ellipse cx="30" cy="22" rx="26" ry="10" fill="#F0E0C0"/><ellipse cx="30" cy="19" rx="22" ry="8" fill="#F8ECD0"/><circle cx="30" cy="19" r="4" fill="#FFD890" opacity="0.85"/></svg>` },
  { id: 'd1', n: 'ต้นไม้ใหญ่', cat: 'decor', w: 52, h: 95, compat: ['r-modern', 'r-cozy', 'r-fresh'], svg: `<svg width="52" height="95" viewBox="0 0 52 95"><rect x="19" y="62" width="14" height="31" rx="5" fill="#8A6030"/><rect x="13" y="58" width="26" height="8" rx="4" fill="#7A5020"/><ellipse cx="26" cy="40" rx="20" ry="26" fill="#4A8040"/><ellipse cx="15" cy="54" rx="14" ry="18" fill="#5A9050" opacity="0.75"/><ellipse cx="37" cy="51" rx="14" ry="17" fill="#5A9050" opacity="0.7"/><ellipse cx="26" cy="26" rx="12" ry="17" fill="#6AA060"/></svg>` },
  { id: 'd2', n: 'กระถางดอกไม้', cat: 'decor', w: 38, h: 55, compat: ['r-modern', 'r-cozy', 'r-fresh', 'r-loft'], svg: `<svg width="38" height="55" viewBox="0 0 38 55"><path d="M11 30 L9 50 L29 50 L27 30 Z" fill="#E0906A"/><rect x="8" y="26" width="22" height="6" rx="3" fill="#F0A07A"/><ellipse cx="19" cy="19" rx="11" ry="12" fill="#5A8850"/><ellipse cx="13" cy="23" rx="7" ry="9" fill="#6A9860" opacity="0.8"/><ellipse cx="25" cy="22" rx="7" ry="9" fill="#6A9860" opacity="0.75"/><ellipse cx="19" cy="12" rx="5" ry="5" fill="#FFB0D0"/><ellipse cx="14" cy="16" rx="4" ry="4" fill="#FFD0E0" opacity="0.8"/><ellipse cx="24" cy="16" rx="4" ry="4" fill="#FFD0E0" opacity="0.8"/></svg>` },
  { id: 'd3', n: 'พรมกลม', cat: 'decor', w: 130, h: 65, compat: ['r-modern', 'r-cozy', 'r-fresh', 'r-loft'], svg: `<svg width="130" height="65" viewBox="0 0 130 65"><ellipse cx="65" cy="32" rx="60" ry="28" fill="#F0C8A0" opacity="0.7"/><ellipse cx="65" cy="32" rx="48" ry="22" fill="#E8B890" stroke="#D8A880" stroke-width="1" opacity="0.8"/><ellipse cx="65" cy="32" rx="32" ry="15" fill="#F0C0A0" opacity="0.9"/><ellipse cx="65" cy="32" rx="16" ry="7" fill="#E0B090"/></svg>` },
  { id: 'd4', n: 'ภาพวาดแต่งห้อง', cat: 'decor', w: 80, h: 58, compat: ['r-modern', 'r-cozy', 'r-fresh', 'r-loft'], svg: `<svg width="80" height="58" viewBox="0 0 80 58"><rect x="3" y="3" width="74" height="52" rx="5" fill="#FFF8F0"/><rect x="3" y="3" width="74" height="52" rx="5" fill="none" stroke="#E0C8A8" stroke-width="2.5"/><ellipse cx="28" cy="30" rx="14" ry="16" fill="#FFD4B0" opacity="0.6"/><ellipse cx="52" cy="22" rx="10" ry="11" fill="#FFB0C8" opacity="0.5"/><ellipse cx="55" cy="38" rx="12" ry="10" fill="#B0D4FF" opacity="0.5"/><rect x="8" y="8" width="24" height="2" rx="1" fill="#E0C8A8" opacity="0.5"/></svg>` },
  { id: 'd5', n: 'กระจกกลม', cat: 'decor', w: 58, h: 58, compat: ['r-modern', 'r-cozy', 'r-fresh'], svg: `<svg width="58" height="58" viewBox="0 0 58 58"><circle cx="29" cy="29" r="26" fill="#D0E8F0" opacity="0.6"/><circle cx="29" cy="29" r="26" fill="none" stroke="#B0C8D8" stroke-width="3"/><circle cx="29" cy="29" r="20" fill="#E8F4FA" opacity="0.5"/><ellipse cx="21" cy="20" rx="6" ry="3" fill="white" opacity="0.5" transform="rotate(-30 21 20)"/></svg>` },
  { id: 'd6', n: 'โต๊ะเครื่องแป้ง', cat: 'decor', w: 72, h: 78, compat: ['r-modern', 'r-cozy', 'r-fresh'], svg: `<svg width="72" height="78" viewBox="0 0 72 78"><rect x="8" y="30" width="56" height="44" rx="5" fill="#E8D8C8"/><rect x="12" y="33" width="48" height="26" rx="3" fill="#C8E0F0" opacity="0.7"/><rect x="12" y="33" width="48" height="26" rx="3" fill="none" stroke="#A8C8E0" stroke-width="1"/><line x1="36" y1="33" x2="36" y2="59" stroke="#A8C8E0" stroke-width="1"/><rect x="14" y="62" width="18" height="9" rx="2" fill="#D8C8B8"/><rect x="40" y="62" width="18" height="9" rx="2" fill="#D8C8B8"/><circle cx="23" cy="67" r="2.5" fill="#C0B0A0"/><circle cx="49" cy="67" r="2.5" fill="#C0B0A0"/><line x1="11" y1="74" x2="11" y2="78" stroke="#C0B0A0" stroke-width="4" stroke-linecap="round"/><line x1="61" y1="74" x2="61" y2="78" stroke="#C0B0A0" stroke-width="4" stroke-linecap="round"/></svg>` },
  { id: 'd7', n: 'เก้าอี้โต๊ะ', cat: 'decor', w: 52, h: 62, compat: ['r-modern', 'r-cozy', 'r-fresh', 'r-loft'], svg: `<svg width="52" height="62" viewBox="0 0 52 62"><rect x="6" y="18" width="40" height="30" rx="8" fill="#FFCCAA"/><rect x="6" y="24" width="9" height="22" rx="4.5" fill="#FFD8B8"/><rect x="37" y="24" width="9" height="22" rx="4.5" fill="#FFD8B8"/><rect x="8" y="30" width="36" height="14" rx="5" fill="#FFE0C0"/><rect x="6" y="14" width="40" height="8" rx="4" fill="#F0C098"/><line x1="10" y1="46" x2="10" y2="60" stroke="#E0A878" stroke-width="3.5" stroke-linecap="round"/><line x1="42" y1="46" x2="42" y2="60" stroke="#E0A878" stroke-width="3.5" stroke-linecap="round"/></svg>` },
  { id: 'p_cat1', n: 'แมวสีส้ม', cat: 'pet', w: 62, h: 44, compat: ['r-modern', 'r-cozy', 'r-fresh', 'r-loft'], svg: `<svg width="62" height="44" viewBox="0 0 62 44"><ellipse cx="32" cy="28" rx="22" ry="12" fill="#F6A04D"/><circle cx="16" cy="20" r="11" fill="#FFB35C"/><path d="M9 12 L12 3 L18 11" fill="#FFB35C"/><path d="M20 11 L26 3 L25 14" fill="#FFB35C"/><circle cx="12" cy="20" r="2.2" fill="#2D1B00"/><circle cx="20" cy="20" r="2.2" fill="#2D1B00"/><path d="M15 24 Q16 26 17 24" stroke="#8B4A1F" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M50 24 Q61 17 57 8" stroke="#F6A04D" stroke-width="6" fill="none" stroke-linecap="round"/><ellipse cx="25" cy="38" rx="5" ry="3" fill="#D98236"/><ellipse cx="43" cy="38" rx="5" ry="3" fill="#D98236"/><path d="M30 22 L42 22 M31 27 L45 27" stroke="#E28A3E" stroke-width="2" stroke-linecap="round" opacity="0.7"/></svg>` },
  { id: 'p_dog1', n: 'น้องหมาอารีกี้', cat: 'pet', w: 70, h: 48, compat: ['r-modern', 'r-cozy', 'r-fresh', 'r-loft'], svg: `<svg width="70" height="48" viewBox="0 0 70 48"><ellipse cx="38" cy="29" rx="24" ry="13" fill="#D99042"/><circle cx="18" cy="22" r="13" fill="#E8A858"/><path d="M7 17 Q2 20 6 30 Q11 26 12 18" fill="#B96F2A"/><path d="M27 17 Q34 19 31 29 Q25 26 24 18" fill="#B96F2A"/><ellipse cx="15" cy="25" rx="7" ry="5" fill="#FFF0D8"/><circle cx="14" cy="21" r="2" fill="#2D1B00"/><circle cx="23" cy="21" r="2" fill="#2D1B00"/><circle cx="18" cy="25" r="2" fill="#3A2010"/><path d="M16 28 Q18 30 21 28" stroke="#8B4A1F" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M59 25 Q68 19 65 13" stroke="#D99042" stroke-width="5" fill="none" stroke-linecap="round"/><rect x="24" y="37" width="7" height="9" rx="3" fill="#B96F2A"/><rect x="48" y="37" width="7" height="9" rx="3" fill="#B96F2A"/></svg>` },
  { id: 'p_rabbit1', n: 'กระต่ายขาว', cat: 'pet', w: 54, h: 58, compat: ['r-modern', 'r-cozy', 'r-fresh', 'r-loft'], svg: `<svg width="54" height="58" viewBox="0 0 54 58"><ellipse cx="30" cy="38" rx="18" ry="15" fill="#FFF8F0"/><ellipse cx="18" cy="25" rx="12" ry="11" fill="#FFFFFF"/><path d="M12 17 Q8 0 16 2 Q22 9 18 18" fill="#FFFFFF"/><path d="M23 17 Q28 1 34 4 Q34 15 26 20" fill="#FFFFFF"/><path d="M14 7 Q14 16 16 18" stroke="#FFB3D1" stroke-width="3" stroke-linecap="round"/><path d="M29 8 Q27 16 25 19" stroke="#FFB3D1" stroke-width="3" stroke-linecap="round"/><circle cx="15" cy="25" r="2" fill="#2D1B00"/><circle cx="23" cy="25" r="2" fill="#2D1B00"/><ellipse cx="19" cy="29" rx="2.5" ry="1.6" fill="#FFB3D1"/><circle cx="45" cy="36" r="6" fill="#FFFFFF"/><ellipse cx="23" cy="51" rx="6" ry="3" fill="#E8E0D8"/><ellipse cx="38" cy="51" rx="6" ry="3" fill="#E8E0D8"/></svg>` },
  { id: 'p_bird1', n: 'นกแก้ว', cat: 'pet', w: 48, h: 62, compat: ['r-modern', 'r-cozy', 'r-fresh', 'r-loft'], svg: `<svg width="48" height="62" viewBox="0 0 48 62"><ellipse cx="25" cy="30" rx="13" ry="18" fill="#42C9A3"/><circle cx="23" cy="17" r="12" fill="#55D6B0"/><path d="M32 18 L45 21 L32 25 Z" fill="#FFD166"/><circle cx="20" cy="15" r="2.2" fill="#2D1B00"/><path d="M15 27 Q8 34 12 45 Q20 38 23 30" fill="#3B5BDB" opacity="0.75"/><path d="M31 31 Q39 37 36 48 Q28 41 26 31" fill="#FF6B9D" opacity="0.75"/><path d="M22 46 L18 58 M29 46 L31 58" stroke="#8B6040" stroke-width="2.5" stroke-linecap="round"/><path d="M12 58 H36" stroke="#8B6040" stroke-width="3" stroke-linecap="round"/></svg>` },
  { id: 'p_bed1', n: 'เบาะสัตว์เลี้ยง', cat: 'pet', w: 88, h: 38, compat: ['r-modern', 'r-cozy', 'r-fresh', 'r-loft'], svg: `<svg width="88" height="38" viewBox="0 0 88 38"><ellipse cx="44" cy="22" rx="38" ry="14" fill="#FFD4B5"/><ellipse cx="44" cy="20" rx="30" ry="10" fill="#FFF0E0"/><path d="M23 18 Q44 8 65 18" stroke="#FF8C5A" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.55"/><circle cx="34" cy="20" r="2" fill="#FF8C5A" opacity="0.45"/><circle cx="52" cy="20" r="2" fill="#FF8C5A" opacity="0.45"/></svg>` },
  { id: 'p_bowl1', n: 'ชามอาหาร', cat: 'pet', w: 48, h: 28, compat: ['r-modern', 'r-cozy', 'r-fresh', 'r-loft'], svg: `<svg width="48" height="28" viewBox="0 0 48 28"><ellipse cx="24" cy="18" rx="20" ry="8" fill="#74B9FF"/><path d="M7 14 H41 L36 26 H12 Z" fill="#3B5BDB"/><ellipse cx="24" cy="14" rx="17" ry="6" fill="#D0D9FF"/><circle cx="18" cy="13" r="2" fill="#8B6040"/><circle cx="25" cy="12" r="2.2" fill="#8B6040"/><circle cx="31" cy="14" r="1.8" fill="#8B6040"/></svg>` },
]

const ROOMS = [
  { id: 'r-modern', name: 'Modern Warm', label: 'โมเดิร์น', thumb: `<svg viewBox="0 0 170 58"><rect width="170" height="58" fill="#FFF5EE"/><rect width="170" height="34" fill="#FFF8F5"/><line x1="0" y1="34" x2="170" y2="34" stroke="#E8C8B0" stroke-width="1"/><rect x="18" y="16" width="64" height="20" rx="6" fill="#F0C8A8"/><rect x="96" y="10" width="44" height="28" rx="3" fill="#E8D0C0"/></svg>` },
  { id: 'r-cozy', name: 'Cozy Natural', label: 'โคซี่', thumb: `<svg viewBox="0 0 170 58"><rect width="170" height="58" fill="#FFF0E0"/><rect width="170" height="33" fill="#FFF5EC"/><line x1="0" y1="33" x2="170" y2="33" stroke="#DCC0A0" stroke-width="1"/><rect x="15" y="14" width="68" height="21" rx="8" fill="#E8B890"/><ellipse cx="130" cy="26" rx="18" ry="20" fill="#7A9A68" opacity="0.8"/></svg>` },
  { id: 'r-fresh', name: 'Fresh Mint', label: 'สดใส', thumb: `<svg viewBox="0 0 170 58"><rect width="170" height="58" fill="#F0FFF5"/><rect width="170" height="34" fill="#F5FFF8"/><line x1="0" y1="34" x2="170" y2="34" stroke="#B0D8B8" stroke-width="1"/><rect x="20" y="16" width="62" height="20" rx="6" fill="#A8D8B8"/><circle cx="138" cy="20" r="8" fill="#88CC98" opacity="0.7"/></svg>` },
  { id: 'r-loft', name: 'Nordic Loft', label: 'นอร์ดิก', thumb: `<svg viewBox="0 0 170 58"><rect width="170" height="58" fill="#F5F3EE"/><rect width="170" height="34" fill="#F8F6F2"/><line x1="0" y1="0" x2="170" y2="0" stroke="#D8C8B0" stroke-width="5"/><rect x="12" y="18" width="72" height="20" rx="4" fill="#C8B8A0"/></svg>` },
]

const CATS = [
  { id: 'all', label: 'ทั้งหมด' },
  { id: 'sofa', label: 'โซฟา' },
  { id: 'table', label: 'โต๊ะ' },
  { id: 'storage', label: 'ตู้เก็บของ' },
  { id: 'light', label: 'ไฟสว่าง' },
  { id: 'decor', label: 'ตกแต่ง' },
  { id: 'pet', label: 'สัตว์เลี้ยง' },
]

export default {
  name: 'MyRoom',
  data() {
    return {
      CHARS,
      FURN,
      ROOMS,
      CATS,
      WALLPAPERS,
      currentScreen: 'intro',
      uNameInput: '',
      selChar: null,
      curRoom: 'r-modern',
      curCat: 'all',
      currentWP: 'wp0',
      placed: [],
      selId: null,
      showChar: true,
      dragFurnId: null,
      charPos: { x: 240, bottom: 0 },
      charW: 64,
      charH: 88,
      charDragging: false,
    }
  },
  computed: {
    uName() {
      return this.uNameInput.trim()
    },
    greetText() {
      return this.uName ? `✨ สวัสดี ${this.uName}! ห้องสวยรอคุณอยู่` : '🏠 ยินดีต้อนรับ!'
    },
    selectedChar() {
      return CHARS.find(c => c.id === this.selChar) || null
    },
    introChars() {
      return [CHARS[0], CHARS[2], CHARS[5], CHARS[7], CHARS[9]]
    },
    namePrevSvg() {
      if (!this.selChar) return ''
      const ch = CHARS.find(c => c.id === this.selChar)
      return ch ? `<div style="transform:scale(0.75);animation:charBob 3s ease-in-out infinite">${ch.svg}</div>` : ''
    },
    filteredFurn() {
      return this.curCat === 'all' ? FURN : FURN.filter(f => f.cat === this.curCat)
    },
    wpOverlayStyle() {
      const wp = WALLPAPERS.find(w => w.id === this.currentWP)
      if (!wp || wp.id === 'wp0') return 'background:transparent'
      return `background:${wp.color} ${wp.pattern}`
    },
  },
  mounted() {
    this.initBubbles()
    document.addEventListener('click', this.onDocClick)
    document.addEventListener('keydown', this.onKeyDown)
    this.$nextTick(() => {
      this.resetCharPos()
    })
  },
  beforeDestroy() {
    document.removeEventListener('click', this.onDocClick)
    document.removeEventListener('keydown', this.onKeyDown)
  },
  methods: {
    initBubbles() {
      const b = this.$refs.bbg
      if (!b) return
      const cols = ['#FF8C5A', '#FFB085', '#FFD4B5', '#FF6B9D', '#FFD93D', '#74B9FF']
      for (let i = 0; i < 12; i++) {
        const d = document.createElement('div')
        d.className = 'bub'
        const s = 40 + Math.random() * 120
        d.style.cssText = `width:${s}px;height:${s}px;top:${Math.random() * 100}%;left:${Math.random() * 100}%;background:${cols[i % cols.length]};--bd:${6 + Math.random() * 6}s;--bde:${Math.random() * 4}s`
        b.appendChild(d)
      }
    },
    goTo(screen) {
      this.currentScreen = screen
      if (screen === 'room') {
        this.$nextTick(() => this.resetCharPos())
      }
    },
    nextName() {
      if (!this.uNameInput.trim()) this.uNameInput = 'นักออกแบบ'
      this.goTo('char')
    },
    enterRoom() {
      if (!this.selChar) this.selChar = 'f1'
      this.goTo('room')
    },
    selRoom(id) {
      this.curRoom = id
    },
    setWP(id) {
      this.currentWP = id
    },
    getFurnSvg(fid) {
      const f = FURN.find(x => x.id === fid)
      return f ? f.svg : ''
    },
    resetCharPos() {
      const cv = this.$refs.roomCv
      if (!cv) return
      this.charPos = { x: Math.round(cv.offsetWidth / 2) - 32, bottom: Math.round(cv.offsetHeight * 0.41) }
    },
    onDO() {
      if (this.$refs.roomCv) this.$refs.roomCv.style.outline = '2px dashed rgba(255,107,43,0.4)'
    },
    onDL() {
      if (this.$refs.roomCv) this.$refs.roomCv.style.outline = ''
    },
    onDrop(e) {
      e.preventDefault()
      if (this.$refs.roomCv) this.$refs.roomCv.style.outline = ''
      if (!this.dragFurnId) return
      const cv = this.$refs.roomCv
      const r = cv.getBoundingClientRect()
      const f = FURN.find(x => x.id === this.dragFurnId)
      if (!f) return
      const x = Math.max(0, Math.min(e.clientX - r.left - f.w / 2, r.width - f.w))
      const y = Math.max(0, Math.min(e.clientY - r.top - f.h / 2, r.height - f.h))
      this.placed.push({ id: Date.now(), fid: f.id, x, y, w: f.w, h: f.h })
      this.dragFurnId = null
    },
    delItem(id) {
      this.placed = this.placed.filter(p => p.id !== id)
      if (this.selId === id) this.selId = null
    },
    clearAll() {
      this.placed = []
      this.selId = null
    },
    selItem(id) {
      this.selId = id
    },
    hideChar() {
      this.showChar = false
      if (this.selId === 'rce-char') this.selId = null
    },
    toggleChar() {
      this.showChar = !this.showChar
      if (this.showChar) this.$nextTick(() => this.resetCharPos())
    },
    onDocClick(e) {
      if (!e.target.closest('.pi') && !e.target.closest('.room-char-el')) {
        this.selId = null
      }
    },
    onKeyDown(e) {
      if (this.currentScreen !== 'room') return
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (this.selId === 'rce-char') this.hideChar()
        else if (this.selId) this.delItem(this.selId)
      }
    },
    startDragItem(e, item) {
      if (e.target.classList.contains('dbtn')) return
      e.preventDefault()
      this.selId = item.id

      const pt = e.touches ? e.touches[0] : e
      const getXY = ev => ev.touches ? { x: ev.touches[0].clientX, y: ev.touches[0].clientY }
                                     : { x: ev.clientX, y: ev.clientY }
      const addListeners = (mv, up) => {
        document.addEventListener('mousemove', mv)
        document.addEventListener('mouseup', up)
        document.addEventListener('touchmove', mv, { passive: false })
        document.addEventListener('touchend', up)
      }
      const removeListeners = (mv, up) => {
        document.removeEventListener('mousemove', mv)
        document.removeEventListener('mouseup', up)
        document.removeEventListener('touchmove', mv)
        document.removeEventListener('touchend', up)
      }

      if (e.target.classList.contains('scale-handle')) {
        const f = FURN.find(fi => fi.id === item.fid)
        if (!f) return
        const sx = pt.clientX, sw = item.w, ratio = f.h / f.w
        const mv = ev => {
          ev.preventDefault()
          const { x } = getXY(ev)
          const nw = Math.max(30, Math.min(300, sw + (x - sx)))
          this.$set(item, 'w', nw)
          this.$set(item, 'h', Math.round(nw * ratio))
        }
        const up = () => removeListeners(mv, up)
        addListeners(mv, up)
        return
      }

      const cv = this.$refs.roomCv
      const r = cv.getBoundingClientRect()
      const scale = r.width / 580
      const ox = (pt.clientX - r.left) / scale - item.x
      const oy = (pt.clientY - r.top) / scale - item.y
      const mv = ev => {
        ev.preventDefault()
        const { x, y } = getXY(ev)
        this.$set(item, 'x', Math.max(0, Math.min((x - r.left) / scale - ox, 580 - item.w)))
        this.$set(item, 'y', Math.max(0, Math.min((y - r.top) / scale - oy, 420 - item.h)))
      }
      const up = () => removeListeners(mv, up)
      addListeners(mv, up)
    },
    startDragChar(e) {
      if (e.target.classList.contains('dbtn')) return
      e.preventDefault()
      this.selId = 'rce-char'

      const pt = e.touches ? e.touches[0] : e
      const getXY = ev => ev.touches ? { x: ev.touches[0].clientX, y: ev.touches[0].clientY }
                                     : { x: ev.clientX, y: ev.clientY }
      const addListeners = (mv, up) => {
        document.addEventListener('mousemove', mv)
        document.addEventListener('mouseup', up)
        document.addEventListener('touchmove', mv, { passive: false })
        document.addEventListener('touchend', up)
      }
      const removeListeners = (mv, up) => {
        document.removeEventListener('mousemove', mv)
        document.removeEventListener('mouseup', up)
        document.removeEventListener('touchmove', mv)
        document.removeEventListener('touchend', up)
      }

      if (e.target.classList.contains('scale-handle')) {
        const sx = pt.clientX, sw = this.charW
        const mv = ev => {
          ev.preventDefault()
          const x = ev.touches ? ev.touches[0].clientX : ev.clientX
          const nw = Math.max(32, Math.min(200, sw + (x - sx)))
          this.charW = nw
          this.charH = Math.round(nw * 88 / 64)
        }
        const up = () => removeListeners(mv, up)
        addListeners(mv, up)
        return
      }

      this.charDragging = true
      const cv = this.$refs.roomCv
      const r = cv.getBoundingClientRect()
      const scale = r.width / 580
      const ox = (pt.clientX - r.left) / scale - this.charPos.x
      const oy = (r.bottom - pt.clientY) / scale - this.charPos.bottom
      const mv = ev => {
        ev.preventDefault()
        const { x, y } = getXY(ev)
        this.charPos.x = Math.max(0, Math.min((x - r.left) / scale - ox, 580 - this.charW))
        this.charPos.bottom = Math.max(0, Math.min(420 - this.charH, (r.bottom - y) / scale - oy))
      }
      const up = () => {
        this.charDragging = false
        removeListeners(mv, up)
      }
      addListeners(mv, up)
    },
    tapPlace(fid) {
      const cv = this.$refs.roomCv
      if (!cv) return
      const f = FURN.find(x => x.id === fid)
      if (!f) return
      const x = Math.max(0, Math.round((580 - f.w) / 2))
      const y = Math.max(0, Math.round(420 * 0.55 - f.h))
      this.placed.push({ id: Date.now(), fid: f.id, x, y, w: f.w, h: f.h })
    },
  },
}
</script>

<style scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0
}

.myroom-app {
  --peach: #FF8C5A;
  --peach2: #FFB085;
  --peach3: #FFD4B5;
  --orange: #FF6B2B;
  --orange2: #FF9554;
  --yellow: #FFD93D;
  --yellow2: #FFF0A0;
  --pink: #FF6B9D;
  --pink2: #FFB3D1;
  --blue: #3B5BDB;
  --blue2: #748FFC;
  --blue3: #D0D9FF;
  --cream: #FFF8F0;
  --cream2: #FFF3E8;
  --cream3: #FFE8D0;
  --text: #2D1B00;
  --muted: #8B6040;
  --white: #FFFFFF;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: 'Prompt', sans-serif;
  background: var(--cream2);
  color: var(--text);
}

.bubbles-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden
}

.bub {
  position: absolute;
  border-radius: 50%;
  opacity: 0.12;
  animation: bubFloat var(--bd, 8s) ease-in-out infinite var(--bde, 0s)
}

@keyframes bubFloat {

  0%,
  100% {
    transform: translateY(0) scale(1)
  }

  50% {
    transform: translateY(-30px) scale(1.05)
  }
}

.screen {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: opacity 0.5s ease, transform 0.5s ease
}

.screen.hidden {
  opacity: 0;
  pointer-events: none;
  transform: translateY(16px)
}

/* INTRO */
#s-intro {
  background: linear-gradient(160deg, #FF8C5A 0%, #FFB085 35%, #FFD4B5 65%, #FFF0E0 100%)
}

.intro-badge {
  background: var(--blue);
  color: #fff;
  padding: 6px 20px;
  border-radius: 20px;
  font-family: 'Prompt', sans-serif;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 1px;
  margin-bottom: 16px;
  box-shadow: 0 4px 14px rgba(59, 91, 219, 0.3)
}

.intro-title {
  font-family: 'Prompt', sans-serif;
  font-size: 58px;
  font-weight: 700;
  color: #fff;
  line-height: 1;
  text-shadow: 0 4px 20px rgba(255, 107, 43, 0.4);
  letter-spacing: -1px
}

.intro-title span {
  color: var(--yellow);
  -webkit-text-stroke: 2px rgba(255, 180, 0, 0.4)
}

.deal-tag {
  background: var(--yellow);
  color: var(--text);
  padding: 8px 20px;
  border-radius: 12px;
  font-family: 'Prompt', sans-serif;
  font-size: 13px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(255, 217, 61, 0.4)
}

.intro-chars-row {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 8px;
  margin: 20px 0 4px
}

.ic {
  animation: icBob var(--icd, 2.5s) ease-in-out infinite var(--icde, 0s)
}

@keyframes icBob {

  0%,
  100% {
    transform: translateY(0)
  }

  50% {
    transform: translateY(-8px)
  }
}

.btn-start {
  background: var(--blue);
  color: #fff;
  border: none;
  padding: 16px 52px;
  border-radius: 50px;
  font-family: 'Prompt', sans-serif;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 24px;
  letter-spacing: 0.5px;
  box-shadow: 0 8px 28px rgba(59, 91, 219, 0.4);
  transition: all 0.25s
}

.btn-start:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 36px rgba(59, 91, 219, 0.5)
}

/* NAME */
#s-name {
  background: linear-gradient(160deg, #FFD4B5, #FFF8F0)
}

.name-card {
  background: #fff;
  border-radius: 28px;
  padding: 44px 52px;
  width: 460px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(255, 107, 43, 0.2)
}

.step-pills {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-bottom: 28px
}

.sp {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #FFD4B5
}

.sp.a {
  background: var(--orange);
  width: 26px;
  border-radius: 4px
}

.sp.d {
  background: var(--peach2)
}

.nc-title {
  font-family: 'Prompt', sans-serif;
  font-size: 26px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 4px
}

.nc-sub {
  font-size: 13px;
  color: var(--muted);
  margin-bottom: 28px;
  font-weight: 300
}

.char-mini-prev {
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px
}

.name-inp {
  width: 100%;
  padding: 14px 20px;
  background: var(--cream2);
  border: 2.5px solid var(--peach3);
  border-radius: 16px;
  font-family: 'Prompt', sans-serif;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  outline: none;
  color: var(--text);
  transition: all 0.3s
}

.name-inp:focus {
  border-color: var(--orange);
  box-shadow: 0 0 0 4px rgba(255, 140, 90, 0.15)
}

.greet-bubble {
  margin-top: 14px;
  background: var(--cream2);
  border: 1.5px solid var(--peach3);
  padding: 7px 18px;
  border-radius: 20px;
  font-size: 13px;
  color: var(--orange);
  display: inline-block
}

.btn-next {
  background: linear-gradient(135deg, var(--orange), var(--peach));
  color: #fff;
  border: none;
  padding: 13px 44px;
  border-radius: 50px;
  font-family: 'Prompt', sans-serif;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 22px;
  box-shadow: 0 6px 20px rgba(255, 107, 43, 0.35);
  transition: all 0.25s
}

.btn-next:hover {
  transform: translateY(-2px)
}

.btn-back-sm {
  background: none;
  border: none;
  color: var(--muted);
  font-family: 'Prompt', sans-serif;
  font-size: 12px;
  cursor: pointer;
  margin-top: 10px;
  padding: 4px 8px
}

/* CHAR */
#s-char {
  background: linear-gradient(160deg, #FFD4B5 0%, #FFF8F0 60%)
}

#s-char .inner {
  width: min(920px, 96vw);
  text-align: center
}

.char-section-title {
  font-family: 'Prompt', sans-serif;
  font-size: 26px;
  font-weight: 700;
  color: var(--text)
}

.char-section-sub {
  font-size: 13px;
  color: var(--muted);
  margin-top: 2px;
  margin-bottom: 20px
}

.char-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-top: 4px
}

.cc {
  background: #fff;
  border: 2.5px solid var(--peach3);
  border-radius: 20px;
  padding: 14px 8px 12px;
  cursor: pointer;
  text-align: center;
  transition: all 0.22s
}

.cc:hover {
  border-color: var(--orange);
  transform: translateY(-4px);
  box-shadow: 0 10px 28px rgba(255, 107, 43, 0.2)
}

.cc.sel {
  border-color: var(--orange);
  background: linear-gradient(160deg, #FFF3EC, #FFF8F5);
  box-shadow: 0 0 0 4px rgba(255, 107, 43, 0.18)
}

.cc-name {
  font-family: 'Prompt', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  margin-top: 6px
}

.cc-job {
  font-size: 10px;
  color: var(--muted);
  margin-top: 1px
}

.gb {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 9px;
  font-weight: 600;
  margin-top: 4px
}

.gb-f {
  background: #FFE8F3;
  color: var(--pink)
}

.gb-m {
  background: #E8EDFF;
  color: var(--blue)
}

.btn-enter {
  background: linear-gradient(135deg, var(--blue), var(--blue2));
  color: #fff;
  border: none;
  padding: 14px 48px;
  border-radius: 50px;
  font-family: 'Prompt', sans-serif;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(59, 91, 219, 0.35);
  transition: all 0.25s
}

.btn-enter:hover {
  transform: translateY(-2px)
}

/* ROOM */
#s-room {
  align-items: stretch;
  justify-content: stretch;
  padding: 0;
  overflow: hidden
}

.room-layout {
  display: grid;
  grid-template-columns: 190px 1fr 260px;
  height: 100vh;
  width: 100%
}

/* LEFT */
.sl {
  background: #fff;
  border-right: 1.5px solid var(--peach3);
  padding: 14px 10px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px
}

/* sl-row: transparent on desktop, visible row on mobile */
.sl-row {
  display: contents
}

.user-pill {
  background: linear-gradient(135deg, var(--peach3), var(--yellow2));
  border-radius: 16px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 2px
}

.up-av {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 2.5px solid var(--orange);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0
}

.up-name {
  font-family: 'Prompt', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis
}

.up-role {
  font-size: 10px;
  color: var(--muted)
}

.sl-title {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.8px;
  text-transform: uppercase;
  color: var(--muted);
  padding: 0 4px;
  margin-top: 4px
}

.wp-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
  margin-top: 4px
}

.wpc {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  cursor: pointer;
  border: 2.5px solid transparent;
  transition: all 0.2s;
  position: relative
}

.wpc:hover {
  transform: scale(1.1)
}

.wpc.sel-wp {
  border-color: var(--orange);
  box-shadow: 0 0 0 2px rgba(255, 107, 43, 0.25)
}

.rb {
  background: var(--cream2);
  border: 2px solid var(--peach3);
  border-radius: 12px;
  padding: 0;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.2s;
  text-align: left;
  width: 100%
}

.rb:hover {
  border-color: var(--orange);
  transform: translateX(2px)
}

.rb.active {
  border-color: var(--orange);
  box-shadow: 0 0 0 3px rgba(255, 107, 43, 0.15);
  background: linear-gradient(135deg, #FFF3EC, #FFF8F5)
}

.rb-lbl {
  padding: 6px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center
}

.rb-lbl span {
  font-family: 'Prompt', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: var(--text)
}

.rb-lbl small {
  font-size: 10px;
  color: var(--muted)
}

.sl-back-btn {
  width: 100%;
  background: none;
  border: 1.5px solid var(--peach3);
  padding: 7px;
  border-radius: 10px;
  font-family: 'Prompt', sans-serif;
  font-size: 11px;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.2s
}

.sl-back-btn:hover {
  border-color: var(--orange);
  color: var(--orange)
}

/* CENTER */
.sc {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--cream3);
  position: relative;
  overflow: hidden
}

.canvas-wrap {
  position: relative;
  box-shadow: 0 16px 60px rgba(255, 107, 43, 0.25), 0 0 0 2px rgba(255, 140, 90, 0.2);
  border-radius: 14px
}

.room-cv {
  width: 580px;
  height: 420px;
  border-radius: 14px;
  position: relative;
  overflow: hidden;
  cursor: default
}

.room-cv.r-modern {
  background: linear-gradient(180deg, #FFF5EE 0%, #FFF5EE 58%, #F0DDD0 58%)
}

.room-cv.r-cozy {
  background: linear-gradient(180deg, #FFF0E0 0%, #FFF0E0 58%, #E8CDB8 58%)
}

.room-cv.r-fresh {
  background: linear-gradient(180deg, #F0FFF5 0%, #F0FFF5 58%, #D8EED5 58%)
}

.room-cv.r-loft {
  background: linear-gradient(180deg, #F5F3EE 0%, #F5F3EE 58%, #E0D8CE 58%)
}

.wp-overlay {
  position: absolute;
  inset: 0 0 42% 0;
  pointer-events: none;
  opacity: 0.6
}

.floor-line {
  position: absolute;
  left: 0;
  right: 0;
  top: 58%;
  height: 1.5px;
  background: rgba(180, 120, 60, 0.12);
  pointer-events: none
}

.pi {
  position: absolute;
  cursor: grab;
  user-select: none;
  z-index: 10;
  transition: filter 0.15s
}

.pi /deep/ svg,
.room-char-el /deep/ svg {
  width: 100%;
  height: 100%;
  display: block
}

.pi:hover {
  filter: brightness(1.05) drop-shadow(0 4px 10px rgba(255, 107, 43, 0.3))
}

.pi.sel {
  filter: drop-shadow(0 0 6px rgba(255, 107, 43, 0.7))
}

.pi .dbtn {
  position: absolute;
  top: 3px;
  right: 3px;
  width: 20px;
  height: 20px;
  background: #FF4444;
  border: 2px solid #fff;
  border-radius: 50%;
  color: #fff;
  font-size: 9px;
  cursor: pointer;
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 20;
  line-height: 1
}

.pi.sel .dbtn {
  display: flex
}

.scale-handle {
  position: absolute;
  bottom: 3px;
  right: 3px;
  width: 18px;
  height: 18px;
  background: var(--orange);
  border: 2px solid #fff;
  border-radius: 50%;
  cursor: se-resize;
  display: none;
  z-index: 21
}

.pi.sel .scale-handle {
  display: block
}

.drop-hint {
  position: absolute;
  bottom: 18px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: rgba(180, 120, 60, 0.5);
  pointer-events: none;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 6px
}

.cv-ctrl {
  margin-top: 12px;
  display: flex;
  gap: 8px;
  align-items: center
}

.cv-hint {
  font-size: 11px;
  color: var(--muted);
  margin-top: 6px;
  display: flex;
  gap: 14px
}

.cbtn {
  background: #fff;
  border: 1.5px solid var(--peach3);
  padding: 6px 14px;
  border-radius: 20px;
  font-family: 'Prompt', sans-serif;
  font-size: 12px;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap
}

.cbtn:hover {
  border-color: var(--orange);
  color: var(--orange);
  background: #FFF3EC
}

.ic-cnt {
  font-size: 11px;
  color: var(--muted);
  margin-left: auto
}

/* ROOM CHAR */
.room-char-el {
  position: absolute;
  cursor: grab;
  user-select: none;
  z-index: 8
}

.room-char-el.sel {
  filter: drop-shadow(0 0 6px rgba(59, 91, 219, 0.6))
}

.room-char-el .dbtn {
  position: absolute;
  top: 3px;
  right: 3px;
  width: 20px;
  height: 20px;
  background: #FF4444;
  border: 2px solid #fff;
  border-radius: 50%;
  color: #fff;
  font-size: 9px;
  cursor: pointer;
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 20
}

.room-char-el.sel .dbtn {
  display: flex
}

.room-char-el .scale-handle {
  position: absolute;
  bottom: 3px;
  right: 3px;
  width: 18px;
  height: 18px;
  border: 2px solid #fff;
  border-radius: 50%;
  cursor: se-resize;
  display: none;
  z-index: 21
}

.room-char-el.sel .scale-handle {
  display: block
}

@keyframes charBob {

  0%,
  100% {
    transform: translateY(0)
  }

  50% {
    transform: translateY(-5px)
  }
}

.bob {
  animation: charBob 3s ease-in-out infinite
}

.char-name-label {
  position: absolute;
  top: -22px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--orange);
  color: #fff;
  padding: 2px 10px;
  border-radius: 10px;
  font-family: 'Prompt', sans-serif;
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(255, 107, 43, 0.4);
  pointer-events: none
}

.char-name-label::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  border: 3px solid transparent;
  border-top-color: var(--orange)
}

/* RIGHT */
.sr {
  background: #fff;
  border-left: 1.5px solid var(--peach3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100vh
}

.ph {
  flex-shrink: 0;
  padding: 14px 14px 0;
  border-bottom: 1.5px solid var(--peach3);
  background: #fff
}

.ph-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px
}

.ph-icon {
  font-size: 16px
}

.ph-title span:last-child {
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
  font-family: 'Prompt', sans-serif
}

.cat-row {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  padding-bottom: 10px
}

.catpill {
  background: none;
  border: 1.5px solid var(--peach3);
  padding: 4px 10px;
  border-radius: 20px;
  font-family: 'Prompt', sans-serif;
  font-size: 11px;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap
}

.catpill:hover {
  border-color: var(--orange);
  color: var(--orange)
}

.catpill.a {
  background: var(--orange);
  border-color: var(--orange);
  color: #fff;
  font-weight: 600
}

.fg {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  align-content: start;
  scrollbar-width: thin;
  scrollbar-color: var(--peach3) transparent
}

.fc {
  background: var(--cream2);
  border: 1.5px solid var(--peach3);
  border-radius: 12px;
  padding: 8px 6px 7px;
  cursor: grab;
  text-align: center;
  transition: all 0.22s;
  position: relative;
  overflow: hidden;
  height: 150px;
}

.fc:hover {
  border-color: var(--orange);
  background: #FFF3EC;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 107, 43, 0.15)
}


.fc-preview {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden
}

.fc-preview > div {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center
}

.fc-preview /deep/ svg {
  width: 100%;
  height: 100%;
  display: block
}

.fc span {
  font-size: 10px;
  color: var(--muted);
  display: block;
  margin-top: 4px;
  line-height: 1.3;
  font-family: 'Prompt', sans-serif;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis
}

.fc-dot {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #4CAF50
}


.pf {
  flex-shrink: 0;
  padding: 10px 14px;
  border-top: 1.5px solid var(--peach3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: var(--muted);
  background: #fff
}

.pf strong {
  color: var(--text);
  font-size: 15px;
  font-family: 'Prompt', sans-serif
}

.brand-strip {
  position: absolute;
  bottom: 8px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: 0.4;
  pointer-events: none
}

.brand-strip span {
  font-family: 'Prompt', sans-serif;
  font-size: 9px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: 1px
}

.fu {
  animation: fadeUp 0.45s ease forwards
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(24px)
  }

  to {
    opacity: 1;
    transform: translateY(0)
  }
}

/* canvas-shell: constrains scaled canvas to its visual height */
.canvas-shell {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  flex-shrink: 0
}

/* ── Tablet (768–1023px) ── */
@media (max-width: 1023px) {
  .room-layout {
    grid-template-columns: 140px 1fr 200px
  }
}

@media (max-width: 920px) {
  /* canvas 580px won't fit center column — scale it down */
  .canvas-shell {
    height: 294px; /* 420 * 0.7 */
    overflow: hidden
  }
  .canvas-wrap {
    transform: scale(0.7);
    transform-origin: top center
  }
}

/* ── Mobile (<768px): stack vertically ── */
@media (max-width: 767px) {
  /* Screen 2: name */
  .name-card {
    width: min(460px, 92vw);
    padding: 32px 20px
  }

  /* Screen 3: char — allow scrolling */
  #s-char {
    justify-content: flex-start;
    overflow-y: auto;
    padding: 20px 0 24px;
    -webkit-overflow-scrolling: touch
  }
  .char-grid {
    grid-template-columns: repeat(3, 1fr)
  }

  /* Room screen — fill viewport exactly */
  #s-room { overflow: hidden }
  .room-layout {
    display: flex;
    flex-direction: column;
    height: 100dvh;
    overflow: hidden
  }

  /* LEFT → 2 rows stacked */
  .sl {
    order: 1;
    border-right: none;
    border-bottom: 1.5px solid var(--peach3);
    flex-direction: column;
    overflow: hidden;
    height: auto;
    padding: 6px 10px;
    gap: 0;
    flex-shrink: 0;
    background: linear-gradient(180deg, #fff 50%, var(--cream2) 100%)
  }

  /* each sl-row = scrollable horizontal strip */
  .sl-row {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    gap: 6px;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 4px 0;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch
  }
  .sl-row::-webkit-scrollbar { display: none }
  .sl-row + .sl-row { border-top: 1px dashed var(--peach3) }

  /* label → orange badge pill */
  .sl-title {
    display: inline-flex;
    align-items: center;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.5px;
    color: var(--orange);
    background: var(--cream3);
    padding: 2px 7px;
    border-radius: 8px;
    flex-shrink: 0;
    white-space: nowrap;
    margin-top: 0;
    text-transform: uppercase
  }

  .user-pill {
    flex-shrink: 0;
    margin-bottom: 0;
    padding: 2px 8px 2px 2px;
    gap: 5px;
    border-radius: 20px
  }
  .up-av { width: 26px; height: 26px }
  .up-name { font-size: 11px }
  .up-role { display: none }

  /* room buttons: thumbnail only */
  .rb { flex-shrink: 0; width: 54px; min-width: 54px; border-radius: 8px }
  .rb > div { height: 36px !important }
  .rb-lbl { display: none }

  .wp-grid {
    display: flex;
    flex-wrap: nowrap;
    flex-shrink: 0;
    gap: 5px;
    margin: 0
  }
  .wpc { width: 24px; height: 24px; border-radius: 6px }
  .sl-footer { display: none }

  /* CENTER canvas — flex:1 fills remaining space, no transparent gap */
  .sc {
    order: 2;
    flex: 1;
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 4px 0
  }
  /* scale = 390/580 ≈ 0.67, fits most phones */
  .canvas-shell {
    height: min(270px, calc(100% - 44px));
    overflow: hidden;
    width: 100%;
    flex-shrink: 0
  }
  .canvas-wrap {
    transform: scale(0.643);
    transform-origin: top center
  }
  .cv-ctrl {
    margin-top: 5px;
    gap: 5px
  }
  .cbtn {
    padding: 5px 10px;
    font-size: 11px
  }
  .cv-hint { display: none }

  /* RIGHT → fixed height, scrollable inside */
  .sr {
    order: 3;
    border-left: none;
    border-top: 1.5px solid var(--peach3);
    flex-shrink: 0;
    height: 300px
  }
  .ph { padding: 6px 10px 0 }
  .cat-row {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 6px;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch
  }
  .cat-row::-webkit-scrollbar { display: none }
  .catpill { flex-shrink: 0 }

  /* 3-column grid, compact cards */
  .fg {
    grid-template-columns: repeat(3, 1fr);
    gap: 5px;
    padding: 6px
  }
  .fc { padding: 5px 4px 4px; height: 70px }
  .fc-preview { height: 38px }
  .fc span { font-size: 9px; margin-top: 2px }
  .fc-dot { width: 4px; height: 4px }
  .fc span::before { content: '' }
}

/* ── Small phones (<400px) ── */
@media (max-width: 399px) {
  .canvas-shell { height: min(241px, calc(100% - 44px)) } /* 420 * 0.574 */
  .canvas-wrap { transform: scale(0.574) }
  .fg { grid-template-columns: repeat(2, 1fr) }
}</style>
