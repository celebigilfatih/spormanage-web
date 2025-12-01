import os
import json
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlencode
from urllib.request import Request, urlopen

BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN")
CHAT_ID = os.environ.get("TELEGRAM_CHAT_ID")
PORT = int(os.environ.get("PORT", "8787"))

def send_telegram(text: str):
    if not BOT_TOKEN or not CHAT_ID:
        raise RuntimeError("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID env")
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    data = urlencode({
        "chat_id": CHAT_ID,
        "text": text,
        "parse_mode": "Markdown",
        "disable_web_page_preview": "true",
    }).encode()
    req = Request(url, data=data, method="POST")
    with urlopen(req, timeout=10) as resp:
        return resp.read().decode()

def cors_headers():
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

class Handler(BaseHTTPRequestHandler):
    def _write_headers(self, code=200, content_type="application/json"):
        self.send_response(code)
        self.send_header("Content-Type", content_type)
        for k, v in cors_headers().items():
            self.send_header(k, v)
        self.end_headers()

    def do_OPTIONS(self):
        self._write_headers(204)

    def do_POST(self):
        if self.path != "/api/telegram/send":
            self._write_headers(404)
            self.wfile.write(b"{}")
            return
        try:
            length = int(self.headers.get('Content-Length', '0'))
            raw = self.rfile.read(length)
            payload = json.loads(raw or b"{}")
            name = payload.get("name") or ""
            email = payload.get("email") or ""
            message = payload.get("message") or ""
            ua = payload.get("ua") or ""
            url = payload.get("url") or ""
            ts = payload.get("ts")
            if not message:
                self._write_headers(400)
                self.wfile.write(json.dumps({"error": "message required"}).encode())
                return
            text = (
                f"🆕 Yeni İletişim Mesajı\n\n"
                f"✍️ Mesaj: {message}\n"
                f"👤 İsim: {name}\n"
                f"📧 E-posta: {email}\n"
                f"🌐 URL: {url}\n"
                f"🖥️ UA: {ua}\n"
                f"⏱️ TS: {ts}"
            )
            send_telegram(text)
            self._write_headers(200)
            self.wfile.write(json.dumps({"ok": True}).encode())
        except RuntimeError as e:
            self._write_headers(500)
            self.wfile.write(json.dumps({"error": str(e)}).encode())
        except Exception as e:
            self._write_headers(500)
            self.wfile.write(json.dumps({"error": "internal error"}).encode())

def run():
    server = HTTPServer(("0.0.0.0", PORT), Handler)
    print(f"Telegram proxy listening on http://localhost:{PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()

if __name__ == "__main__":
    run()

