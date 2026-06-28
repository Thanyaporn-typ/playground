<template>
  <div class="page">
    <!-- Navbar -->
    <nav class="navbar" :class="{ scrolled }">
      <div class="nav-brand">Tech<span>Geek</span>Hub</div>
      <div class="nav-tag">Shop</div>
    </nav>

    <!-- Header -->
    <section class="header-section">
      <div class="header-bg">
        <div class="hero-mesh"></div>
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
      </div>
      <div class="header-content">
        <div class="avatar">
          <img src="@/assets/images/techgeekhub-logo.jpg" alt="TechGeekHub Logo" class="logo-img" />
        </div>
        <h1 class="brand-name">TechGeekHub</h1>
        <p class="brand-desc">สินค้าไอที · Gadget · Accessories คัดมาเพื่อ Geek โดยเฉพาะ</p>
        <!-- <a
          href="https://th.shp.ee/4t2rmnei?smtt=0.0.9"
          target="_blank"
          rel="noopener noreferrer"
          class="shopee-btn"
        >
          <span>🛒</span> เยี่ยมชมร้านใน Shopee
        </a> -->
      </div>
    </section>

    <!-- Products -->
    <section class="products-section">
      <h2 class="section-title">สินค้าทั้งหมด</h2>
      <div class="product-grid">
        <div
          v-for="product in sortedProducts"
          :key="product.id"
          class="product-card"
        >
          <a
            :href="product.shopeeUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="product-image-link"
          >
            <div class="product-image">
              <img v-if="product.image" :src="product.image" :alt="product.name" />
              <div v-else class="product-placeholder">
                <span>{{ product.emoji }}</span>
              </div>
              <div class="image-overlay">
                <span>ดูสินค้า →</span>
              </div>
            </div>
          </a>
          <div class="product-info">
            <div class="product-name">{{ product.name }}</div>
            <a
              :href="product.shopeeUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="buy-btn"
            >
              🛒 ซื้อใน Shopee
            </a>
          </div>
        </div>
      </div>
    </section>

    <footer class="footer">© 2025 TechGeekHub · All rights reserved</footer>
  </div>
</template>

<script>
export default {
  name: 'TechGeekHub',
  data() {
    return {
      scrolled: false,
      products: [
        {
          id: 1,
          name: 'คีย์บอร์ดไร้สาย - AULA F75 - Gasket Mechanical Keyboard คีย์ไทย รับประกัน 2 ปี',
          emoji: '⌨️',
          image: require('@/assets/images/products/keyboard-1.jpg'),
          shopeeUrl: 'https://s.shopee.co.th/W4dhjxjGP',
        },
        {
          id: 2,
          name: 'เมาส์ไร้สาย มาโครได้ M15 Wireless&Bluetooth Gaming Mouse RGB เมาส์เกมมิ่ง ประกันศูนย์ 1-2 ปี',
          emoji: '🖱️',
          image: require('@/assets/images/products/mouse-1.jpg'),
          shopeeUrl: 'https://s.shopee.co.th/6VLqrTMpHT',
        },
        {
          id: 3,
          name: 'Wiggle Wiggle Color Wireless Keyboard คีย์บอร์ด ไร้สายสุดคิวท์ พิมพ์สนุกทุกสัมผัส!',
          emoji: '⌨️',
          image: require('@/assets/images/products/keyboard-2.jpg'),
          shopeeUrl: 'https://s.shopee.co.th/8pjleCKhjK',
        },
        {
          id: 4,
          name: 'DIY pegboard กระดานเจาะรู ติด ห้อย แขวน ตกแต่งห้อง เพิ่มฟังก์ชันเก็บของ ไม่ต้องเจาะผนัง',
          emoji: '🪝',
          image: require('@/assets/images/products/pegboard-1.jpg'),
          shopeeUrl: 'https://s.shopee.co.th/8pjleNuTdj',
        },
        {
          id: 5,
          name: 'ขาตั้งจอคอมพิวเตอร์ หมุนได้ แขนอลูมิเนียมคู่',
          emoji: '🖥️',
          image: require('@/assets/images/products/monitor-arm-1.jpg'),
          shopeeUrl: 'https://s.shopee.co.th/4fuCguA9rT',
        },
        {
          id: 6,
          name: 'UGREEN รุ่น 15495 HUB Type C 5 in 1 รองรับ 4K30Hz PD100W USB3.0 x1 / USB2.0 x2 อะแดปเตอร์ฮับ',
          emoji: '🔌',
          image: require('@/assets/images/products/hub-1.jpg'),
          shopeeUrl: 'https://s.shopee.co.th/8V6vGC25Ol',
        },
        {
          id: 7,
          name: 'กล่องจัดระเบียบปลั๊กไฟพร้อมฝาปิด ป้องกันสายไฟยุ่งเหยิง จัดเก็บง่าย วัสดุทนทาน ใช้งานได้ทุกห้องในบ้าน',
          emoji: '📦',
          image: require('@/assets/images/products/cable-box-1.jpg'),
          shopeeUrl: 'https://s.shopee.co.th/110uKcD563',
        },
        {
          id: 8,
          name: 'CAMEL เครื่องซักผ้ามินิฝาบน 9KG ความจุขนาดใหญ่ ถังซักเดียวขนาดเล็ก เครื่องฆ่าเชื้อกึ่งอัตโนมัติขนาดเล็ก',
          emoji: '🫧',
          image: require('@/assets/images/products/washing-machine-1.jpg'),
          shopeeUrl: 'https://s.shopee.co.th/60PaHxZN2m',
        },
        {
          id: 9,
          name: 'The Summer Coffee Company เมล็ดกาแฟคั่ว SLEEPYHEAD',
          emoji: '☕',
          image: require('@/assets/images/products/coffee-1.jpg'),
          shopeeUrl: 'https://s.shopee.co.th/8KnV4N5ept',
        },
      ],
    }
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll)
  },
  computed: {
    sortedProducts() {
      return [...this.products].sort((a, b) => b.id - a.id)
    },
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
  min-height: 100vh;

  --gold: #f5c400;
  --gold-2: #f5a623;
  --gold-dim: rgba(245, 196, 0, 0.1);
  --gold-border: rgba(245, 196, 0, 0.28);
  --bg: #080808;
  --bg-card: #111111;
  --border: #1e1e1e;
  --text-dim: #777;
  --shopee: #f5c400;
}

/* ── Navbar ── */
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 60px;
  background: rgba(8, 8, 8, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid transparent;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.navbar.scrolled {
  background: rgba(8, 8, 8, 0.95);
  border-bottom-color: rgba(245, 196, 0, 0.1);
  padding: 14px 60px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
}

.nav-brand {
  font-size: 1.3rem;
  font-weight: 900;
  color: #fff;
  letter-spacing: -0.5px;
}

.nav-brand span { color: var(--gold); }

.nav-tag {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.25);
}

/* ── Header Section ── */
.header-section {
  position: relative;
  padding: 140px 24px 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  background: var(--bg);
}

.header-bg {
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
  opacity: 0.16;
}

.blob-1 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, #f5c400, #f59e00);
  top: -150px; right: -80px;
  animation: float 12s ease-in-out infinite;
}

.blob-2 {
  width: 380px; height: 380px;
  background: radial-gradient(circle, #f5a623, #e08000);
  bottom: -80px; left: -60px;
  animation: float 16s ease-in-out infinite reverse;
}

@keyframes float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-30px) scale(1.06); }
}

.header-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.avatar {
  width: 120px; height: 120px;
  border-radius: 20px;
  background: #0d0d0d;
  border: 1px solid rgba(245, 196, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
  box-shadow: 0 0 48px rgba(245, 196, 0, 0.2);
  overflow: hidden;
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.brand-name {
  font-size: 2.2rem;
  font-weight: 900;
  color: #fff;
  letter-spacing: -1px;
  margin-bottom: 10px;
}

.brand-desc {
  font-size: 0.85rem;
  color: var(--text-dim);
  margin-bottom: 32px;
  line-height: 1.6;
}

.shopee-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--shopee);
  color: #080808;
  font-weight: 700;
  font-size: 0.95rem;
  padding: 14px 32px;
  border-radius: 999px;
  text-decoration: none;
  transition: all 0.2s;
  box-shadow: 0 4px 24px rgba(245, 196, 0, 0.35);
}

.shopee-btn:hover {
  background: #e6b800;
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(245, 196, 0, 0.45);
}

/* ── Products Section ── */
.products-section {
  background: #0b0b0b;
  padding: 60px 40px 80px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--gold);
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 36px;
  text-align: center;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

/* ── Product Card ── */
.product-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-card:hover {
  border-color: var(--gold-border);
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
}

.product-image-link {
  display: block;
  text-decoration: none;
}

.product-image {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  background: #f5f5f5;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 12px;
  transition: transform 0.3s;
}

.product-card:hover .product-image img {
  transform: scale(1.04);
}

.product-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  background: linear-gradient(135deg, #141414, #1a1a1a);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 1px;
  opacity: 0;
  transition: opacity 0.25s;
}

.product-card:hover .image-overlay {
  opacity: 1;
}

.product-info {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-name {
  font-size: 0.88rem;
  font-weight: 600;
  color: #e0e0e0;
  line-height: 1.4;
  height: 2.5em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-price {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--gold);
  letter-spacing: -0.5px;
}

.buy-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--shopee);
  color: #080808;
  font-weight: 700;
  font-size: 0.82rem;
  padding: 10px 0;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s;
  margin-top: 4px;
}

.buy-btn:hover {
  background: #e6b800;
}

/* ── Footer ── */
.footer {
  background: #040404;
  border-top: 1px solid #131313;
  text-align: center;
  padding: 28px;
  font-size: 0.76rem;
  color: #3a3a3a;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .navbar { padding: 16px 20px; }
  .navbar.scrolled { padding: 12px 20px; }
  .products-section { padding: 50px 16px 60px; }
  .product-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
}

@media (max-width: 480px) {
  .product-grid { grid-template-columns: 1fr 1fr; }
  .brand-name { font-size: 1.8rem; }
}
</style>
