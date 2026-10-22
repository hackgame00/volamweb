// js/unlock_all.js - Mở khóa toàn bộ tính năng và giới hạn cho người chơi
(function() {
  "use strict";

  console.log("⚡ [UNLOCK_ALL] Kích hoạt chế độ mở khóa toàn bộ tính năng...");

  // 1. Gỡ bỏ giới hạn cấp độ vào tính năng
  window.NOVICE_LV = 1;     // Gia nhập môn phái ngay từ cấp 1
  window.DT_LV = 1;         // Dã Tẩu mở từ cấp 1
  window.BOAT_LV = 1;       // Thuyền Phong Lăng Độ mở từ cấp 1
  window.TOWER_LV = 1;      // Leo Tháp mở từ cấp 1
  window.PET_LV = 1;        // Đồng hành (Pet) mở từ cấp 1
  window.REBORN_LV = 1;     // Cho phép Trùng Sinh bất kỳ lúc nào

  // 2. Mở toàn bộ Bản đồ luyện công (ZONES)
  if (typeof window.zoneOpen === "function") {
    window.zoneOpen = function(idx) {
      return !!(window.ZONES && window.ZONES[idx]);
    };
  }

  // 3. Mở toàn bộ Phó bản (DUNGEONS)
  if (typeof window.dgUnlocked === "function") {
    window.dgUnlocked = function(d) {
      return true;
    };
  }

  // 4. Mở thuyền Phong Lăng Độ
  if (typeof window.boatOk === "function") {
    window.boatOk = function() {
      return true;
    };
  }

  // 5. Mở hàm kiểm tra chung unlocked(lv)
  if (typeof window.unlocked === "function") {
    window.unlocked = function(lv) {
      return true;
    };
  }

  // 6. Cho phép học và lĩnh ngộ mọi Võ công (kể cả võ công 90 không cần bí kíp, không chờ cấp)
  if (typeof window.bookOk === "function") {
    window.bookOk = function(sk) {
      return true;
    };
  }

  if (typeof window.skReqOk === "function") {
    window.skReqOk = function(sk) {
      return true;
    };
  }

  // 7. Cho phép mặc trang bị không bị giới hạn Cấp độ, Môn phái, Ngũ hành, Giới tính
  if (typeof window.reqOk === "function") {
    window.reqOk = function(item) {
      return true;
    };
  }

  if (typeof window.reqLineOk === "function") {
    window.reqLineOk = function(k, v) {
      return true;
    };
  }

  if (typeof window.sexOk === "function") {
    window.sexOk = function(req) {
      return true;
    };
  }

  // 8. Thần mã: Cho phép mua và thuần dưỡng ngay từ cấp 1
  if (typeof window.tmDef === "function" && Array.isArray(window.THAN_MA)) {
    window.THAN_MA.forEach(tm => {
      tm[4] = 1; // hạ level yêu cầu về 1
    });
  }

  // 9. Mở công tắc mạng / bảo trì (nếu có)
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
