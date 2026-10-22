/* ====================================================================
 * CẤU HÌNH HỆ THỐNG MÁY CHỦ & ĐĂNG NHẬP (VÕ LÂM IDLE)
 * ====================================================================
 * 
 * 👉 CÁCH BẬT / TẮT ĐĂNG NHẬP:
 * - Tạm tắt đăng nhập (Chơi Offline / Lưu trữ cục bộ LocalStorage):
 *       window.AUTH_ENABLED = false;
 * 
 * - Mở lại đăng nhập (ID/Pass & Đồng bộ Cloud Save qua Supabase):
 *       window.AUTH_ENABLED = true;
 *       (đồng thời điền URL và Anon Key của Supabase vào CHAT_CFG bên dưới)
 */

window.AUTH_ENABLED = true;

window.CHAT_CFG = {
  url: "https://zwrfpnkeisrwsmngsqvd.supabase.co",
  key: "sb_publishable_vqDaf9gPy7_Llpj4q1F-WQ_ZKnT-Enn",
};
