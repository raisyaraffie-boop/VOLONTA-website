const catalog={
 denim:{name:"VOLONTÀ Denim Jacket",price:399000},
 blouson:{name:"VOLONTÀ Asymmetric Blouson",price:499000},
 leather:{name:"VOLONTÀ Leather Jacket",price:549000}
};
const sizes={
 denim:{title:"DENIM JACKET",rows:[["S",100,44,63,"160–168 cm","48–55 kg"],["M",104,46,65,"165–173 cm","55–63 kg"],["L",108,48,67,"170–178 cm","63–72 kg"],["XL",112,50,69,"175–185 cm","72–82 kg"]]},
 blouson:{title:"ASYMMETRIC BLOUSON",rows:[["S",104,45,62,"160–168 cm","48–55 kg"],["M",108,47,64,"165–173 cm","55–63 kg"],["L",112,49,66,"170–178 cm","63–72 kg"],["XL",116,51,68,"175–185 cm","72–82 kg"]]},
 leather:{title:"LEATHER JACKET",rows:[["S",102,44,63,"160–168 cm","48–55 kg"],["M",106,46,65,"165–173 cm","55–63 kg"],["L",110,48,67,"170–178 cm","63–72 kg"],["XL",114,50,69,"175–185 cm","72–82 kg"]]}
};
function loadCart(){
 try{
  const stored=JSON.parse(localStorage.getItem("volonta-cart")||"[]");
  if(!Array.isArray(stored))return [];
  return stored.filter(item=>item&&catalog[item.product]&&["S","M","L","XL"].includes(item.size)&&Number.isInteger(item.qty)&&item.qty>0);
 }catch{return [];}
}
let cart=loadCart();
const rupiah=n=>"Rp"+n.toLocaleString("id-ID");
const count=()=>cart.reduce((a,b)=>a+b.qty,0);
function save(){try{localStorage.setItem("volonta-cart",JSON.stringify(cart));}catch{}renderCart();document.getElementById("cart-count").textContent=count();}
function renderCart(){
 const host=document.getElementById("cart-items");
 if(!cart.length)host.innerHTML='<p class="empty-cart">Keranjang Anda masih kosong.</p>';
 else host.innerHTML=cart.map((item,i)=>`<div class="cart-row"><div><strong>${catalog[item.product].name}</strong><br>Ukuran: ${item.size} · ${rupiah(catalog[item.product].price)} × ${item.qty}</div><div><strong>${rupiah(catalog[item.product].price*item.qty)}</strong><br><button data-remove="${i}">Hapus</button></div></div>`).join("");
 const total=cart.reduce((s,item)=>s+catalog[item.product].price*item.qty,0);
 document.getElementById("cart-total").textContent=rupiah(total);
 host.querySelectorAll("[data-remove]").forEach(b=>b.addEventListener("click",()=>{cart.splice(Number(b.dataset.remove),1);save();}));
}
function toggleCart(open){document.getElementById("cart-panel").classList.toggle("open",open);document.getElementById("cart-panel").setAttribute("aria-hidden",String(!open));document.getElementById("overlay").classList.toggle("show",open);}
document.querySelectorAll(".add-button").forEach(b=>b.addEventListener("click",()=>{const k=b.dataset.product;const select=document.getElementById(`size-${k}`);const error=select.closest(".product-actions").querySelector(".size-error");if(!select.value){if(error)error.hidden=false;select.setAttribute("aria-invalid","true");select.focus();return;}if(error)error.hidden=true;select.removeAttribute("aria-invalid");const existing=cart.find(x=>x.product===k&&x.size===select.value);if(existing)existing.qty++;else cart.push({product:k,size:select.value,qty:1});save();toggleCart(true);}));
document.querySelectorAll(".size-select").forEach(select=>select.addEventListener("change",()=>{select.removeAttribute("aria-invalid");const error=select.closest(".product-actions").querySelector(".size-error");if(error)error.hidden=true;}));
document.querySelector(".cart-trigger").addEventListener("click",()=>toggleCart(true));
document.getElementById("close-cart").addEventListener("click",()=>toggleCart(false));
document.getElementById("overlay").addEventListener("click",()=>toggleCart(false));
document.getElementById("checkout").addEventListener("click",()=>{
 if(!cart.length){alert("Keranjang masih kosong.");return;}
 const name=document.getElementById("buyer-name").value.trim(),phone=document.getElementById("buyer-phone").value.trim(),address=document.getElementById("buyer-address").value.trim();
 if(!name||!phone||!address){alert("Mohon lengkapi nama, nomor HP, dan alamat pengiriman.");return;}
 const lines=cart.map(item=>`• ${catalog[item.product].name} | Size ${item.size} | Qty ${item.qty} | ${rupiah(catalog[item.product].price*item.qty)}`);
 const total=cart.reduce((s,item)=>s+catalog[item.product].price*item.qty,0);
 const msg=`Halo VOLONTÀ, saya ingin melakukan pemesanan:\n\n${lines.join("\n")}\n\nSubtotal produk: ${rupiah(total)}\n\nDATA PEMBELI\nNama: ${name}\nNomor HP: ${phone}\nAlamat: ${address}\n\nMohon konfirmasi ketersediaan produk, ongkos kirim, dan total pembayaran. Terima kasih.`;
 window.open("https://wa.me/6281390100773?text="+encodeURIComponent(msg),"_blank","noopener");
});
const menu=document.querySelector(".menu-toggle");menu.addEventListener("click",()=>{const nav=document.querySelector(".main-nav");nav.classList.toggle("open");menu.setAttribute("aria-expanded",String(nav.classList.contains("open")));});
document.querySelectorAll(".main-nav a").forEach(a=>a.addEventListener("click",()=>document.querySelector(".main-nav").classList.remove("open")));
function openGuide(key){const g=sizes[key];document.getElementById("guide-title").textContent=g.title+" — SIZE GUIDE";document.getElementById("guide-table").innerHTML=`<div class="table-scroll"><table><thead><tr><th>Size</th><th>Lingkar dada</th><th>Lebar bahu</th><th>Panjang</th><th>TB</th><th>BB</th></tr></thead><tbody>${g.rows.map(r=>`<tr>${r.map(v=>`<td>${v}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;document.getElementById("guide-modal").classList.add("open");document.getElementById("guide-modal").setAttribute("aria-hidden","false");}
document.querySelectorAll("[data-guide]").forEach(b=>b.addEventListener("click",()=>openGuide(b.dataset.guide)));
document.getElementById("guide-close").addEventListener("click",()=>{document.getElementById("guide-modal").classList.remove("open");document.getElementById("guide-modal").setAttribute("aria-hidden","true");});
const reviewForm=document.getElementById("review-form"),reviewList=document.getElementById("reviews-list");
function escapeHTML(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function renderReviews(){const reviews=JSON.parse(localStorage.getItem("volonta-reviews")||"[]");reviewList.innerHTML=reviews.length?reviews.map(r=>`<article class="review-card"><div class="review-stars">${"★".repeat(r.rating)}${"☆".repeat(5-r.rating)}</div><strong>${escapeHTML(r.name)}</strong><span>${escapeHTML(r.product)}</span><p>${escapeHTML(r.message)}</p></article>`).join(""):'<p class="reviews-empty">Belum ada ulasan. Jadilah yang pertama berbagi pengalaman!</p>';}
reviewForm.addEventListener("submit",e=>{e.preventDefault();const reviews=JSON.parse(localStorage.getItem("volonta-reviews")||"[]");reviews.unshift({name:reviewForm.name.value.trim(),rating:Number(reviewForm.rating.value),product:reviewForm.product.value,message:reviewForm.message.value.trim()});localStorage.setItem("volonta-reviews",JSON.stringify(reviews));reviewForm.reset();renderReviews();});
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target);}}),{threshold:.12});
document.querySelectorAll(".section,.trust-strip,.about-section,.reviews-section,.info-section,.policy-section,.packaging-section").forEach(el=>{el.classList.add("reveal");observer.observe(el);});
save();renderReviews();

