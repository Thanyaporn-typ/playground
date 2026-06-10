<template>
  <nav class="navbar navbar-expand-xl navbar-light bg">
    <div class="container">
      <!-- Brand Logo -->
      <a class="nav-link text-decoration-none margin-nav navbar-brand" href=" https://origin.co.th/" target="_blank"
        aria-current="page"><img src="../assets/logo.svg" class="margin-nav" alt="Logo"></a>

      <!-- Navbar Toggler for Mobile View -->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#language-navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navbar Content -->
      <div class="collapse navbar-collapse justify-content-center" id="language-navbarNav">
        <ul class="navbar-nav justify-content-center mb-2 mb-lg-0"> <!-- Add justify-content-center here -->
          <!-- Menu items -->
          <li class="nav-item">
            <a class="nav-link text-decoration-none margin-nav" href="https://origin.co.th/condo/" target="_blank"
              aria-current="page">คอนโดมิเมียม</a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-decoration-none margin-nav" href="https://origin.co.th/all-britania/" target="_blank"
              aria-current="page">บ้าน</a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-decoration-none margin-nav" href="https://origin.co.th/origin-sanampao/"
              target="_blank" aria-current="page">ออฟฟิศ</a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-decoration-none margin-nav"
              href="https://origin.co.th/corporate/about-origin-property/" target="_blank"
              aria-current="page">รู้จักกับออริจิ้น</a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-decoration-none margin-nav" href="https://investor.origin.co.th/th/home"
              target="_blank" aria-current="page">นักลงทุนสัมพันธ์</a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-decoration-none margin-nav" href="https://origin.co.th/condo/" target="_blank"
              aria-current="page">โปรโมชั่น</a>
          </li>
          <!-- Add more menu items as needed -->
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'AppNavbar',
  data() {
    return {
      selectedLanguage: 'th', // Default language is Thai
    };
  },
  computed: {
    selectedLanguageText() {
      return this.selectedLanguage === 'en' ? 'English' : 'ไทย';
    }
  },
  methods: {
    selectLanguage(language) {
      this.selectedLanguage = language;
      console.log(`Language selected: ${language}`);
      // Implement additional language switching logic here, if needed
    },
  },
};
</script>

<style>
.bg {
  box-shadow: 0px 2px 10px 0px #0000000D;
}

.navbar-nav .nav-link {
  color: #333 !important;
  /* Default text color */
  font-weight: 500;
  transition: color 0.3s ease, background-color 0.3s ease;
  /* Smooth transition */
}

.navbar-nav .nav-link:hover {
  color: #E87D2E !important;
  /* Change text color to white */
  text-decoration: none;
}

.navbar-nav .nav-item.active .nav-link {
  color: #E87D2E !important;
  /* Tomato color for active link */
  text-decoration: none;
}

.margin-nav {
  margin-right: 45px;
}
</style>
