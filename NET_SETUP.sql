-- ====================================================================
-- VO LAM IDLE - SUPABASE DATABASE SETUP
-- ====================================================================

-- 1. Bảng lưu nhân vật (Save slots)
CREATE TABLE IF NOT EXISTS public.saves (
    owner UUID NOT NULL,
    slot INTEGER NOT NULL,
    name TEXT,
    lvl INTEGER,
    fac TEXT,
    data TEXT,
    updated TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (owner, slot)
);

-- 2. Bảng thông tin nhân vật hiển thị xếp hạng (Chars)
CREATE TABLE IF NOT EXISTS public.chars (
    owner UUID NOT NULL,
    slot INTEGER NOT NULL,
    name TEXT UNIQUE,
    fac TEXT,
    sex INTEGER,
    lvl INTEGER,
    reborn INTEGER DEFAULT 0,
    power BIGINT DEFAULT 0,
    tower INTEGER DEFAULT 0,
    bosses INTEGER DEFAULT 0,
    gear JSONB,
    snap JSONB,
    updated TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (owner, slot)
);

-- 3. Bảng Hòm thư (Mail / Gift)
CREATE TABLE IF NOT EXISTS public.mail (
    id BIGSERIAL PRIMARY KEY,
    to_name TEXT NOT NULL,
    from_name TEXT,
    from_owner UUID,
    kind TEXT DEFAULT 'gift',
    item JSONB,
    gold BIGINT DEFAULT 0,
    knb INTEGER DEFAULT 0,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Bảng Chợ giao dịch (Market)
CREATE TABLE IF NOT EXISTS public.market (
    id BIGSERIAL PRIMARY KEY,
    seller_name TEXT NOT NULL,
    seller_owner UUID NOT NULL,
    item JSONB NOT NULL,
    price BIGINT NOT NULL,
    cur TEXT DEFAULT 'gold',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Bảng Chat thế giới (Chat)
CREATE TABLE IF NOT EXISTS public.chat (
    id BIGSERIAL PRIMARY KEY,
    cid TEXT,
    name TEXT NOT NULL,
    fac TEXT,
    lvl INTEGER,
    msg TEXT NOT NULL,
    item JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bật Row Level Security (RLS) và cấp quyền truy cập mở
ALTER TABLE public.saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mail ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat ENABLE ROW LEVEL SECURITY;

-- Tạo chính sách (Policies) cho phép người chơi đọc/ghi
CREATE POLICY "Public saves access" ON public.saves FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public chars access" ON public.chars FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public mail access" ON public.mail FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public market access" ON public.market FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public chat access" ON public.chat FOR ALL USING (true) WITH CHECK (true);

-- Cho phép Realtime cho bảng chat
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat;
