// Supabase Auth helper shared by the storefront and customer account page.
(() => {
  const config = window.VOLONTA_SUPABASE_CONFIG || {};
  const base = (config.url || "").replace(/\/$/, "");
  const key = config.publishableKey || "";
  const storageKey = "volonta-customer-session";
  function read() { try { return JSON.parse(localStorage.getItem(storageKey) || "null"); } catch { return null; } }
  function save(session) {
    if (session?.access_token && session?.refresh_token) localStorage.setItem(storageKey, JSON.stringify(session));
    else localStorage.removeItem(storageKey);
  }
  async function request(path, options = {}) {
    if (!base || !key) throw new Error("Konfigurasi akun belum tersedia. Silakan hubungi admin.");
    const response = await fetch(`${base}${path}`, { ...options, headers: { apikey: key, "Content-Type": "application/json", ...(options.headers || {}) } });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.msg || result.message || result.error_description || "Permintaan akun gagal.");
    return result;
  }
  async function session() {
    let current = read();
    if (!current?.access_token) return null;
    if (Number(current.expires_at || 0) * 1000 < Date.now() + 30000) {
      try { current = await request("/auth/v1/token?grant_type=refresh_token", { method: "POST", body: JSON.stringify({ refresh_token: current.refresh_token }) }); save(current); }
      catch { save(null); return null; }
    }
    try { const user = await request("/auth/v1/user", { headers: { Authorization: `Bearer ${current.access_token}` } }); return { ...current, user }; }
    catch { save(null); return null; }
  }
  async function signIn(email, password) {
    const result = await request("/auth/v1/token?grant_type=password", { method: "POST", body: JSON.stringify({ email, password }) }); save(result); return result;
  }
  async function signUp(email, password) {
    const result = await request("/auth/v1/signup", { method: "POST", body: JSON.stringify({ email, password }) });
    if (result.access_token) save(result);
    return result;
  }
  async function signOut() {
    const current = read(); save(null);
    if (current?.access_token) { try { await request("/auth/v1/logout", { method: "POST", headers: { Authorization: `Bearer ${current.access_token}` } }); } catch { /* Local session is already cleared. */ } }
  }
  window.VolontaAuth = { request, session, signIn, signUp, signOut };
})();
