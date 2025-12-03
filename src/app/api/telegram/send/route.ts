import { NextResponse } from "next/server";
export const runtime = "nodejs";
const RATE = new Map<string, number>();

export async function POST(req: Request) {
  try {
    const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      return NextResponse.json({ error: "missing env" }, { status: 500 });
    }
  const body = await req.json();
  const message: string = body?.message || "";
  const org: string = body?.org || "";
  const name: string = body?.name || "";
  const phone: string = body?.phone || "";
  const email: string = body?.email || "";
    const ua: string = body?.ua || "";
    const url: string = body?.url || "";
    const ts = body?.ts;
    const hp: string = body?.hp || "";
    if (hp && hp.trim().length > 0) return NextResponse.json({ error: "spam" }, { status: 400 });
    if (!email.includes("@") || !email.includes(".")) return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    if (message.trim().length < 5 || message.length > 2000) return NextResponse.json({ error: "invalid_message" }, { status: 400 });
    if (org.trim().length < 2 || name.trim().length < 2) return NextResponse.json({ error: "invalid_identity" }, { status: 400 });
    if (!/^\+?[0-9]{7,}$/.test(phone)) return NextResponse.json({ error: "invalid_phone" }, { status: 400 });
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "";
    const key = `${ip}|${ua}`;
    const now = Date.now();
    const last = RATE.get(key) || 0;
    if (now - last < 2000) { RATE.set(key, now); return NextResponse.json({ error: "rate_limited" }, { status: 429 }); }
    RATE.set(key, now);
    const dt = new Date(typeof ts === "number" ? ts : Date.now());
    const time = dt.toLocaleString("tr-TR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
    let page = url;
    try { const u = new URL(url); page = u.pathname || url; } catch {}
  if (!message) return NextResponse.json({ error: "message required" }, { status: 400 });
  const text = [
    `SporManage Asistan • ${time}`,
    `Kaynak: ${page}`,
    "",
    `✍️ Mesaj: ${message}`,
    `🏟️ Kulüp/Kurum: ${org}`,
    `👤 İsim: ${name}`,
    `📞 Telefon: ${phone}`,
    `📧 E-posta: ${email}`,
    `🌐 URL: ${url}`,
    `🖥️ UA: ${ua}`,
      `⏱️ TS: ${ts}`,
    ].join("\n");

    const resp = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: "Markdown", disable_web_page_preview: true }),
    });
    if (!resp.ok) {
      const txt = await resp.text();
      return NextResponse.json({ error: "telegram_error", details: txt }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
