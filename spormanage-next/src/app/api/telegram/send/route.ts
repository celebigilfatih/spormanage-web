import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      return NextResponse.json({ error: "missing env" }, { status: 500 });
    }
    const body = await req.json();
    const message: string = body?.message || "";
    const name: string = body?.name || "";
    const phone: string = body?.phone || "";
    const email: string = body?.email || "";
    const ua: string = body?.ua || "";
    const url: string = body?.url || "";
    const ts = body?.ts;
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
  } catch (e) {
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
