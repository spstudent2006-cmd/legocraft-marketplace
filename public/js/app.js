/* ---------- HTML escaping ---------- */
/* Product titles, buyer names, etc. are user-supplied and get interpolated
   into HTML strings throughout the site. Any quote or angle bracket in that
   text (e.g. a title like 12" Wall Hanging) would otherwise break out of an
   attribute and show up as stray text on the page - always escape before
   inserting user-supplied text into innerHTML. */
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[ch]));
}

/* ---------- API helper ---------- */
async function api(path, { method = "GET", body, isForm = false } = {}) {
  const opts = { method, headers: {}, credentials: "same-origin" };
  if (body) {
    if (isForm) {
      opts.body = body; // FormData - browser sets content-type
    } else {
      opts.headers["Content-Type"] = "application/json";
      opts.body = JSON.stringify(body);
    }
  }
  const res = await fetch(path, opts);
  let data = {};
  try { data = await res.json(); } catch { /* no body */ }
  if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
  return data;
}

/* ---------- Toast ---------- */
function toast(message, type = "success") {
  let el = document.getElementById("lc-toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "lc-toast";
    el.className = "fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] max-w-[90vw] sm:max-w-md px-5 py-3 rounded-lg shadow-lg font-body text-sm transition-all duration-300 opacity-0 pointer-events-none overflow-hidden";
    el.style.display = "-webkit-box";
    el.style.webkitBoxOrient = "vertical";
    el.style.webkitLineClamp = "4";
    document.body.appendChild(el);
  }
  // Never let a message (e.g. a raw provider error) balloon the toast into
  // covering the page - keep it short, the rest isn't useful to the user.
  el.textContent = String(message || "").slice(0, 240);
  el.className = el.className.replace(/bg-\S+|text-\S+/g, "").trim();
  el.classList.add(type === "error" ? "bg-error" : "bg-primary", "text-white");
  el.classList.remove("opacity-0");
  el.classList.add("opacity-100");
  clearTimeout(el._t);
  el._t = setTimeout(() => {
    el.classList.remove("opacity-100");
    el.classList.add("opacity-0");
  }, 3000);
}

/* ---------- Cart (localStorage) ---------- */
const Cart = {
  key: "lc_cart",
  get() {
    try { return JSON.parse(localStorage.getItem(this.key)) || []; }
    catch { return []; }
  },
  save(items) {
    localStorage.setItem(this.key, JSON.stringify(items));
    Cart.updateBadge();
  },
  add(product, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === product.id);
    if (existing) existing.qty += qty;
    else items.push({ id: product.id, title: product.title, price: product.price, image: product.image, qty });
    this.save(items);
  },
  setQty(id, qty) {
    let items = this.get();
    if (qty <= 0) items = items.filter(i => i.id !== id);
    else items.forEach(i => { if (i.id === id) i.qty = qty; });
    this.save(items);
  },
  remove(id) {
    this.save(this.get().filter(i => i.id !== id));
  },
  clear() {
    this.save([]);
  },
  total() {
    return this.get().reduce((s, i) => s + i.price * i.qty, 0);
  },
  count() {
    return this.get().reduce((s, i) => s + i.qty, 0);
  },
  updateBadge() {
    document.querySelectorAll("[data-cart-count]").forEach(el => {
      const n = Cart.count();
      el.textContent = n;
      el.classList.toggle("hidden", n === 0);
    });
  }
};

/* ---------- Header auth state ---------- */
async function initHeader() {
  Cart.updateBadge();
  const menu = document.getElementById("lc-account-menu");
  const mobileMenu = document.getElementById("lc-account-menu-mobile");
  if (!menu && !mobileMenu) return;
  try {
    const { user } = await api("/api/me");
    if (user) {
      let links = `<a href="/orders.html" class="block px-4 py-2 hover:bg-surface-container-low">My Orders</a>`;
      if (user.role === "seller") links += `<a href="/seller-dashboard.html" class="block px-4 py-2 hover:bg-surface-container-low">Seller Dashboard</a>`;
      if (user.role === "admin") links += `<a href="/admin-dashboard.html" class="block px-4 py-2 hover:bg-surface-container-low">Admin Dashboard</a>`;

      if (menu) {
        menu.innerHTML = `
          <button id="lc-account-btn" class="flex items-center gap-1 text-on-surface hover:text-primary font-body text-sm">
            <span class="material-symbols-outlined text-[20px]">account_circle</span>${user.name.split(" ")[0]}
          </button>
          <div id="lc-account-drop" class="hidden absolute right-0 mt-2 w-48 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg overflow-hidden font-body text-sm">
            ${links}
            <button id="lc-logout" class="w-full text-left px-4 py-2 hover:bg-surface-container-low text-error">Log out</button>
          </div>`;
        document.getElementById("lc-account-btn").onclick = () => document.getElementById("lc-account-drop").classList.toggle("hidden");
        document.getElementById("lc-logout").onclick = async () => {
          await api("/api/logout", { method: "POST" });
          location.href = "/index.html";
        };
      }

      if (mobileMenu) {
        mobileMenu.innerHTML = `
          <p class="px-0 py-1 text-on-surface-variant text-xs">Signed in as ${user.name.split(" ")[0]}</p>
          <div class="flex flex-col -mx-1">
            <a href="/orders.html" class="block px-1 py-2 hover:text-primary">My Orders</a>
            ${user.role === "seller" ? `<a href="/seller-dashboard.html" class="block px-1 py-2 hover:text-primary">Seller Dashboard</a>` : ""}
            ${user.role === "admin" ? `<a href="/admin-dashboard.html" class="block px-1 py-2 hover:text-primary">Admin Dashboard</a>` : ""}
            <button id="lc-logout-mobile" class="text-left px-1 py-2 text-error">Log out</button>
          </div>`;
        document.getElementById("lc-logout-mobile").onclick = async () => {
          await api("/api/logout", { method: "POST" });
          location.href = "/index.html";
        };
      }
    } else {
      if (menu) {
        menu.innerHTML = `<a href="/login.html" class="text-on-surface hover:text-primary font-body text-sm flex items-center gap-1">
          <span class="material-symbols-outlined text-[20px]">account_circle</span>Log in</a>`;
      }
      if (mobileMenu) {
        mobileMenu.innerHTML = `<a href="/login.html" class="text-on-surface hover:text-primary font-body text-sm flex items-center gap-1">
          <span class="material-symbols-outlined text-[20px]">account_circle</span>Log in</a>`;
      }
    }
  } catch { /* not logged in */ }
}

/* initHeader() is invoked by partials.js, after the header/footer markup
   has been injected into the page - see public/js/partials.js */
