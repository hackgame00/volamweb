// js/unlock_all.js - Mở khóa toàn bộ tính năng và gỡ bỏ tất cả yêu cầu kèm theo
(function() {
  "use strict";

  console.log("⚡ [UNLOCK_ALL] Kích hoạt chế độ mở khóa toàn bộ tính năng và gỡ bỏ mọi yêu cầu...");

  // 1. Gỡ bỏ giới hạn cấp độ vào tính năng
  window.NOVICE_LV = 1;     // Gia nhập môn phái ngay từ cấp 1
  window.DT_LV = 1;         // Dã Tẩu mở từ cấp 1
  window.BOAT_LV = 1;       // Thuyền Phong Lăng Độ mở từ cấp 1
  window.TOWER_LV = 1;      // Leo Tháp mở từ cấp 1
  window.PET_LV = 1;        // Đồng hành (Pet) mở từ cấp 1
  window.REBORN_LV = 1;     // Cho phép Trùng Sinh bất kỳ lúc nào

  // 2. Mở toàn bộ số lượt hoạt động hàng ngày (Daily Caps)
  window.DG_RUNS = 9999;        // Lượt phó bản không giới hạn
  window.WB_TRIES = 9999;       // Boss thế giới không giới hạn lượt
  window.BOAT_RUNS = 9999;      // Lượt thuyền Phong Lăng Độ không giới hạn
  window.DT_DAY = 9999;         // Nhiệm vụ Dã Tẩu tối đa
  window.ST_FREE = 9999;        // Lượt khiêu chiến Sát Thủ
  window.LDT_BUY_DAY = 9999;    // Mua Lệnh bài Dã Tẩu không giới hạn

  // 3. Mở toàn bộ Bản đồ luyện công (ZONES)
  if (typeof window.zoneOpen === "function") {
    window.zoneOpen = function(idx) {
      return !!(window.ZONES && window.ZONES[idx]);
    };
  }

  // 4. Mở toàn bộ Phó bản (DUNGEONS)
  if (typeof window.dgUnlocked === "function") {
    window.dgUnlocked = function(d) {
      return true;
    };
  }

  // 5. Mở thuyền Phong Lăng Độ
  if (typeof window.boatOk === "function") {
    window.boatOk = function() {
      return true;
    };
  }

  // 6. Mở hàm kiểm tra chung unlocked(lv)
  if (typeof window.unlocked === "function") {
    window.unlocked = function(lv) {
      return true;
    };
  }

  // 7. Cho phép học và nâng cấp mọi Võ công (bỏ điều kiện điểm võ công, cấp độ, bí kíp)
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

  if (typeof window.canLearn === "function") {
    const origCanLearn = window.canLearn;
    window.canLearn = function(sk) {
      if (!sk) return false;
      if (window.S) {
        if (!window.S.skPts || window.S.skPts < 10) {
          window.S.skPts = 99; // Luôn đảm bảo đủ điểm cộng kỹ năng
        }
      }
      var cur = (window.S && window.S.sk && window.S.sk[sk.id]) || 0;
      var cap = typeof window.skCap === "function" ? window.skCap(sk) : (sk.max || 20);
      return cur < cap;
    };
  }

  // 8. Cho phép mặc trang bị không bị giới hạn Cấp độ, Môn phái, Ngũ hành, Giới tính, Thuộc tính
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

  // 9. Thần mã: Cho phép mua và thuần dưỡng ngay từ cấp 1
  if (typeof window.tmDef === "function" && Array.isArray(window.THAN_MA)) {
    window.THAN_MA.forEach(tm => {
      tm[4] = 1; // hạ level yêu cầu về 1
    });
  }

  // 10. Gỡ bỏ yêu cầu nguyên liệu (matHave) cho chế đồ, hợp thành, đổi lệnh bài, bí kíp
  // Cho phép kiểm tra nguyên liệu luôn trả về ít nhất số lượng yêu cầu để không bị chặn
  if (typeof window.matHave === "function") {
    const origMatHave = window.matHave;
    window.matHave = function(cat, id) {
      const real = origMatHave ? origMatHave(cat, id) : 0;
      return Math.max(999, real || 0);
    };
  }

  // 11. Gỡ bỏ giới hạn tiền tệ khi giao dịch, rèn đúc, nâng cấp (payGold)
  if (typeof window.payGold === "function") {
    window.payGold = function(amount) {
      if (window.S) {
        if (typeof window.S.gold === "number" && window.S.gold >= amount) {
          window.S.gold -= amount;
        }
      }
      return true; // Luôn thành công kể cả khi thiếu ngân lượng
    };
  }

  // 12. Gỡ bỏ giới hạn Kỳ Trân Các (KTC) - Cho phép mua vật phẩm tự do
  if (typeof window.ktcCan === "function") {
    window.ktcCan = function(item, count) {
      return true; // Luôn cho phép mua
    };
  }

  // 13. Gỡ bỏ giới hạn dùng sách Võ Lâm Mật Tịch, Tẩy Tủy Kinh (tối đa 15 cuốn trước đây)
  if (typeof window.useOk === "function") {
    window.useOk = function(item) {
      return true;
    };
  }

  if (typeof window.useLvOk === "function") {
    window.useLvOk = function(item) {
      return true;
    };
  }

  // 14. Đảm bảo khởi tạo người chơi có đủ tài nguyên trải nghiệm
  function ensureSupplies() {
    if (typeof window.S !== "undefined" && window.S) {
      if (typeof window.S.gold === "number" && window.S.gold < 10000000) {
        window.S.gold = 50000000; // 50 vạn ngân lượng
      }
      if (typeof window.S.knb === "number" && window.S.knb < 10000) {
        window.S.knb = 50000;    // 5 vạn Kim Nguyên Bảo
      }
      if (typeof window.S.skPts === "number" && window.S.skPts < 50) {
        window.S.skPts = 99;     // 99 điểm kỹ năng
      }
      if (typeof window.S.potPts === "number" && window.S.potPts < 100) {
        window.S.potPts = 500;   // 500 điểm tiềm năng
      }
    }
  }

  // 15. Mở công tắc mạng / bảo trì
  window.NET_PAUSE = [];

  // Tự động kích hoạt lại UI và cấp tài nguyên khi trang tải
  window.addEventListener("load", function() {
    ensureSupplies();
    setTimeout(function() {
      ensureSupplies();
      if (typeof window.refresh === "function") {
        window.refresh();
      }
    }, 500);
  });

  // Chạy thêm một lần định kỳ nhẹ để duy trì trạng thái khi người chơi đổi tab
  setInterval(function() {
    ensureSupplies();
  }, 10000);
})();
