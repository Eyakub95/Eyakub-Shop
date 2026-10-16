/* ===== EyakubShop – মূল স্ক্রিপ্ট ===== */
const $ = (s) => document.querySelector(s);
const bn = (n) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);
const money = (n) => SHOP.currency + bn(Number(n).toLocaleString("en-IN"));
const byId = (id) => PRODUCTS.find((p) => p.id === id);
const discount = (p) => (p.oldPrice > p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : 0);

let state = { cat: "all", q: "", cart: load("eyakub_cart", []) };
let modal = { id: null, size: null, qty: 1 };

function load(k, d) { try { return JSON.parse(localStorage.getItem(k)) || d; } catch { return d; } }
function save() { try { localStorage.setItem("eyakub_cart", JSON.stringify(state.cart)); } catch {} }
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove("show"), 1800); }
function esc(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

/* ---------- সেটআপ ---------- */
function init() {
  document.title = SHOP.name + " – অনলাইন শপিং বাংলাদেশ";
  $("#topPhone").textContent = SHOP.phone;
  $("#footPhone").textContent = SHOP.phone;
  $("#footWa").href = "https://wa.me/" + SHOP.whatsapp;
  $("#waFloat").href = "https://wa.me/" + SHOP.whatsapp + "?text=" + encodeURIComponent("আসসালামু আলাইকুম, আমি একটি পণ্য সম্পর্কে জানতে চাই।");
  $("#footFb").href = SHOP.facebook;
  $("#dIn").textContent = money(SHOP.deliveryInside);
  $("#dOut").textContent = money(SHOP.deliveryOutside);
  $("#year").textContent = bn(new Date().getFullYear());
  $("#districtSel").innerHTML = DISTRICTS.map((d) => `<option>${d}</option>`).join("");
  renderCats();
  renderFlash();
  renderProducts();
  renderCartBadge();
  startTimer();
  document.addEventListener("keydown", (e) => e.key === "Escape" && closeAll());
}

/* ---------- ক্যাটাগরি ---------- */
function renderCats() {
  $("#catBar").innerHTML = CATEGORIES.map(
    (c) => `<button class="chip ${state.cat === c.id ? "active" : ""}" onclick="setCat('${c.id}')">${c.icon} ${c.name}</button>`
  ).join("");
}
function setCat(id) { state.cat = id; renderCats(); renderProducts(); $("#products").scrollIntoView(); }
function doSearch() { state.q = $("#searchInput").value.trim().toLowerCase(); renderProducts(); $("#products").scrollIntoView(); }
function resetFilters() { state.cat = "all"; state.q = ""; $("#searchInput").value = ""; renderCats(); renderProducts(); window.scrollTo(0, 0); }

/* ---------- পণ্য কার্ড ---------- */
function cardHTML(p) {
  const d = discount(p);
  return `<article class="card" onclick="openProduct(${p.id})">
    ${d ? `<span class="badge">-${bn(d)}%</span>` : ""}
    <img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy">
    <div class="card-body">
      <div class="card-title">${esc(p.name)}</div>
      <div><span class="price">${money(p.price)}</span>${p.oldPrice ? `<span class="old">${money(p.oldPrice)}</span>` : ""}</div>
      <div class="meta">⭐ ${bn(p.rating)} · ${bn(p.sold)} বিক্রি</div>
      <button class="add" onclick="event.stopPropagation();quickAdd(${p.id})">${p.stock > 0 ? "🛒 কার্টে যোগ করুন" : "স্টক নেই"}</button>
    </div>
  </article>`;
}
function renderFlash() {
  const list = PRODUCTS.filter((p) => discount(p) >= 25).slice(0, 6);
  $("#flashSection").hidden = !list.length;
  $("#flashGrid").innerHTML = list.map(cardHTML).join("");
}
function renderProducts() {
  let list = PRODUCTS.filter((p) => (state.cat === "all" || p.category === state.cat) && (!state.q || (p.name + p.desc).toLowerCase().includes(state.q)));
  const s = $("#sortSelect").value;
  if (s === "low") list.sort((a, b) => a.price - b.price);
  if (s === "high") list.sort((a, b) => b.price - a.price);
  if (s === "popular") list.sort((a, b) => b.sold - a.sold);
  if (s === "rating") list.sort((a, b) => b.rating - a.rating);
  const cat = CATEGORIES.find((c) => c.id === state.cat);
  $("#productsTitle").textContent = state.q ? `"${state.q}" এর ফলাফল (${bn(list.length)})` : cat.name;
  $("#productGrid").innerHTML = list.map(cardHTML).join("");
  $("#emptyMsg").hidden = list.length > 0;
}

/* ---------- পণ্যের বিস্তারিত ---------- */
function openProduct(id) {
  const p = byId(id);
  modal = { id, size: p.sizes[0] || null, qty: 1 };
  paintProduct();
  $("#productModal").classList.add("show");
  $("#overlay").classList.add("show");
}
function paintProduct() {
  const p = byId(modal.id), d = discount(p);
  $("#productModal").innerHTML = `
    <button class="modal-close" onclick="closeAll()" aria-label="বন্ধ">✕</button>
    <div class="pd">
      <img src="${esc(p.image)}" alt="${esc(p.name)}">
      <div>
        <h3>${esc(p.name)}</h3>
        <div class="meta">⭐ ${bn(p.rating)} · ${bn(p.sold)} বিক্রি · ${p.stock > 0 ? `<span style="color:var(--ok)">স্টকে আছে (${bn(p.stock)})</span>` : '<span style="color:#e53935">স্টক নেই</span>'}</div>
        <div style="margin:8px 0"><span class="price">${money(p.price)}</span>${p.oldPrice ? `<span class="old">${money(p.oldPrice)}</span> <b style="color:var(--p)">-${bn(d)}%</b>` : ""}</div>
        <p style="margin-bottom:10px;color:#444">${esc(p.desc)}</p>
        ${p.sizes.length ? `<b>সাইজ:</b><div class="sizes">${p.sizes.map((s) => `<button class="size ${s === modal.size ? "sel" : ""}" onclick="pickSize('${s}')">${s}</button>`).join("")}</div>` : ""}
        <b>পরিমাণ:</b>
        <div class="qty" style="margin-left:8px"><button onclick="chQty(-1)">−</button><span>${bn(modal.qty)}</span><button onclick="chQty(1)">+</button></div>
        <div class="pd-actions">
          <button class="btn-block btn-outline" onclick="addFromModal(false)">🛒 কার্টে যোগ</button>
          <button class="btn-block" onclick="addFromModal(true)">⚡ এখনই কিনুন</button>
        </div>
      </div>
    </div>`;
}
function pickSize(s) { modal.size = s; paintProduct(); }
function chQty(n) { const p = byId(modal.id); modal.qty = Math.min(Math.max(1, modal.qty + n), Math.max(1, p.stock)); paintProduct(); }
function addFromModal(buyNow) {
  const p = byId(modal.id);
  if (p.stock <= 0) return toast("দুঃখিত, স্টক নেই");
  addItem(p.id, modal.size, modal.qty);
  if (buyNow) { closeAll(); openCheckout(); } else { closeAll(); toast("কার্টে যোগ হয়েছে ✅"); }
}

/* ---------- কার্ট ---------- */
function quickAdd(id) {
  const p = byId(id);
  if (p.stock <= 0) return toast("দুঃখিত, স্টক নেই");
  if (p.sizes.length) return openProduct(id); // সাইজ বাছাই করতে হবে
  addItem(id, null, 1); toast("কার্টে যোগ হয়েছে ✅");
}
function addItem(id, size, qty) {
  const it = state.cart.find((c) => c.id === id && c.size === size);
  if (it) it.qty += qty; else state.cart.push({ id, size, qty });
  save(); renderCartBadge();
}
function renderCartBadge() { $("#cartCount").textContent = bn(state.cart.reduce((a, c) => a + c.qty, 0)); }
function subtotal() { return state.cart.reduce((a, c) => a + byId(c.id).price * c.qty, 0); }
function openCart() { renderCart(); $("#cartDrawer").classList.add("show"); $("#overlay").classList.add("show"); }
function renderCart() {
  if (!state.cart.length) {
    $("#cartBody").innerHTML = '<p class="empty">আপনার কার্ট খালি 🛒</p>';
    $("#cartFoot").innerHTML = "";
    return;
  }
  $("#cartBody").innerHTML = state.cart.map((c, i) => {
    const p = byId(c.id);
    return `<div class="ci"><img src="${esc(p.image)}" alt=""><div><b>${esc(p.name)}</b><small>${c.size ? "সাইজ: " + c.size + " · " : ""}${money(p.price)}</small>
      <div class="qty" style="margin-top:6px"><button onclick="cartQty(${i},-1)">−</button><span>${bn(c.qty)}</span><button onclick="cartQty(${i},1)">+</button></div></div>
      <button class="rm" onclick="cartRemove(${i})" aria-label="মুছুন">🗑</button></div>`;
  }).join("");
  $("#cartFoot").innerHTML = `<div class="row"><span>সাবটোটাল</span><b>${money(subtotal())}</b></div>
    <small class="hint">ডেলিভারি চার্জ চেকআউটে যোগ হবে</small>
    <button class="btn-block" onclick="openCheckout()">চেকআউট করুন →</button>`;
}
function cartQty(i, n) {
  const c = state.cart[i], p = byId(c.id);
  c.qty = Math.min(Math.max(1, c.qty + n), Math.max(1, p.stock));
  save(); renderCart(); renderCartBadge();
}
function cartRemove(i) { state.cart.splice(i, 1); save(); renderCart(); renderCartBadge(); }

/* ---------- চেকআউট ও অর্ডার ---------- */
function deliveryFee() { return $("#districtSel").value === "ঢাকা" ? SHOP.deliveryInside : SHOP.deliveryOutside; }
function openCheckout() {
  if (!state.cart.length) return toast("কার্ট খালি!");
  closeAll();
  paintCheckoutSum();
  $("#districtSel").onchange = paintCheckoutSum;
  $("#checkoutModal").classList.add("show");
  $("#overlay").classList.add("show");
}
function paintCheckoutSum() {
  const s = subtotal(), d = deliveryFee();
  $("#checkoutSum").innerHTML = `<div class="row"><span>পণ্যের দাম</span><span>${money(s)}</span></div>
    <div class="row"><span>ডেলিভারি চার্জ</span><span>${money(d)}</span></div>
    <div class="row total"><span>সর্বমোট</span><span>${money(s + d)}</span></div>`;
}
function submitOrder(e) {
  e.preventDefault();
  const f = new FormData(e.target);
  const s = subtotal(), d = deliveryFee(), total = s + d;
  const orderNo = "EYS" + Date.now().toString().slice(-7);
  const lines = state.cart.map((c, i) => { const p = byId(c.id); return `${i + 1}. ${p.name}${c.size ? " (সাইজ: " + c.size + ")" : ""} × ${c.qty} = ${p.price * c.qty} ৳`; });
  const msg = [
    `🛍️ নতুন অর্ডার – ${SHOP.name}`, `অর্ডার নং: ${orderNo}`, "",
    ...lines, "",
    `পণ্যের দাম: ${s} ৳`, `ডেলিভারি: ${d} ৳`, `সর্বমোট: ${total} ৳ (ক্যাশ অন ডেলিভারি)`, "",
    `নাম: ${f.get("name")}`, `মোবাইল: ${f.get("phone")}`, `জেলা: ${f.get("district")}`, `ঠিকানা: ${f.get("address")}`,
    f.get("note") ? `নোট: ${f.get("note")}` : ""
  ].filter((x, i, a) => x !== "" || a[i - 1] !== "").join("\n");

  // ব্রাউজারে অর্ডারের কপি রাখা হয় (শুধু এই ডিভাইসে)
  try {
    const orders = load("eyakub_orders", []);
    orders.push({ orderNo, date: new Date().toISOString(), total, items: state.cart, customer: Object.fromEntries(f) });
    localStorage.setItem("eyakub_orders", JSON.stringify(orders));
  } catch {}

  window.open("https://wa.me/" + SHOP.whatsapp + "?text=" + encodeURIComponent(msg), "_blank");
  state.cart = []; save(); renderCartBadge(); closeAll(); e.target.reset();
  toast("অর্ডার নং " + orderNo + " – হোয়াটসঅ্যাপে পাঠান ✅");
}

/* ---------- সাধারণ ---------- */
function closeAll() {
  document.querySelectorAll(".modal,.drawer,.overlay").forEach((el) => el.classList.remove("show"));
}
function startTimer() {
  const tick = () => {
    const end = new Date(); end.setHours(23, 59, 59, 999);
    let s = Math.max(0, Math.floor((end - new Date()) / 1000));
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
    $("#timer").textContent = [h, m, x].map((n) => bn(String(n).padStart(2, "0"))).join(":");
  };
  tick(); setInterval(tick, 1000);
}

init();
