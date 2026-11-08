const catalog={
 denim:{name:"VOLONTÀ Denim Jacket",price:399000},
 blouson:{name:"VOLONTÀ Asymmetric Blouson",price:499000},
 leather:{name:"VOLONTÀ Leather Jacket",price:549000},
 obsidian:{name:"VOLONTÀ Obsidian Moto Jacket",price:459000},
 indigo:{name:"VOLONTÀ Indigo Zip Bomber",price:429000},
 midnight:{name:"VOLONTÀ Midnight Plaid Collar Jacket",price:399000},
 shadow:{name:"VOLONTÀ Shadow Leather Bomber",price:489000},
 coal:{name:"VOLONTÀ Coal Denim Utility Jacket",price:379000}
};
const sizes={
 denim:{title:"DENIM JACKET",rows:[["S",100,44,63,"160–168 cm","48–55 kg"],["M",104,46,65,"165–173 cm","55–63 kg"],["L",108,48,67,"170–178 cm","63–72 kg"],["XL",112,50,69,"175–185 cm","72–82 kg"]]},
 blouson:{title:"ASYMMETRIC BLOUSON",rows:[["S",104,45,62,"160–168 cm","48–55 kg"],["M",108,47,64,"165–173 cm","55–63 kg"],["L",112,49,66,"170–178 cm","63–72 kg"],["XL",116,51,68,"175–185 cm","72–82 kg"]]},
 leather:{title:"LEATHER JACKET",rows:[["S",102,44,63,"160–168 cm","48–55 kg"],["M",106,46,65,"165–173 cm","55–63 kg"],["L",110,48,67,"170–178 cm","63–72 kg"],["XL",114,50,69,"175–185 cm","72–82 kg"]]},
 obsidian:{title:"OBSIDIAN MOTO JACKET",rows:[["S",104,46,62,"160–168 cm","48–55 kg"],["M",108,48,64,"165–173 cm","55–63 kg"],["L",112,50,66,"170–178 cm","63–72 kg"],["XL",116,52,68,"175–185 cm","72–82 kg"]]},
 indigo:{title:"INDIGO ZIP BOMBER",rows:[["S",108,48,59,"160–168 cm","48–55 kg"],["M",112,50,61,"165–173 cm","55–63 kg"],["L",116,52,63,"170–178 cm","63–72 kg"],["XL",120,54,65,"175–185 cm","72–82 kg"]]},
 midnight:{title:"MIDNIGHT PLAID COLLAR JACKET",rows:[["S",106,46,64,"160–168 cm","48–55 kg"],["M",110,48,66,"165–173 cm","55–63 kg"],["L",114,50,68,"170–178 cm","63–72 kg"],["XL",118,52,70,"175–185 cm","72–82 kg"]]},
 shadow:{title:"SHADOW LEATHER BOMBER",rows:[["S",104,46,58,"160–168 cm","48–55 kg"],["M",108,48,60,"165–173 cm","55–63 kg"],["L",112,50,62,"170–178 cm","63–72 kg"],["XL",116,52,64,"175–185 cm","72–82 kg"]]},
 coal:{title:"COAL DENIM UTILITY JACKET",rows:[["S",102,44,62,"160–168 cm","48–55 kg"],["M",106,46,64,"165–173 cm","55–63 kg"],["L",110,48,66,"170–178 cm","63–72 kg"],["XL",114,50,68,"175–185 cm","72–82 kg"]]}
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
let activeDialog=null,dialogReturnFocus=null;
function openDialog(dialog,returnFocus){if(activeDialog)closeDialog(activeDialog,false);activeDialog=dialog;dialogReturnFocus=returnFocus||document.activeElement;dialog.inert=false;dialog.setAttribute("aria-hidden","false");if(dialog===document.getElementById("cart-panel")){dialog.classList.add("open");document.getElementById("overlay").classList.add("show");}else dialog.classList.add("open");dialog.querySelector("button")?.focus();}
function closeDialog(dialog,restoreFocus=true){if(!dialog||dialog!==activeDialog)return;dialog.classList.remove("open");dialog.setAttribute("aria-hidden","true");dialog.inert=true;if(dialog===document.getElementById("cart-panel"))document.getElementById("overlay").classList.remove("show");activeDialog=null;const target=dialogReturnFocus;dialogReturnFocus=null;if(restoreFocus&&target?.isConnected)target.focus();}
function toggleCart(open,trigger){const panel=document.getElementById("cart-panel");if(open)openDialog(panel,trigger||document.querySelector(".cart-trigger"));else closeDialog(panel);}
function showCheckoutMessage(text,type="error"){const node=document.getElementById("checkout-message");node.textContent=text;node.className=`checkout-message ${type}`;node.hidden=!text;}
document.querySelectorAll(".add-button").forEach(b=>b.addEventListener("click",()=>{const k=b.dataset.product;const select=document.getElementById(`size-${k}`);const error=select.closest(".product-actions").querySelector(".size-error");if(!select.value){if(error)error.hidden=false;select.setAttribute("aria-invalid","true");select.focus();return;}if(error)error.hidden=true;select.removeAttribute("aria-invalid");const existing=cart.find(x=>x.product===k&&x.size===select.value);if(existing)existing.qty++;else cart.push({product:k,size:select.value,qty:1});save();toggleCart(true,b);}));
document.querySelectorAll(".size-select").forEach(select=>select.addEventListener("change",()=>{select.removeAttribute("aria-invalid");const error=select.closest(".product-actions").querySelector(".size-error");if(error)error.hidden=true;}));
document.querySelector(".cart-trigger").addEventListener("click",()=>toggleCart(true));
document.getElementById("close-cart").addEventListener("click",()=>toggleCart(false));
document.getElementById("overlay").addEventListener("click",()=>toggleCart(false));
document.getElementById("checkout").addEventListener("click",async()=>{
 showCheckoutMessage("");
 if(!cart.length){showCheckoutMessage("Keranjang masih kosong. Tambahkan produk sebelum checkout.");return;}
 const customerSession=await VolontaAuth.session();
 if(!customerSession){localStorage.setItem("volonta-checkout-draft",JSON.stringify({name:document.getElementById("buyer-name").value,phone:document.getElementById("buyer-phone").value,address:document.getElementById("buyer-address").value}));window.location.href="account.html?next=checkout";return;}
 const name=document.getElementById("buyer-name").value.trim(),phone=document.getElementById("buyer-phone").value.trim(),address=document.getElementById("buyer-address").value.trim();
 if(!name||!phone||!address){showCheckoutMessage("Mohon lengkapi nama, nomor HP, dan alamat pengiriman.");return;}
 const lines=cart.map(item=>`• ${catalog[item.product].name} | Size ${item.size} | Qty ${item.qty} | ${rupiah(catalog[item.product].price*item.qty)}`);
 const total=cart.reduce((s,item)=>s+catalog[item.product].price*item.qty,0);
 const orderNumber=`VLT-${new Date().toISOString().slice(2,10).replaceAll("-","")}-${crypto.randomUUID().slice(0,6).toUpperCase()}`;
 const msg=`Halo VOLONTÀ, saya ingin melakukan pemesanan.\nNomor pesanan: ${orderNumber}\n\n${lines.join("\n")}\n\nSubtotal produk: ${rupiah(total)}\n\nDATA PEMBELI\nNama: ${name}\nNomor HP: ${phone}\nAlamat: ${address}\n\nMohon konfirmasi ketersediaan produk, ongkos kirim, dan total pembayaran. Terima kasih.`;
 const waWindow=window.open("about:blank","_blank");
 const button=document.getElementById("checkout");button.disabled=true;button.textContent="MENYIMPAN PESANAN…";
 const payload={order_number:orderNumber,user_id:customerSession.user.id,buyer_name:name,buyer_phone:phone,buyer_address:address,items:cart.map(item=>({product_key:item.product,size:item.size,quantity:item.qty})),subtotal:total,status:"new"};
 (async()=>{try{
  if(!reviewApiReady())throw new Error("Database pesanan belum dikonfigurasi. Silakan hubungi admin melalui WhatsApp.");
  const response=await fetch(`${reviewConfig.url.replace(/\/$/,"")}/rest/v1/orders`,{method:"POST",headers:{"Content-Type":"application/json",Prefer:"return=minimal",apikey:reviewConfig.publishableKey,Authorization:`Bearer ${customerSession.access_token}`},body:JSON.stringify(payload)});
  if(!response.ok){let detail="";try{const body=await response.json();detail=body.message||body.details||body.hint||"";}catch{}throw new Error(detail?`Pesanan gagal disimpan: ${detail}`:"Pesanan belum berhasil disimpan. Coba lagi beberapa saat.");}
  const waUrl="https://wa.me/6281390100773?text="+encodeURIComponent(msg);
  if(waWindow)waWindow.location.replace(waUrl);
  cart=[];save();
  localStorage.removeItem("volonta-checkout-draft");
  window.location.href="account.html?orders=1";
 }catch(error){if(waWindow)waWindow.close();showCheckoutMessage(error.message||"Pesanan gagal disimpan.");}
 finally{button.disabled=false;button.textContent="CHECKOUT VIA WHATSAPP";}})();
});
const menu=document.querySelector(".menu-toggle");menu.addEventListener("click",()=>{const nav=document.querySelector(".main-nav");const isOpen=nav.classList.toggle("open");menu.setAttribute("aria-expanded",String(isOpen));menu.setAttribute("aria-label",isOpen?"Tutup navigasi":"Buka navigasi");});
document.querySelectorAll(".main-nav a").forEach(a=>a.addEventListener("click",()=>{const nav=document.querySelector(".main-nav");nav.classList.remove("open");menu.setAttribute("aria-expanded","false");menu.setAttribute("aria-label","Buka navigasi");}));
function openGuide(key,trigger){const g=sizes[key];document.getElementById("guide-title").textContent=g.title+" — SIZE GUIDE";document.getElementById("guide-table").innerHTML=`<div class="table-scroll"><table><thead><tr><th>Size</th><th>Lingkar dada</th><th>Lebar bahu</th><th>Panjang</th><th>TB</th><th>BB</th></tr></thead><tbody>${g.rows.map(r=>`<tr>${r.map(v=>`<td>${v}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;openDialog(document.getElementById("guide-modal"),trigger);}
document.querySelectorAll("[data-guide]").forEach(b=>b.addEventListener("click",()=>openGuide(b.dataset.guide,b)));
document.getElementById("guide-close").addEventListener("click",()=>closeDialog(document.getElementById("guide-modal")));
document.getElementById("guide-modal").addEventListener("click",event=>{if(event.target===event.currentTarget)closeDialog(event.currentTarget);});
document.addEventListener("keydown",event=>{if(event.key==="Escape"&&activeDialog){event.preventDefault();closeDialog(activeDialog);return;}if(event.key!=="Tab"||!activeDialog)return;const focusable=[...activeDialog.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(el=>!el.hidden);if(!focusable.length){event.preventDefault();return;}const first=focusable[0],last=focusable[focusable.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}});
const reviewForm=document.getElementById("review-form");
const reviewList=document.getElementById("reviews-list");
const reviewStatus=document.getElementById("review-status");
const reviewConfig=window.VOLONTA_SUPABASE_CONFIG||{};
const productLabels={denim:"Denim Jacket",blouson:"Asymmetric Blouson",leather:"Leather Jacket",obsidian:"Obsidian Moto Jacket",indigo:"Indigo Zip Bomber",midnight:"Midnight Plaid Collar Jacket",shadow:"Shadow Leather Bomber",coal:"Coal Denim Utility Jacket"};
function setReviewStatus(message,type=""){reviewStatus.textContent=message;reviewStatus.className=`review-status ${type}`;}
function renderPublicReviews(reviews){
 reviewList.replaceChildren();
 if(!reviews.length){const empty=document.createElement("p");empty.className="reviews-empty";empty.textContent="Belum ada ulasan.";reviewList.append(empty);return;}
 for(const item of reviews){
  const card=document.createElement("article");card.className="review-card";
  const stars=document.createElement("div");stars.className="review-stars";stars.textContent="★".repeat(item.rating)+"☆".repeat(5-item.rating);
  const name=document.createElement("strong");name.textContent=item.reviewer_name;
  const meta=document.createElement("span");meta.textContent=`${productLabels[item.product_key]||"Produk VOLONTÀ"} · Ulasan komunitas`;
  const body=document.createElement("p");body.textContent=item.body;
  card.append(stars,name,meta,body);reviewList.append(card);
 }
}
function reviewApiReady(){return Boolean(reviewConfig.url&&reviewConfig.publishableKey&&!reviewConfig.url.includes("YOUR_PROJECT"));}
async function loadPublicReviews(){
 if(!reviewApiReady()){reviewList.innerHTML='<p class="reviews-empty">Ulasan publik akan tampil setelah database dihubungkan.</p>';return;}
 try{
  const base=reviewConfig.url.replace(/\/$/,"");
  const response=await fetch(`${base}/rest/v1/reviews?select=reviewer_name,product_key,rating,body,created_at&status=eq.approved&order=created_at.desc&limit=30`,{headers:{apikey:reviewConfig.publishableKey,Authorization:`Bearer ${reviewConfig.publishableKey}`}});
  if(!response.ok)throw new Error("Tidak dapat memuat ulasan.");
  renderPublicReviews(await response.json());
 }catch(error){reviewList.innerHTML='<p class="reviews-empty">Ulasan belum dapat dimuat. Silakan coba lagi nanti.</p>';}
}
reviewForm.addEventListener("submit",async event=>{
 event.preventDefault();
 if(!reviewApiReady()){setReviewStatus("Ulasan belum aktif. Database VOLONTÀ belum dihubungkan.","error");return;}
 const button=reviewForm.querySelector('button[type="submit"]');button.disabled=true;setReviewStatus("Mengirim ulasan…");
 const payload={reviewer_name:reviewForm.elements.reviewerName.value.trim(),product_key:reviewForm.elements.product.value,rating:Number(reviewForm.elements.rating.value),body:reviewForm.elements.message.value.trim(),status:"approved"};
 try{
  const response=await fetch(`${reviewConfig.url.replace(/\/$/,"")}/rest/v1/reviews`,{method:"POST",headers:{"Content-Type":"application/json",Prefer:"return=minimal",apikey:reviewConfig.publishableKey,Authorization:`Bearer ${reviewConfig.publishableKey}`},body:JSON.stringify(payload)});
  if(!response.ok)throw new Error("Ulasan gagal dikirim. Periksa koneksi lalu coba lagi.");
  reviewForm.reset();setReviewStatus("Terima kasih! Ulasan Anda sudah terkirim dan langsung tampil.","success");loadPublicReviews(); }catch(error){setReviewStatus(error.message||"Ulasan gagal dikirim. Coba lagi.","error");}
 finally{button.disabled=false;}
});
loadPublicReviews();const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target);}}),{threshold:.12});
document.querySelectorAll(".section,.trust-strip,.about-section,.reviews-section,.info-section,.policy-section,.packaging-section").forEach(el=>{el.classList.add("reveal");observer.observe(el);});
save();
if(new URLSearchParams(location.search).get("resume_checkout")==="1"){
 try{const draft=JSON.parse(localStorage.getItem("volonta-checkout-draft")||"null");if(draft){document.getElementById("buyer-name").value=draft.name||"";document.getElementById("buyer-phone").value=draft.phone||"";document.getElementById("buyer-address").value=draft.address||"";}}
 catch{localStorage.removeItem("volonta-checkout-draft");}
 toggleCart(true);
}






