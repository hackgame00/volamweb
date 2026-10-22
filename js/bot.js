"use strict";
/* ====================================================================
 * HỆ THỐNG HIỆP KHÁCH GIANG HỒ / BOT ẢO ĐA DẠNG (BOT_SYSTEM.JS)
 * - Tự do chạy khắp toàn bộ bản đồ để săn quái, farm bãi riêng biệt
 * - Hiển thị 100% đầy đủ ngoại hình (JXLOOK HD / Sprite môn phái sắc nét)
 * - Đầy đủ 10 môn phái với ngoại hình và màu sắc đặc trưng
 * - Đầy đủ các tầng lớp cấp độ: Tân thủ, Trung cấp, Đại hiệp, Cao thủ, Tông sư
 * - Kỹ năng võ công riêng biệt của từng môn phái phát sáng sinh động
 * - Tự động chat thế giới, khoe đồ, rủ party, tạo không khí đông vui
 * ==================================================================== */

const ALL_FACTIONS = [
  { key: "shaolin", n: "Thiếu Lâm", col: "#f3d35b", wp: 10, sex: 0 },    // Côn
  { key: "tianwang", n: "Thiên Vương", col: "#f3d35b", wp: 16, sex: 0 },  // Chùy / Thương
  { key: "tangmen", n: "Đường Môn", col: "#6fd46a", wp: 19, sex: 0 },    // Ám khí
  { key: "wudu", n: "Ngũ Độc", col: "#6fd46a", wp: 4, sex: 0 },          // Đao
  { key: "emei", n: "Nga My", col: "#5fb8ff", wp: 1, sex: 1 },           // Kiếm
  { key: "cuiyan", n: "Thúy Yên", col: "#5fb8ff", wp: 4, sex: 1 },       // Đao
  { key: "gaibang", n: "Cái Bang", col: "#ff6a3a", wp: 0, sex: 0 },      // Chưởng
  { key: "tianren", n: "Thiên Nhẫn", col: "#ff6a3a", wp: 7, sex: 0 },     // Thương
  { key: "wudang", n: "Võ Đang", col: "#c8965a", wp: 1, sex: 0 },         // Kiếm
  { key: "kunlun", n: "Côn Lôn", col: "#c8965a", wp: 4, sex: 0 }          // Đao
];

// Các tầng lớp hiệp khách giang hồ
const BOT_TIERS = [
  { name: "Tân Thủ", minLv: 15, maxLv: 39, title: "«Sơ Nhập Giang Hồ»", tCol: "#a0a0a0", aura: null, horseR: -1, enh: 0 },
  { name: "Hiệp Khách", minLv: 40, maxLv: 69, title: "«Hành Hiệp Trượng Nghĩa»", tCol: "#6aa8ff", aura: "#6aa8ff", horseR: 0, enh: 4 },
  { name: "Đại Hiệp", minLv: 70, maxLv: 99, title: "«Danh Chấn Tứ Hải»", tCol: "#ff9a3c", aura: "#ff9a3c", horseR: 1, enh: 7 },
  { name: "Cao Thủ", minLv: 100, maxLv: 149, title: "«Tuyệt Thế Cao Thủ»", tCol: "#c77bff", aura: "#c77bff", horseR: 6, enh: 10 },
  { name: "Tông Sư", minLv: 150, maxLv: 200, title: "«Độc Cô Cầu Bại»", tCol: "#ffd76a", aura: "#ffd76a", horseR: 7, enh: 12 }
];

const BOT_NAMES = [
  "Độc Cô Cầu Bại", "Lệnh Hồ Xung", "Dương Quá", "Tiểu Long Nữ", "Kiều Phong",
  "Đoàn Dự", "Hư Trúc", "Trương Vô Kỵ", "Triệu Mẫn", "Chu Chỉ Nhược",
  "Tạ Tốn", "Hoàng Dược Sư", "Âu Dương Phong", "Hồng Thất Công", "Nhất Đăng Đại Sư",
  "Phong Thanh Dương", "Nhậm Ngã Hành", "Đông Phương Bất Bại", "Vi Tiểu Bảo",
  "Quách Tĩnh", "Hoàng Dung", "Mộ Dung Phục", "Cưu Ma Trí", "Doãn Chí Bình",
  "Khương Tử Nha", "Tiêu Viêm", "Hàn Lập", "Lâm Động", "Diệp Phàm", "Thạch Hạo",
  "Bá Đao Tuyệt Tình", "Kiếm Ma", "Huyết Thủ Ma Tôn", "Bất Bại Cuồng Nhân",
  "Lãng Tử Vô Tình", "Tiểu Ngư Nhi", "Hoa Vô Khuyết", "Sở Lưu Hương", "Lục Tiểu Phụng",
  "Tây Độc", "Bắc Cái", "Đông Tà", "Nam Đế", "Trung Thần Thông", "Vương Trùng Dương",
  "Trương Tam Phong", "Tống Viễn Kiều", "Du Liên Châu", "Ân Lê Đình", "Mạc Thanh Cốc",
  "Bạch Ngọc Đường", "Triển Chiêu", "Lý Tầm Hoan", "A Phi", "Thẩm Lãng"
];

const BOT_CHATS = [
  "Bãi train này quái ra đông phết, cắm auto sướng thật!",
  "Vừa nhặt được món đồ Tím 6 dòng max opt ae ơi!",
  "Ai đi săn Boss Hoàng Kim không lập team nào!",
  "Mới đập cây vũ khí lên +10 mừng rơi nước mắt =))",
  "Chợ có ai bán Bí Kíp 90 không mua giá cao!",
  "Hôm nay may mắn ra được Rương Thần Mã, phê quá!",
  "Môn phái nào cày cấp nhanh nhất vậy các bác?",
  "Tối nay ai đi Tống Kim không, giao lưu tí nào!",
  "Đang cắm train ở bãi, ae né dùm đừng ks nha haha",
  "Game chơi cuốn thật, hoài niệm thời VLTK 2005 ghê!",
  "Võ Đang Khí đánh tầm xa sướng thật, quái chưa tới đã nằm",
  "Thiên Vương Chùy trâu bò quá, đứng tank cả bãi quái",
  "Nga My buff máu liên tục đi phụ bản nhàn tênh",
  "Bác nào rảnh kéo em qua ải Dã Tẩu với!",
  "Có ai săn được đồ Bạch Kim chưa show hàng ae chiêm ngưỡng với!"
];

let BOT_LIST = [];
let botLastSpawn = 0;
let botLastChat = Date.now() + 5000;

// Tạo cấu hình ngoại hình JXLOOK chuẩn từng chi tiết cho Bot
function botJxSetup(sx, weaponIdx, horseRow) {
  if (typeof window.JXLOOK === "undefined" || !window.JXLOOK) return null;
  const JXL = window.JXLOOK;
  const n = sx ? "f" : "m";
  const rows = {
    helm: irnd(0, 3),
    armor: irnd(0, 5),
    weapon: weaponIdx || 0,
    horse: horseRow != null ? horseRow : -1
  };
  const r = (JXL.wnames[n] || [])[rows.weapon] || "空手";
  const t = (JXL.assoc && JXL.assoc[n] && JXL.assoc[n][r]) || (JXL.assoc && JXL.assoc[n] && JXL.assoc[n]["空手"]);
  if (!t) return null;
  const c = rows.horse >= 0 && t && t[1] ? 1 : 0;
  return {
    sx: n,
    rows: rows,
    asc: t[c] || t[0] || {},
    ride: c,
    key: JSON.stringify([n, rows, c])
  };
}

// Sinh Bot tại một điểm bất kỳ trên toàn bộ map thế giới
function spawnOneBot() {
  if (!S || !S.fac || BOT_LIST.length >= 8) return;
  
  // Chọn ngẫu nhiên môn phái trong 10 phái
  const fac = pick(ALL_FACTIONS);
  const tier = pick(BOT_TIERS);
  const botLvl = irnd(tier.minLv, tier.maxLv);
  const botName = pick(BOT_NAMES.filter(n => n !== S.name && !BOT_LIST.some(b => b.name === n))) || ("Hiệp Khách " + irnd(100, 999));
  
  // Vị trí sinh ngẫu nhiên khắp map
  let bx, by;
  const pts = (R.field && R.field.pts) ? R.field.pts : [];
  if (pts.length && Math.random() < 0.7) {
    const pt = pick(pts);
    [bx, by] = inWorld(pt.x + rnd(-80, 80), pt.y + rnd(-80, 80));
  } else {
    [bx, by] = inWorld(rnd(200, WORLD.w - 200), rnd(200, WORLD.h - 200));
  }
  
  const botSex = fac.sex;
  const horseRow = (tier.horseR >= 0 && botLvl >= 30) ? tier.horseR : -1;
  const botJx = botJxSetup(botSex, fac.wp, horseRow);
  
  const bot = {
    oth: true,
    name: botName,
    fac: fac.key,
    facName: fac.n,
    facCol: fac.col,
    sex: botSex,
    lvl: botLvl,
    tierName: tier.name,
    title: tier.title,
    tCol: tier.tCol,
    auraCol: tier.aura,
    x: bx,
    y: by,
    px: bx,
    py: by,
    dir: irnd(0, 7),
    face: 1,
    act: "st",
    actT: 0,
    target: null,
    atkT: rnd(0.5, 1.2),
    moveT: rnd(3, 7),
    destX: null,
    destY: null,
    life: 1,
    maxLife: 800 + botLvl * 120,
    mounted: horseRow >= 0,
    jx: botJx,
    gear: {
      horse: horseRow >= 0 ? { d: 10, k: 0, n: "Chiến Mã", r: 4, lvl: 80, base: [[28, 50, 80]], mag: [] } : null
    }
  };
  
  BOT_LIST.push(bot);
}

// Cập nhật hành động của Bot trong trận đấu
function othTick(dt) {
  if (!S || !S.fac) return;
  
  // Duy trì từ 6 - 8 bot trên toàn map
  if (Date.now() - botLastSpawn > 6000 && BOT_LIST.length < 8) {
    botLastSpawn = Date.now();
    spawnOneBot();
  }
  
  for (const b of BOT_LIST) {
    b.actT = (b.actT || 0) + dt;
    
    // Tìm mục tiêu quái gần Bot nhất
    if (!b.target || b.target.dead || b.target.hp <= 0 || Math.hypot(b.target.x - b.x, b.target.y - b.y) > 300) {
      const candidates = (R.enemies || []).filter(e => !e.dead && e.hp > 0 && Math.hypot(e.x - b.x, e.y - b.y) < 300);
      b.target = candidates.length ? candidates[0] : null;
    }
    
    if (b.target) {
      const dx = b.target.x - b.x;
      const dy = b.target.y - b.y;
      const dist = Math.hypot(dx, dy);
      b.face = dx >= 0 ? 1 : -1;
      b.dir = dirOf(dx, dy);
      
      const atkRange = ["tangmen", "wudu", "wudang", "cuiyan"].includes(b.fac) ? 140 : 65;
      
      if (dist > atkRange) {
        // Chạy lại gần quái để đánh
        const spd = (b.mounted ? 180 : 130) * dt;
        b.x += (dx / dist) * spd;
        b.y += (dy / dist) * spd;
        b.act = "run";
      } else {
        // Tấn công quái
        b.act = "at";
        b.atkT = (b.atkT || 0) - dt;
        if (b.atkT <= 0) {
          b.atkT = rnd(0.6, 1.1);
          b.actT = 0;
          
          if (b.target && !b.target.dead) {
            const dmg = Math.round((180 + b.lvl * 28) * rnd(0.85, 1.15));
            b.target.hp -= dmg;
            
            if (typeof addText === "function") {
              addText(b.target.x + rnd(-12, 12), b.target.y - b.target.r - 8, fmt(dmg), b.facCol, 11);
            }
            if (typeof burst === "function") {
              burst(b.target.x, b.target.y, b.facCol);
            }
          }
        }
      }
    } else {
      // Tự động chạy đi tìm bãi quái mới trên map
      b.moveT = (b.moveT || 0) - dt;
      if (b.moveT <= 0 || b.destX == null) {
        b.moveT = rnd(4, 9);
        const pts = (R.field && R.field.pts) ? R.field.pts : [];
        if (pts.length) {
          const destPt = pick(pts);
          b.destX = destPt.x + rnd(-70, 70);
          b.destY = destPt.y + rnd(-70, 70);
        } else {
          b.destX = clamp(b.x + rnd(-250, 250), 200, WORLD.w - 200);
          b.destY = clamp(b.y + rnd(-250, 250), 200, WORLD.h - 200);
        }
      }
      
      const dx = b.destX - b.x;
      const dy = b.destY - b.y;
      const d = Math.hypot(dx, dy);
      if (d > 15) {
        b.act = "run";
        b.face = dx >= 0 ? 1 : -1;
        b.dir = dirOf(dx, dy);
        const spd = (b.mounted ? 120 : 85) * dt;
        b.x += (dx / d) * spd;
        b.y += (dy / d) * spd;
      } else {
        b.act = "st";
      }
    }
    
    [b.x, b.y] = inWorld(b.x, b.y);
  }
  
  // Tin nhắn thế giới ngẫu nhiên từ Bot
  if (Date.now() - botLastChat > 20000 && typeof chatPush === "function") {
    botLastChat = Date.now() + rnd(12000, 28000);
    const b = BOT_LIST.length ? pick(BOT_LIST) : { name: pick(BOT_NAMES), facName: pick(ALL_FACTIONS).n, lvl: irnd(30, 160) };
    chatPush({
      id: "bot_" + Date.now(),
      cid: "bot_" + Math.random().toString(36).slice(2, 7),
      name: b.name,
      fac: b.facName,
      lvl: b.lvl,
      msg: pick(BOT_CHATS),
      ts: Date.now()
    });
  }
}

function othEnts() {
  return BOT_LIST.map(b => ({ oth: b, y: b.y }));
}

// Vẽ Bot lên màn hình: Sử dụng JXLOOK HD, nếu chưa tải xong sẽ vẽ Sprite môn phái sắc nét
function othDraw(ctx, b, dt) {
  if (!b) return;
  
  // Bóng đổ dưới chân
  ctx.fillStyle = "#0007";
  ctx.beginPath();
  ctx.ellipse(b.x, b.y, 15, 6, 0, 0, 7);
  ctx.fill();
  
  // Hào quang võ công dưới chân cho các bậc Cao Thủ & Tông Sư
  if (b.auraCol) {
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.strokeStyle = b.auraCol;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(b.x, b.y, 22, 9, 0, 0, 7);
    ctx.stroke();
    ctx.restore();
  }
  
  // 1. Thử vẽ bằng hệ thống JXLOOK hoàn chỉnh (có giáp, vũ khí, ngựa)
  let drawn = false;
  if (typeof drawJxHero === "function" && b.jx) {
    const scale = typeof HERO_SCALE !== "undefined" ? HERO_SCALE : 1.35;
    const res = drawJxHero(b.act || "st", b.dir || 0, b.actT || 0, b.x, b.y, scale, 1, null, b.jx);
    if (res) drawn = true;
  }
  
  // 2. Nếu JXLOOK chưa sẵn sàng, vẽ bằng Sprite môn phái chính xác 100%
  if (!drawn && typeof drawSprite === "function" && typeof img === "function") {
    const plImg = img("img/pl/" + b.fac + ".png");
    if (plImg && plImg.complete && plImg.naturalWidth) {
      drawSprite(plImg, [60, 60, 30, 55], b.x, b.y, 1.1, b.face < 0, 1);
      drawn = true;
    }
  }
  
  // 3. Fallback cuối cùng nếu ảnh chưa tải xong: hình cầu ngũ hành
  if (!drawn) {
    ctx.fillStyle = b.facCol || "#ffd76a";
    ctx.beginPath();
    ctx.arc(b.x, b.y - 20, 14, 0, 7);
    ctx.fill();
  }
  
  // Hiển thị Danh hiệu, Môn phái, Tên và Cấp độ
  const labelY = b.y - 72;
  if (typeof label === "function") {
    label(
      b.x,
      labelY,
      `${b.name} · Lv${b.lvl}`,
      b.facCol || "#ffd76a",
      11,
      1,
      "#4fd04f",
      `${b.title} [${b.facName}]`,
      b.tCol || "#ffffff",
      b.facCol
    );
  }
}

// Thông tin nhân vật Bot khi người chơi click xem trang bị
window.getBotProfile = function(name) {
  const b = BOT_LIST.find(x => x.name === name);
  if (b) {
    return {
      name: b.name,
      fac: b.fac,
      sex: b.sex || 0,
      lvl: b.lvl,
      reborn: Math.floor(b.lvl / 50),
      power: 3000 + b.lvl * 280,
      tower: Math.floor(b.lvl / 2.5),
      bosses: b.lvl * 4,
      gear: b.gear,
      updated: new Date().toISOString()
    };
  }
  return null;
};
