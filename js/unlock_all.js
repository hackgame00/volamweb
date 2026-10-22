// js/unlock_all.js - Giữ nguyên các giới hạn cấp độ & vật phẩm gốc, chỉ mở các tính năng hệ thống/bảo trì cần thiết
(function() {
  "use strict";

  console.log("⚡ [UNLOCK_ALL] Đã khôi phục (Undo) giới hạn Cấp độ và Vật phẩm theo nguyên bản game.");

  // Mở công tắc mạng / bảo trì (nếu có) để không bị treo màn hình kết nối
  window.NET_PAUSE = [];

  // Tự động kích hoạt lại UI khi tải xong
  window.addEventListener("load", function() {
    setTimeout(function() {
      if (typeof window.refresh === "function") {
        window.refresh();
      }
    }, 500);
  });
})();
