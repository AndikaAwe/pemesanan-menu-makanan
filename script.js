const menuData = [
  {id:1, name:"Ayam Crispy", price:18000, category:"Makanan"},
  {id:2, name:"Burger", price:15000, category:"Makanan"},
  {id:3, name:"Kentang Goreng", price:8000, category:"Snack"},
  {id:4, name:"Es Teh", price:5000, category:"Minuman"},
];

let cart = [];
let currentCategory = "Semua";

const menuList = document.getElementById("menuList");
const cartList = document.getElementById("cartList");
const totalPrice = document.getElementById("totalPrice");

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
      <button onclick="addToCart(${item.id})">Tambah</button>
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
}

function renderCart(){
  cartList.innerHTML="";
  let total=0;

  cart.forEach(item=>{
    total += item.price * item.qty;
    cartList.innerHTML += `
      <div class="cart-item">
        <span>${item.name} x${item.qty}</span>
        <span>Rp ${(item.price*item.qty).toLocaleString("id-ID")}</span>
      </div>
    `;
  });

  totalPrice.textContent = "Rp " + total.toLocaleString("id-ID");
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

/* INIT */
renderMenu();
renderCart();

const cartEl = document.querySelector(".cart");
const cartToggleBtn = document.querySelector(".cart-toggle");

if(cartToggleBtn){
  cartToggleBtn.addEventListener("click", () => {
    cartEl.classList.toggle("active");
  });
}

const checkoutBtn = document.getElementById("checkoutBtn");

if(checkoutBtn){
  checkoutBtn.addEventListener("click", checkout);
}

function checkout(){
  if(cart.length === 0){
    alert("Pesanan masih kosong!");
    return;
  }

  alert(
    "Pesanan berhasil!\n\n" +
    cart.map(i => `${i.name} x${i.qty}`).join("\n") +
    "\n\nTerima kasih 🙏"
  );

  cart = [];
  renderCart();

  // Tutup cart di mobile setelah checkout
  if(cartEl){
    cartEl.classList.remove("active");
  }
}
