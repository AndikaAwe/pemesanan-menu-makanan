const menuData = [
  {id:1, name:"Ayam Crispy", price:18000, category:"Makanan"},
  {id:2, name:"Burger", price:15000, category:"Makanan"},
  {id:3, name:"Kentang Goreng", price:8000, category:"Snack"},
  {id:4, name:"Es Teh", price:5000, category:"Minuman"},
  {id:5, name:"Pizza", price:35000, category:"Makanan"},
  {id:6, name:"Jus Jeruk", price:8000, category:"Minuman"},
  {id:7, name:"Donat", price:6000, category:"Snack"},
];

let cart = [];
let currentCategory = "Semua";

const menuList = document.getElementById("menuList");
const cartList = document.getElementById("cartList");
const totalPrice = document.getElementById("totalPrice");
const cartToggleBtn = document.querySelector(".cart-toggle");
const cartEl = document.querySelector(".cart");
const cartClose = document.querySelector(".cart-close");
const checkoutBtn = document.getElementById("checkoutBtn");
const cartBadge = document.querySelector(".cart-badge");
const backdrop = document.querySelector(".cart-backdrop");

/* RENDER MENU */
function renderMenu(){
  menuList.innerHTML = "";

  const filtered = currentCategory === "Semua"
    ? menuData
    : menuData.filter(m => m.category === currentCategory);

  filtered.forEach(item=>{
    const el = document.createElement("div");
    el.className = "menu-card";
    el.innerHTML = `
      <h3>${item.name}</h3>
      <p>Rp ${item.price.toLocaleString("id-ID")}</p>
      <button onclick="addToCart(${item.id})">+ Tambah</button>
    `;
    menuList.appendChild(el);
  });
}

/* CART LOGIC */
function addToCart(id){
  const item = menuData.find(m=>m.id===id);
  const exist = cart.find(c=>c.id===id);

  if(exist) exist.qty++;
  else cart.push({...item, qty:1});

  renderCart();
  updateCartBadge();
}

function increaseQty(id){
  const item = cart.find(c=>c.id===id);
  if(item) item.qty++;
  renderCart();
  updateCartBadge();
}

function decreaseQty(id){
  const item = cart.find(c=>c.id===id);
  if(!item) return;
  
  if(item.qty > 1){
    item.qty--;
  } else {
    removeFromCart(id);
  }
  
  renderCart();
  updateCartBadge();
}

function removeFromCart(id){
  cart = cart.filter(c=>c.id !== id);
  renderCart();
  updateCartBadge();
}

function renderCart(){
  cartList.innerHTML="";
  let total=0;

  if(cart.length === 0){
    cartList.innerHTML = `
      <div class="empty-cart">
        <p>Pesanan masih kosong</p>
      </div>
    `;
    checkoutBtn.disabled = true;
    totalPrice.textContent = "Rp 0";
    return;
  }

  checkoutBtn.disabled = false;

  cart.forEach(item=>{
    total += item.price * item.qty;
    const itemEl = document.createElement("div");
    itemEl.className = "cart-item";
    itemEl.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">Rp ${item.price.toLocaleString("id-ID")}</div>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn remove" onclick="decreaseQty(${item.id})">−</button>
        <span class="cart-item-qty">${item.qty}</span>
        <button class="qty-btn" onclick="increaseQty(${item.id})">+</button>
      </div>
    `;
    cartList.appendChild(itemEl);
  });

  totalPrice.textContent = "Rp " + total.toLocaleString("id-ID");
}

function updateCartBadge(){
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  if(cartBadge){
    cartBadge.textContent = totalItems;
    cartBadge.style.display = totalItems > 0 ? 'block' : 'none';
  }
}

function toggleCart(){
  const isActive = cartEl.classList.toggle("active");
  backdrop.classList.toggle("active");
  
  // Lock body scroll di mobile
  if(window.innerWidth < 768){
    if(isActive){
      document.body.classList.add('cart-open');
    } else {
      document.body.classList.remove('cart-open');
    }
  }
}

function closeCart(){
  cartEl.classList.remove("active");
  backdrop.classList.remove("active");
  document.body.classList.remove('cart-open');
}

/* CATEGORY */
document.querySelectorAll(".categories button").forEach(btn=>{
  btn.onclick = ()=>{
    document.querySelector(".categories .active").classList.remove("active");
    btn.classList.add("active");
    currentCategory = btn.dataset.cat;
    renderMenu();
  };
});

/* CHECKOUT */
function checkout(){
  if(cart.length === 0){
    alert("Pesanan masih kosong!");
    return;
  }

  let message = "Pesanan berhasil!\n\n";
  cart.forEach(i => {
    message += `${i.name} x${i.qty} = Rp ${(i.price * i.qty).toLocaleString("id-ID")}\n`;
  });
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  message += `\nTotal: Rp ${total.toLocaleString("id-ID")}\n\nTerima kasih! 🙏`;

  alert(message);

  cart = [];
  renderCart();
  updateCartBadge();
  closeCart();
}

/* EVENT LISTENERS */
if(cartToggleBtn){
  cartToggleBtn.addEventListener("click", toggleCart);
}

if(cartClose){
  cartClose.addEventListener("click", (e) => {
    e.stopPropagation();
    closeCart();
  });
}

if(backdrop){
  backdrop.addEventListener("click", closeCart);
}

if(checkoutBtn){
  checkoutBtn.addEventListener("click", checkout);
}

// Close cart on ESC key
document.addEventListener("keydown", (e) => {
  if(e.key === "Escape" && cartEl.classList.contains("active")){
    closeCart();
  }
});

// Handle window resize
window.addEventListener("resize", () => {
  if(window.innerWidth >= 768){
    closeCart();
  }
});

/* INIT */
renderMenu();
renderCart();
updateCartBadge();
