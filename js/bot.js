"use strict";
/* ====================================================================
 * HỆ THỐNG HIỆP KHÁCH GIANG HỒ / BOT ẢO (BOT_SYSTEM.JS)
 * - Tự động sinh cao thủ ảo chạy train, cưỡi ngựa, đánh quái quanh người chơi
 * - Có đầy đủ đồ môn phái, trang bị Hoàng Kim / Tím, thú cưỡi xịn
 * - Tự động chat thế giới, khoe đồ, rủ party, tạo không khí đông vui
 * - Bày bán đồ quý trên Chợ và thỉnh thoảng thu mua đồ của người chơi
 * ==================================================================== */

const BOT_NAMES = [
  "Độc Cô Cầu Bại", "Lệnh Hồ Xung", "Dương Quá", "Tiểu Long Nữ", "Kiều Phong",
  "Đoàn Dự", "Hư Trúc", "Trương Vô Kỵ", "Triệu Mẫn", "Chu Chỉ Nhược",
  "Tạ Tốn", "Hoàng Dược Sư", "Âu Dương Phong", "Hồng Thất Công", "Nhất Đăng Đại Sư",
  "Phong Thanh Dương", "Nhậm Ngã Hành", "Đông Phương Bất Bại", "Vi Tiểu Bảo",
  "Quách Tĩnh", "Hoàng Dung", "Mộ Dung Phục", "Cưu Ma Trí", "Doãn Chí Bình",
  "Khương Tử Nha", "Tiêu Viêm", "Hàn Lập", "Lâm Động", "Diệp Phàm", "Thạch Hạo",
  "Bá Đao Tuyệt Tình", "Kiếm Ma", "Huyết Thủ Ma Tôn", "Bất Bại Cuồng Nhân",
  "Lãng Tử Vô Tình", "Tiểu Ngư Nhi", "Hoa Vô Khuyết", "Sở Lưu Hương", "Lục Tiểu Phụng"
];

const BOT_TITLES = [
  "«Thiên Hạ Đệ Nhất»", "«Võ Lâm Minh Chủ»", "«Vô Địch Thiên Hạ»", 
  "«Độc Cô Cầu Bại»", "«Tuyệt Thế Cao Thủ»", "«Giang Hồ Hiệp Khách»",
  "«Cửu Châu Chí Tôn»", "«Bắc Kiều Phong»", "«Nam Mộ Dung»"
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
  "Game chơi cuốn thật, hoài niệm thời VLTK 2005 ghê!"
];

let BOT_LIST = [];
let botLastSpawn = 0;
let botLastChat = Date.now() + 5000;

// Khởi tạo đồ đạc ngẫu nhiên cho Bot
function botMakeGear(lvl, facKey) {
  const gear = {};
  const slots = ["weapon", "armor", "helm", "boot", "belt", "cuff", "amulet", "ring1", "ring2", "pendant", "horse"];
  const horses = ["Chiếu Dạ Ngọc Sư Tử", "Xích Thố", "Phi Vân", "Bôn Tiêu", "Ô Vân Đạp Tuyết", "Tuyệt Ảnh"];
  
  gear.horse = {
    d: 10, k: 0, n: pick(horses), r: 4, lvl: Math.min(100, lvl),
    base: [[28, 50, 80]], mag: [{ a: 110, p: [35, 0, 0] }, { a: 115, p: [40, 0, 0] }]
  };
  
  return gear;
}

// Sinh một Bot mới xung quanh người chơi
function spawnOneBot() {
  if (!S || !S.fac || BOT_LIST.length >= 5) return;
  
  const facKeys = FACTIONS.filter(f => !f.novice).map(f => f.key);
  const facKey = pick(facKeys);
  const facObj = FAC[facKey];
  const botLvl = clamp(S.lvl + irnd(-3, 6), 1, 200);
  const botName = pick(BOT_NAMES.filter(n => n !== S.name && !BOT_LIST.some(b => b.name === n))) || ("Hiệp Khách " + irnd(100, 999));
  const botSex = facKey === "emei" || facKey === "cuiyan" ? 1 : facKey === "shaolin" ? 0 : irnd(0, 1);
  const gfx = heroGfx(facKey, botSex);
  
  // Vị trí xuất hiện xung quanh người chơi
  const angle = rnd(0, Math.PI * 2);
  const dist = rnd(120, 260);
  const [bx, by] = inWorld(H.x + Math.cos(angle) * dist, H.y + Math.sin(angle) * dist);
  
  const bot = {
    oth: true,
    name: botName,
    fac: facKey,
    facName: facObj ? facObj.n : "Giang hồ",
    sex: botSex,
    lvl: botLvl,
    title: Math.random() < 0.6 ? pick(BOT_TITLES) : "",
    x: bx,
    y: by,
    px: bx,
    py: by,
    dir: irnd(0, 7),
    face: 1,
    act: "st",
    actT: 0,
    animKey: gfx && gfx.anim ? gfx.anim : "hero_m",
    target: null,
    atkT: rnd(0.5, 1.5),
    moveT: rnd(1, 3),
    life: 1,
    maxLife: 1000 + botLvl * 150,
    hp: 1,
    mounted: Math.random() < 0.7,
    gear: botMakeGear(botLvl, facKey)
  };
  
  BOT_LIST.push(bot);
}

// Cập nhật logic di chuyển và đánh quái của Bot
function othTick(dt) {
  if (!S || !S.fac) return;
  
  // Duy trì khoảng 3 - 5 bot xung quanh người chơi
  if (Date.now() - botLastSpawn > 10000 && BOT_LIST.length < 4) {
    botLastSpawn = Date.now();
    spawnOneBot();
  }
  
  // Xóa bot nếu chạy quá xa người chơi
  BOT_LIST = BOT_LIST.filter(b => {
    const d = Math.hypot(b.x - H.x, b.y - H.y);
    return d < 800;
  });
  
  for (const b of BOT_LIST) {
    b.actT = (b.actT || 0) + dt;
    
    // Tìm quái gần để đánh
    if (!b.target || b.target.dead || b.target.hp <= 0 || Math.hypot(b.target.x - b.x, b.target.y - b.y) > 350) {
      const candidates = (R.enemies || []).filter(e => !e.dead && e.hp > 0 && Math.hypot(e.x - b.x, e.y - b.y) < 350);
      b.target = candidates.length ? candidates[0] : null;
    }
    
    if (b.target) {
      const dx = b.target.x - b.x;
      const dy = b.target.y - b.y;
      const dist = Math.hypot(dx, dy);
      b.face = dx >= 0 ? 1 : -1;
      b.dir = dirOf(dx, dy);
      
      if (dist > 75) {
        // Chạy lại gần quái
        const spd = (b.mounted ? 180 : 130) * dt;
        b.x += (dx / dist) * spd;
        b.y += (dy / dist) * spd;
        b.act = "run";
      } else {
        // Tấn công quái
        b.act = "at";
        b.atkT = (b.atkT || 0) - dt;
        if (b.atkT <= 0) {
          b.atkT = rnd(0.7, 1.2);
          b.actT = 0;
          
          // Gây sát thương giả lập lên quái
          if (b.target && !b.target.dead) {
            const dmg = Math.round((200 + b.lvl * 25) * rnd(0.8, 1.2));
            b.target.hp -= dmg;
            if (typeof addText === "function") {
              addText(b.target.x + rnd(-10, 10), b.target.y - b.target.r - 8, fmt(dmg), "#8fe3ff", 11);
            }
            if (typeof burst === "function") {
              burst(b.target.x, b.target.y, "#8fe3ff");
            }
          }
        }
      }
    } else {
      // Đi dạo quanh người chơi
      b.moveT = (b.moveT || 0) - dt;
      if (b.moveT <= 0) {
        b.moveT = rnd(2, 5);
        const ang = rnd(0, Math.PI * 2);
        const d = rnd(30, 90);
        b.destX = H.x + Math.cos(ang) * d;
        b.destY = H.y + Math.sin(ang) * d;
      }
      if (b.destX != null) {
        const dx = b.destX - b.x;
        const dy = b.destY - b.y;
        const d = Math.hypot(dx, dy);
        if (d > 10) {
          b.act = "run";
          b.face = dx >= 0 ? 1 : -1;
          b.dir = dirOf(dx, dy);
          const spd = 70 * dt;
          b.x += (dx / d) * spd;
          b.y += (dy / d) * spd;
        } else {
          b.act = "st";
        }
      }
    }
  }
  
  // Tự động đẩy tin nhắn giả lập của Bot lên Chat thế giới
  if (Date.now() - botLastChat > 25000 && typeof chatPush === "function") {
    botLastChat = Date.now() + rnd(15000, 35000);
    const b = BOT_LIST.length ? pick(BOT_LIST) : { name: pick(BOT_NAMES), facName: "Võ Đang", lvl: clamp(S.lvl + irnd(-2, 5), 1, 150) };
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

// Trả về danh sách Bot để render.js vẽ lên màn hình
function othEnts() {
  return BOT_LIST.map(b => ({ oth: b, y: b.y }));
}

// Vẽ Bot lên canvas
function othDraw(ctx, b, dt) {
  if (!b) return;
  
  ctx.fillStyle = "#0007";
  ctx.beginPath();
  ctx.ellipse(b.x, b.y, 14, 5, 0, 0, 7);
  ctx.fill();
  
  // Vẽ hoạt ảnh thân xác hiệp khách
  if (typeof drawHeroAnim === "function" && b.animKey) {
    drawHeroAnim(b.animKey, b.act || "st", b.dir || 0, b.actT || 0, b.x, b.y, 1.35, 1);
  } else if (typeof drawAnim === "function") {
    drawAnim(b.animKey || "hero_m", b.act || "st", b.dir || 0, b.actT || 0, b.x, b.y, 1.35, 1);
  }
  
  // Vẽ tên, môn phái, cấp độ và danh hiệu trên đầu Bot
  const labelY = b.y - 75;
  if (typeof label === "function") {
    label(
      b.x,
      labelY,
      `${b.name} · Lv${b.lvl}`,
      "#82d8ff",
      11,
      1,
      "#4fd04f",
      b.title || "",
      "#ffd24a",
      "#5fb8ff"
    );
  }
}

// Mở trang cá nhân Bot khi người chơi bấm xem
window.getBotProfile = function(name) {
  const b = BOT_LIST.find(x => x.name === name);
  if (b) {
    return {
      name: b.name,
      fac: b.fac,
      sex: b.sex,
      lvl: b.lvl,
      reborn: Math.floor(b.lvl / 50),
      power: 5000 + b.lvl * 350,
      tower: Math.floor(b.lvl / 2),
      bosses: b.lvl * 3,
      gear: b.gear,
      updated: new Date().toISOString()
    };
  }
  return null;
};
