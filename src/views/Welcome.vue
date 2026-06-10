<template>
  <div class="page">

    <!-- Navbar -->
    <nav class="navbar" :class="{ scrolled }">
      <div class="nav-brand">Foam<span>.</span></div>
      <div class="nav-tag">Playground</div>
    </nav>

    <!-- Hero -->
    <section class="hero">
      <div class="hero-bg">
        <div class="hero-mesh"></div>
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
      </div>

      <div class="hero-content">
        <p class="hero-greeting">Hello, welcome to</p>
        <h1 class="hero-name">The<br /><span>Lab</span></h1>
        <div class="hero-roles">
          <span class="role-chip">Vue.js</span>
          <span class="role-chip">Experiments</span>
          <span class="role-chip">Playground</span>
        </div>

        <!-- <div class="hero-actions">
          <router-link to="/calculate" class="btn-primary">เข้าใช้งาน</router-link>
        </div> -->

        <!-- <p class="subtitle">เลือกโปรเจกต์ที่ต้องการ</p> -->

        <!-- <div class="card-grid">
          <router-link to="/calculate" class="card">
            <div class="card-icon">🧮</div>
            <div class="card-title">Calculate</div>
            <div class="card-desc">คำนวณต่างๆ</div>
          </router-link>

          <router-link to="/bri" class="card">
            <div class="card-icon">💡</div>
            <div class="card-title">Bri Calculate</div>
            <div class="card-desc">คำนวณ Bri</div>
          </router-link>

          <router-link to="/photo-booth" class="card">
            <div class="card-icon">📸</div>
            <div class="card-title">Photo Booth</div>
            <div class="card-desc">ถ่ายรูปสนุกๆ</div>
          </router-link>

          <router-link to="/spin" class="card">
            <div class="card-icon">🎡</div>
            <div class="card-title">Spin Wheel</div>
            <div class="card-desc">หมุนวงล้อ</div>
          </router-link>

          <router-link to="/my-room" class="card">
            <div class="card-icon">🏠</div>
            <div class="card-title">My Room</div>
            <div class="card-desc">ห้องของฉัน</div>
          </router-link>

          <router-link to="/ecs-land" class="card">
            <div class="card-icon">🌐</div>
            <div class="card-title">ECS Land</div>
            <div class="card-desc">ECS Landing</div>
          </router-link>
        </div> -->
      </div>

      <div class="hero-scroll-hint">
        <span>foamtyp</span>
        <div class="scroll-dot"></div>
      </div>
    </section>

    <footer class="footer">© 2025 foamtyp · Built with Vue.js</footer>
  </div>
</template>

<script>
export default {
  name: 'Welcome',
  data() {
    return { scrolled: false }
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    onScroll() {
      this.scrolled = window.scrollY > 40
    },
  },
}
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.page {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  color: #e8e8e8;
  background: #080808;

  --gold: #f5c400;
  --gold-2: #f5a623;
  --gold-dim: rgba(245, 196, 0, 0.12);
  --gold-border: rgba(245, 196, 0, 0.28);
  --gold-glow: rgba(245, 196, 0, 0.18);
  --bg: #080808;
  --bg-card: #141414;
  --border: #1e1e1e;
  --text-dim: #909090;
}

/* ── Navbar ── */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 60px;
  background: rgba(8, 8, 8, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid transparent;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.navbar.scrolled {
  background: rgba(8, 8, 8, 0.92);
  border-bottom-color: rgba(245, 196, 0, 0.1);
  padding: 15px 60px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: 900;
  color: #fff;
  letter-spacing: -0.5px;
}

.nav-brand span {
  color: var(--gold);
}

.nav-tag {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.28);
}

/* ── Hero ── */
.hero {
  position: relative;
  min-height: 100vh;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  text-align: center;
  padding: 0 24px;
}

.hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hero-mesh {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(245, 196, 0, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(245, 196, 0, 0.04) 1px, transparent 1px);
  background-size: 60px 60px;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(110px);
  opacity: 0.22;
}

.blob-1 {
  width: 620px;
  height: 620px;
  background: radial-gradient(circle, #f5c400, #f59e00);
  top: -160px;
  left: -160px;
  animation: float 11s ease-in-out infinite;
}

.blob-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #f5a623, #e08000);
  bottom: -100px;
  right: -100px;
  animation: float 14s ease-in-out infinite reverse;
}

@keyframes float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-40px) scale(1.06); }
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 740px;
}

.hero-greeting {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: 0.8rem;
  color: var(--gold);
  font-weight: 700;
  letter-spacing: 4px;
  text-transform: uppercase;
  margin-bottom: 18px;
}

.hero-greeting::before,
.hero-greeting::after {
  content: '';
  width: 28px;
  height: 1px;
  background: var(--gold);
  opacity: 0.5;
}

.hero-name {
  font-size: clamp(3.5rem, 14vw, 9rem);
  font-weight: 900;
  color: #fff;
  line-height: 1.0;
  margin-bottom: 28px;
  letter-spacing: -3px;
  text-transform: uppercase;
}

.hero-name span {
  background: linear-gradient(135deg, #f5c400 0%, #f5a623 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-roles {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-bottom: 46px;
}

.role-chip {
  background: rgba(245, 196, 0, 0.07);
  border: 1px solid rgba(245, 196, 0, 0.22);
  color: rgba(255, 255, 255, 0.75);
  padding: 7px 20px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  backdrop-filter: blur(6px);
}

/* ── Scroll hint ── */
.hero-scroll-hint {
  position: absolute;
  bottom: 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.18);
  font-size: 0.62rem;
  letter-spacing: 4px;
  text-transform: uppercase;
}

.scroll-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--gold);
  opacity: 0.5;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.6); }
}

/* ── Footer ── */
.footer {
  background: #040404;
  border-top: 1px solid #131313;
  text-align: center;
  padding: 28px;
  font-size: 0.76rem;
  color: #3a3a3a;
  letter-spacing: 0.3px;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .navbar {
    padding: 16px 24px;
  }
  .navbar.scrolled {
    padding: 12px 24px;
  }
  .hero-name {
    letter-spacing: -1px;
  }
  .hero-greeting::before,
  .hero-greeting::after {
    display: none;
  }
}
</style>
