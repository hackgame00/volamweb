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
  
  // Vị trí sinh ngẫu nhiên khắp map - tránh sinh vào vùng cản
  let bx, by;
  const pts = (R.field && R.field.pts) ? R.field.pts : [];
  if (pts.length && Math.random() < 0.7) {
    const pt = pick(pts);
    [bx, by] = inWorld(pt.x + rnd(-80, 80), pt.y + rnd(-80, 80));
  } else {
    [bx, by] = inWorld(rnd(200, WORLD.w - 200), rnd(200, WORLD.h - 200));
  }
  if (typeof obsSnap === "function") {
    [bx, by] = obsSnap(bx, by);
  }
  
// Bảng võ công đặc trưng tuyệt đẹp cho 10 môn phái của Bot
const BOT_FAC_SKILLS = {
  shaolin:  [ { id: 318, n: "Đạt Ma Độ Giang", range: 90 }, { id: 319, n: "Hoành Tảo Thiên Quân", range: 90 }, { id: 20, n: "Sư Tử Hống", range: 130 } ],
  tianwang: [ { id: 41, n: "Huyết Chiến Bát Phương", range: 75 }, { id: 323, n: "Truy Tinh Trục Nguyệt", range: 85 }, { id: 40, n: "Đoạn Hồn Thích", range: 160 } ],
  tangmen:  [ { id: 302, n: "Bạo Vũ Lê Hoa", range: 240 }, { id: 342, n: "Cửu Cung Phi Tinh", range: 220 }, { id: 58, n: "Thiên La Địa Võng", range: 200 } ],
  wudu:     [ { id: 353, n: "Âm Phong Thực Cốt", range: 200 }, { id: 355, n: "Huyền Âm Trảm", range: 160 }, { id: 68, n: "U Minh Khô Lâu", range: 220 } ],
  emei:     [ { id: 380, n: "Phong Sương Toái Ảnh", range: 220 }, { id: 328, n: "Tam Nga Tề Tuyết", range: 200 }, { id: 91, n: "Phật Quang Phổ Chiếu", range: 180 } ],
  cuiyan:   [ { id: 336, n: "Băng Tung Vô Ảnh", range: 220 }, { id: 337, n: "Băng Tâm Tiên Tử", range: 200 }, { id: 108, n: "Mục Dã Lưu Tinh", range: 180 } ],
  gaibang:  [ { id: 357, n: "Phi Long Tại Thiên", range: 220 }, { id: 359, n: "Thiên Hạ Vô Cẩu", range: 180 }, { id: 128, n: "Kháng Long Hữu Hối", range: 190 } ],
  tianren:  [ { id: 361, n: "Vân Long Kích", range: 90 }, { id: 362, n: "Thiên Ngoại Lưu Tinh", range: 220 }, { id: 148, n: "Ma Diệm Thất Sát", range: 150 } ],
  wudang:   [ { id: 365, n: "Thiên Địa Vô Cực", range: 220 }, { id: 368, n: "Nhân Kiếm Hợp Nhất", range: 220 }, { id: 165, n: "Vô Ngã Vô Kiếm", range: 180 } ],
  kunlun:   [ { id: 375, n: "Lôi Động Cửu Thiên", range: 220 }, { id: 372, n: "Ngạo Tuyết Tiêu Phong", range: 200 }, { id: 182, n: "Ngũ Lôi Chánh Pháp", range: 180 } ]
};

  const botSex = fac.sex;
  const horseRow = (tier.horseR >= 0 && botLvl >= 30) ? tier.horseR : -1;
  const botJx = botJxSetup(botSex, fac.wp, horseRow);
  const botSkills = BOT_FAC_SKILLS[fac.key] || [ { id: 10, n: "Võ Công Phái", range: 100 } ];
  
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
    skills: botSkills,
    curSkill: pick(botSkills),
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
    const oldX = b.x;
    const oldY = b.y;
    
    // Tìm mục tiêu quái gần Bot nhất (ưu tiên quái không bị che khuất bởi tường/vật cản)
    if (!b.target || b.target.dead || b.target.hp <= 0 || Math.hypot(b.target.x - b.x, b.target.y - b.y) > 380) {
      const candidates = (R.enemies || []).filter(e => {
        if (e.dead || e.hp <= 0) return false;
        const d = Math.hypot(e.x - b.x, e.y - b.y);
        if (d > 380) return false;
        return typeof obsSee === "function" ? obsSee(b.x, b.y, e.x, e.y) : true;
      });
      b.target = candidates.length ? candidates[0] : null;
    }
    
    if (b.target) {
      const dx = b.target.x - b.x;
      const dy = b.target.y - b.y;
      const dist = Math.hypot(dx, dy);
      b.face = dx >= 0 ? 1 : -1;
      b.dir = dirOf(dx, dy);
      
      const skill = b.curSkill || (b.skills && b.skills[0]) || { id: 0, range: 80 };
      const atkRange = skill.range || 90;
      const canSee = typeof obsSee === "function" ? obsSee(b.x, b.y, b.target.x, b.target.y) : true;
      
      if (dist > atkRange || !canSee) {
        // Chạy lại gần quái để đánh - Sử dụng thuật toán tìm đường thông minh tránh vật cản
        const spd = (b.mounted ? 170 : 125) * dt;
        if (typeof obsChase === "function") {
          obsChase(b, b.target.x, b.target.y, spd);
        } else if (typeof obsSteer === "function") {
          obsSteer(b, b.target.x, b.target.y, spd);
        } else {
          b.x += (dx / dist) * spd;
          b.y += (dy / dist) * spd;
        }
        b.act = "run";
      } else {
        // Tấn công quái
        b.act = "at";
        b.atkT = (b.atkT || 0) - dt;
        if (b.atkT <= 0) {
          b.atkT = rnd(0.7, 1.2);
          b.actT = 0;
          
          if (b.target && !b.target.dead) {
            const skObj = b.curSkill || pick(b.skills);
            b.curSkill = pick(b.skills); // Đổi chiêu thức luân phiên cho đẹp mắt
            
            // Thi triển hiệu ứng võ công đẹp mắt chính xác theo từng môn phái
            if (typeof skillFx === "function" && skObj && skObj.id) {
              try {
                skillFx(b, b.target, { id: skObj.id, n: skObj.n, L: Math.max(1, Math.floor(b.lvl / 5)), nMis: 3 });
              } catch(e) {}
            }
            if (typeof skillSfx === "function" && skObj && skObj.id) {
              try { skillSfx(skObj.id); } catch(e) {}
            }
            
            const dmg = Math.round((260 + b.lvl * 35) * rnd(0.85, 1.15));
            b.target.hp -= dmg;
            
            if (typeof addText === "function") {
              addText(b.target.x + rnd(-12, 12), b.target.y - b.target.r - 8, fmt(dmg), b.facCol, 12);
            }
            if (typeof burst === "function") {
              burst(b.target.x, b.target.y, b.facCol);
            }
          }
        }
      }
    } else {
      // Tự động đi tuần tra / tìm bãi quái mới trên map
      b.moveT = (b.moveT || 0) - dt;
      if (b.moveT <= 0 || b.destX == null) {
        b.moveT = rnd(5, 10);
        const pts = (R.field && R.field.pts) ? R.field.pts : [];
        if (pts.length) {
          const destPt = pick(pts);
          let targetX = destPt.x + rnd(-80, 80);
          let targetY = destPt.y + rnd(-80, 80);
          if (typeof obsSnap === "function") {
            [targetX, targetY] = obsSnap(targetX, targetY);
          }
          b.destX = targetX;
          b.destY = targetY;
        } else {
          let targetX = clamp(b.x + rnd(-300, 300), 200, WORLD.w - 200);
          let targetY = clamp(b.y + rnd(-300, 300), 200, WORLD.h - 200);
          if (typeof obsSnap === "function") {
            [targetX, targetY] = obsSnap(targetX, targetY);
          }
          b.destX = targetX;
          b.destY = targetY;
        }
      }
      
      const dx = b.destX - b.x;
      const dy = b.destY - b.y;
      const d = Math.hypot(dx, dy);
      if (d > 20) {
        b.act = "run";
        const spd = (b.mounted ? 120 : 85) * dt;
        if (typeof obsChase === "function") {
          obsChase(b, b.destX, b.destY, spd);
        } else if (typeof obsSteer === "function") {
          obsSteer(b, b.destX, b.destY, spd);
        } else {
          b.x += (dx / d) * spd;
          b.y += (dy / d) * spd;
        }
        
        // Hướng mặt theo hướng vừa di chuyển
        const mx = b.x - oldX;
        const my = b.y - oldY;
        if (Math.hypot(mx, my) > 0.05) {
          b.face = mx >= 0 ? 1 : -1;
          b.dir = dirOf(mx, my);
        }
      } else {
        b.act = "st";
      }
    }
    
    // Phát hiện bot bị kẹt (di chuyển không thay đổi tọa độ) -> đổi mục tiêu ngay lập tức
    const movedDist = Math.hypot(b.x - oldX, b.y - oldY);
    if (b.act === "run" && movedDist < 0.1 * dt) {
      b.stuckCount = (b.stuckCount || 0) + 1;
      if (b.stuckCount > 25) { // kẹt hơn nửa giây
        b.stuckCount = 0;
        b.destX = null;
        b.destY = null;
        b.target = null;
        b.moveT = 0;
        if (typeof obsSnap === "function") {
          [b.x, b.y] = obsSnap(b.x + rnd(-40, 40), b.y + rnd(-40, 40));
        }
      }
    } else {
      b.stuckCount = Math.max(0, (b.stuckCount || 0) - 1);
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
  
  // Hào quang võ công xoay tròn rực rỡ dưới chân cho các bậc Cao Thủ & Tông Sư
  if (b.auraCol) {
    ctx.save();
    const tClock = (Date.now() % 10000) / 1000;
    const pulse = 1 + Math.sin(tClock * 4) * 0.12;
    ctx.globalAlpha = 0.55;
    ctx.strokeStyle = b.auraCol;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(b.x, b.y, 25 * pulse, 10 * pulse, 0, 0, 7);
    ctx.stroke();

    // Vòng tròn ánh sáng phụ lấp lánh
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = b.auraCol;
    ctx.beginPath();
    ctx.ellipse(b.x, b.y, 20 * pulse, 8 * pulse, 0, 0, 7);
    ctx.fill();
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
      12,
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

/* ====================================================================
 * THỊ TRƯỜNG CHỢ & GIAO THƯƠNG BOT TỰ ĐỘNG (BOT MARKET SIMULATION)
 * - Tự động mua các món đồ mà người chơi đăng bán trên Chợ (nhận bạc/KNB qua Thư)
 * - Tự động bổ sung các trang bị, vũ khí, ngựa, bí kíp lên Chợ để người chơi mua sắm
 * ==================================================================== */

let botMktTimer = 0;
const BOT_REPLIES = [
  { trigger: /chợ|bán|mua/i, reply: "Vào Chợ xem thử đi bạn, mình vừa treo ít đồ lên đó đấy!" },
  { trigger: /boss|trùm/i, reply: "Săn boss nhớ rủ mình với nha, đang thiếu mảnh Hoàng Kim." },
  { trigger: /hello|chào|hi|alo/i, reply: "Chào huynh đệ! Chúc bạn bôn tẩu giang hồ may mắn." },
  { trigger: /phái nào|môn phái/i, reply: "Phái nào cũng có nét hay riêng, quan trọng là phối đồ ngũ hành!" },
  { trigger: /dã tẩu/i, reply: "Làm chuỗi Dã Tẩu lên mốc 500 nhận nhiều đồ xịn lắm đó bạn." },
  { trigger: /tháp/i, reply: "Thông Thiên Tháp càng lên cao quái càng trâu, nên ép đồ trước khi leo." }
];

// Phản hồi khi người chơi chat thế giới
if (typeof window.chatSend === "function") {
  const origChatSend = window.chatSend;
  window.chatSend = async function(text) {
    const res = await origChatSend.apply(this, arguments);
    if (text) {
      for (const item of BOT_REPLIES) {
        if (item.trigger.test(text)) {
          setTimeout(() => {
            const bot = BOT_LIST.length ? pick(BOT_LIST) : { name: pick(BOT_NAMES), facName: pick(ALL_FACTIONS).n, lvl: irnd(30, 120) };
            if (typeof chatPush === "function") {
              chatPush({
                id: "bot_rep_" + Date.now(),
                cid: "bot_cid_" + Math.random().toString(36).slice(2, 7),
                name: bot.name,
                fac: bot.facName,
                lvl: bot.lvl,
                msg: item.reply,
                ts: Date.now()
              });
            }
          }, rnd(1500, 3000));
          break;
        }
      }
    }
    return res;
  };
}

// Chu kỳ kiểm tra Chợ & Tự động mua/bán đồ
setInterval(async function() {
  if (typeof NET === "undefined" || !NET.sb || !NET.user || !S || !S.fac) return;
  botMktTimer++;

  // 1. Bot tự mua đồ mà người chơi đăng bán
  try {
    const res = await NET.sb.from("market").select("*").eq("seller", NET.user.id);
    const myItems = res && res.data ? res.data : [];
    if (myItems.length > 0 && Math.random() < 0.6) {
      const itemToBuy = pick(myItems);
      const buyerName = pick(BOT_NAMES);

      try {
        await NET.sb.rpc("market_buy", { lid: itemToBuy.id, buyer: buyerName });
        if (typeof log === "function") {
          log(`🏪 Hiệp khách <b>${esc(buyerName)}</b> đã mua <b>${esc(itemToBuy.iname)}</b> của bạn giá ${mktPriceTxt(itemToBuy)}!`);
        }
        if (typeof netMailCount === "function") netMailCount();
      } catch (e) {
        // Fallback gửi bạc/KNB về hòm thư người chơi
        await NET.sb.from("mail").insert({
          to_name: S.name,
          from_name: buyerName,
          from_owner: null,
          kind: "gift",
          item: null,
          gold: itemToBuy.cur === "knb" ? 0 : itemToBuy.price,
          knb: itemToBuy.cur === "knb" ? itemToBuy.price : 0,
          note: `Tiền bán [${itemToBuy.iname}] trên Chợ`
        });
        await NET.sb.from("market").delete().eq("id", itemToBuy.id);
        if (typeof log === "function") {
          log(`🏪 Hiệp khách <b>${esc(buyerName)}</b> đã mua <b>${esc(itemToBuy.iname)}</b> của bạn giá ${mktPriceTxt(itemToBuy)}!`);
        }
        if (typeof netMailCount === "function") netMailCount();
      }
    }
  } catch (err) {}

  // 2. Bot tự đăng thêm đồ mới nếu chợ còn ít đồ
  if (botMktTimer % 2 === 0) {
    try {
      const resCount = await NET.sb.from("market").select("id", { count: "exact", head: true });
      const count = resCount && resCount.count ? resCount.count : 0;
      if (count < 25) {
        const seller = pick(BOT_NAMES);
        const lvl = clamp((S.lvl || 20) + irnd(-10, 20), 10, 160);
        const tier = clamp(Math.floor(lvl / 12) + 1, 1, 10);
        const d = irnd(0, 9);
        const it = makeItem(d, sexPart(d, 0), tier, irnd(2, 5), irnd(0, 4));
        if (it) {
          const isKnb = Math.random() < 0.25;
          const price = isKnb ? irnd(5, 30) : Math.round(itemValue(it) * rnd(1.1, 1.8));
          await NET.sb.from("market").insert({
            seller: "00000000-0000-0000-0000-000000000000",
            seller_name: seller,
            item: it,
            iname: it.n,
            price: price,
            cur: isKnb ? "knb" : "gold"
          });
        }
      }
    } catch (err) {}
  }
}, 20000);

