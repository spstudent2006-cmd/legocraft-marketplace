function renderHeader() {
  const el = document.getElementById("lc-header");
  if (!el) return;
  el.innerHTML = `
  <nav class="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-surface-container">
    <div class="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
      <a href="/index.html" class="font-display text-xl text-primary shrink-0">Legocraft</a>
      <form action="/products.html" method="get" class="hidden md:flex flex-1 max-w-md">
        <input name="search" type="search" data-i18n-placeholder="nav.search" placeholder="Search for handmade products"
          class="w-full border border-outline-variant rounded-l-md px-3 py-2 text-sm font-body focus:outline-none focus:border-primary bg-surface-container-lowest">
        <button class="bg-primary text-on-primary px-4 rounded-r-md">
          <span class="material-symbols-outlined text-[18px]">search</span>
        </button>
      </form>
      <div class="flex items-center gap-4 sm:gap-5 font-body text-sm shrink-0">
        <a href="/products.html" data-i18n="nav.shop" class="hidden md:inline text-on-surface hover:text-primary">Shop</a>
        <a href="/puzzle.html" data-i18n="nav.puzzle" class="hidden md:inline text-on-surface hover:text-primary">🧩 Find My Craft</a>
        <a href="/seller-register.html" data-i18n="nav.sell" class="hidden md:inline text-on-surface hover:text-primary">Sell on Legocraft</a>
        <a href="/cart.html" class="relative flex items-center text-on-surface hover:text-primary">
          <span class="material-symbols-outlined text-[22px]">shopping_cart</span>
          <span data-cart-count class="hidden absolute -top-2 -right-2 bg-secondary text-white text-[10px] leading-none rounded-full w-4 h-4 flex items-center justify-center">0</span>
        </a>
        <div id="lc-lang-switcher" class="relative"></div>
        <div id="lc-account-menu" class="relative hidden md:block"></div>
        <button id="lc-menu-btn" type="button" aria-label="Open menu" aria-expanded="false" class="md:hidden flex items-center justify-center w-9 h-9 -mr-1 text-on-surface hover:text-primary">
          <span class="material-symbols-outlined text-[26px]">menu</span>
        </button>
      </div>
    </div>
    <div id="lc-mobile-menu" class="hidden md:hidden border-t border-surface-container bg-surface px-4 py-4 flex flex-col gap-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
      <form action="/products.html" method="get" class="flex">
        <input name="search" type="search" data-i18n-placeholder="nav.search" placeholder="Search for handmade products"
          class="w-full border border-outline-variant rounded-l-md px-3 py-2 text-sm font-body focus:outline-none focus:border-primary bg-surface-container-lowest">
        <button class="bg-primary text-on-primary px-4 rounded-r-md">
          <span class="material-symbols-outlined text-[18px]">search</span>
        </button>
      </form>
      <a href="/products.html" data-i18n="nav.shop" class="text-on-surface hover:text-primary font-body text-sm">Shop</a>
      <a href="/puzzle.html" data-i18n="nav.puzzle" class="text-on-surface hover:text-primary font-body text-sm">🧩 Find My Craft</a>
      <a href="/seller-register.html" data-i18n="nav.sell" class="text-on-surface hover:text-primary font-body text-sm">Sell on Legocraft</a>
      <div id="lc-lang-switcher-mobile" class="font-body text-sm border-t border-surface-container pt-4"></div>
      <div id="lc-account-menu-mobile" class="font-body text-sm border-t border-surface-container pt-4"></div>
    </div>
  </nav>
  <div class="h-16"></div>`;

  const menuBtn = document.getElementById("lc-menu-btn");
  const mobileMenu = document.getElementById("lc-mobile-menu");
  const menuIcon = menuBtn.querySelector(".material-symbols-outlined");
  function setMenuOpen(open) {
    mobileMenu.classList.toggle("hidden", !open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuIcon.textContent = open ? "close" : "menu";
  }
  menuBtn.onclick = () => setMenuOpen(mobileMenu.classList.contains("hidden"));
  mobileMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenuOpen(false)));
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) setMenuOpen(false);
  });
}

function renderFooter() {
  const el = document.getElementById("lc-footer");
  if (!el) return;
  el.innerHTML = `
  <footer class="bg-primary text-primary-fixed-dim mt-16">
    <div class="max-w-6xl mx-auto px-4 md:px-8 py-10 grid gap-8 md:grid-cols-3 font-body text-sm">
      <div>
        <p class="font-display text-lg text-white mb-2">Legocraft</p>
        <p class="opacity-80" data-i18n="footer.tagline">Connecting India's traditional artisans with the modern digital economy.</p>
      </div>
      <div>
        <p class="text-white mb-2" data-i18n="footer.shop">Shop</p>
        <a href="/products.html" data-i18n="footer.allProducts" class="block opacity-80 hover:opacity-100 hover:underline">All products</a>
        <a href="/orders.html" data-i18n="footer.trackOrder" class="block opacity-80 hover:opacity-100 hover:underline">Track an order</a>
      </div>
      <div>
        <p class="text-white mb-2" data-i18n="footer.sell">Sell</p>
        <a href="/seller-register.html" data-i18n="footer.becomeSeller" class="block opacity-80 hover:opacity-100 hover:underline">Become a seller</a>
        <a href="/login.html" data-i18n="footer.sellerLogin" class="block opacity-80 hover:opacity-100 hover:underline">Seller login</a>
      </div>
    </div>
    <div class="border-t border-white/10 text-center text-xs py-4 opacity-70" data-i18n="footer.copyright">© 2026 Legocraft. Crafted by hands.</div>
  </footer>`;
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  if (typeof renderLangSwitcher === "function") {
    renderLangSwitcher("lc-lang-switcher");
    renderLangSwitcher("lc-lang-switcher-mobile");
  }
  if (typeof applyTranslations === "function") applyTranslations();
  if (typeof initHeader === "function") initHeader();
});
