"use client";
import { useEffect, FormEvent, useState, useCallback } from "react";

export default function ChatModal({ open, onClose, prefillMessage }: { open: boolean; onClose: () => void; prefillMessage?: string }) {
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        document.querySelector<HTMLInputElement>("#chat-modal .chat-input")?.focus();
      }, 10);
    }
  }, [open]);

  useEffect(() => {
    if (open && prefillMessage) {
      setStep(2);
      setShowErrors2(false);
      setTimeout(() => {
        const ta = document.querySelector<HTMLTextAreaElement>("#chat-modal #chat-message");
        if (ta) { ta.value = prefillMessage; ta.focus(); }
      }, 10);
    }
  }, [open, prefillMessage]);

  const [status, setStatus] = useState<string>("");
  const [statusKind, setStatusKind] = useState<"" | "success" | "error">("");
  const [step, setStep] = useState<1 | 2>(1);
  const [closing, setClosing] = useState(false);
  const [showErrors1, setShowErrors1] = useState(false);
  const [showErrors2, setShowErrors2] = useState(false);
  const [needBack, setNeedBack] = useState(false);
  const [orgVal, setOrgVal] = useState("");
  const [nameVal, setNameVal] = useState("");
  const [phoneVal, setPhoneVal] = useState("");
  const [emailVal, setEmailVal] = useState("");
  const [closeCountdown, setCloseCountdown] = useState<number | null>(null);
  const [successView, setSuccessView] = useState(false);
  const handleClose = useCallback(() => { setClosing(true); setTimeout(() => { setClosing(false); onClose(); }, 200); }, [onClose]);

  useEffect(() => {
    if (open) {
      setSuccessView(false);
      setCloseCountdown(null);
      setStatus("");
      setStatusKind("");
    }
  }, [open]);
  useEffect(() => {
    if (open && statusKind === "success" && closeCountdown !== null) {
      if (closeCountdown <= 0) {
        handleClose();
        setStatus("");
        setStatusKind("");
        setCloseCountdown(null);
        return;
      }
      const t = setTimeout(() => {
        setCloseCountdown((n) => (typeof n === "number" ? n - 1 : null));
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [open, statusKind, closeCountdown, handleClose]);
  const normalizePhone = (s: string) => {
    let v = s.replace(/[^\d+]/g, "");
    if (v.includes("+") && !v.startsWith("+")) v = v.replace(/\+/g, "");
    return v;
  };
  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const message = (fd.get("message") || "").toString().trim();
    const org = orgVal.trim();
    const name = nameVal.trim();
    const phone = normalizePhone(phoneVal.trim());
    const email = emailVal.trim();
    if (!org || !name || !phone || !email) {
      setShowErrors1(true);
      setNeedBack(true);
      setStatus("İletişim bilgileri eksik. Lütfen doldurun.");
      setStatusKind("error");
      return;
    }
    if (!message) {
      setShowErrors2(true);
      setNeedBack(false);
      setStatus("Mesaj alanı zorunlu.");
      setStatusKind("error");
      return;
    }
    setStatus("Gönderiliyor…");
    setStatusKind("");
    setNeedBack(false);
    try {
      const res = await fetch("/api/telegram/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, org, name, phone, email, ua: navigator.userAgent, url: location.href, ts: Date.now() }),
      });
      if (!res.ok) throw new Error("fail");
      (form as HTMLFormElement).reset();
      setStep(1);
      setShowErrors1(false);
      setShowErrors2(false);
      setNeedBack(false);
      setSuccessView(true);
      setStatus("Teşekkür ederiz! Mesajınız bize ulaştı.");
      setStatusKind("success");
      setCloseCountdown(6);
    } catch {
      setStatus("Gönderimde bir sorun oluştu. Lütfen tekrar deneyin.");
      setStatusKind("error");
    }
  };

  const handleNext = () => {
    const org = (document.getElementById("chat-org") as HTMLInputElement)?.value.trim();
    const name = (document.getElementById("chat-name") as HTMLInputElement)?.value.trim();
    const phone = (document.getElementById("chat-phone") as HTMLInputElement)?.value.trim();
    const email = (document.getElementById("chat-email") as HTMLInputElement)?.value.trim();
    if (!org || !name || !phone || !email) {
      setShowErrors1(true);
      const f = document.querySelector<HTMLFormElement>("#chat-modal form.chat-form");
      f?.reportValidity();
      return;
    }
    setOrgVal(org);
    setNameVal(name);
    setPhoneVal(phone);
    setEmailVal(email);
    setStep(2);
    setShowErrors2(false);
    setTimeout(() => {
      document.querySelector<HTMLTextAreaElement>("#chat-modal #chat-message")?.focus();
    }, 10);
  };

  return (
    <div id="chat-modal" className={`chat-modal ${open ? "open" : ""} ${closing ? "closing" : ""}`}>
      <div className="chat-backdrop" onClick={handleClose}></div>
      <div className="chat-sheet">
        <div className="chat-bar">
          <div className="bar-left">
            <span className="ai-ico">🤖</span>
            <span>SporManage Asistan</span>
          </div>
          <div className="bar-right">
            <div className="step-ind">{step}/2</div>
            <button className="chat-close" onClick={handleClose}>✕</button>
          </div>
        </div>
        <div className="chat-greet">Size nasıl yardımcı olabilirim?</div>
        {successView && (
          <div className="chat success-view" aria-live="polite">
            <div className="bubble ai">Talebiniz alındı, size en kısa zamanda dönüş yapacağız.</div>
            <div className="bubble ai">Teşekkür ederiz!</div>
          </div>
        )}
        {step === 2 && (
        <div className="chips">
          <button type="button" className="chip-opt" onClick={() => {
            const inp = document.querySelector<HTMLInputElement>("#chat-modal #chat-message");
            const ta = document.querySelector<HTMLTextAreaElement>("#chat-modal #chat-message");
            const target = ta || inp;
            if (target) target.value = "Hızlı fiyat teklifi";
            target?.focus();
          }}>Hızlı fiyat teklifi</button>
          <button type="button" className="chip-opt" onClick={() => {
            const inp = document.querySelector<HTMLInputElement>("#chat-modal #chat-message");
            const ta = document.querySelector<HTMLTextAreaElement>("#chat-modal #chat-message");
            const target = ta || inp;
            if (target) target.value = "Proje planı hakkında bilgi";
            target?.focus();
          }}>Proje planı hakkında bilgi</button>
          <button type="button" className="chip-opt" onClick={() => {
            const inp = document.querySelector<HTMLInputElement>("#chat-modal #chat-message");
            const ta = document.querySelector<HTMLTextAreaElement>("#chat-modal #chat-message");
            const target = ta || inp;
            if (target) target.value = "Destek talebi oluştur";
            target?.focus();
          }}>Destek talebi oluştur</button>
        </div>
        )}
        {!successView && (
        <form className="chat-form" onSubmit={sendMessage}>
          {step === 1 && (
            <div className={`step-wrap ${showErrors1 ? 'show-errors-1' : ''}`}>
              <div className="chat-fields">
                <div className="field">
                  <label className="chat-label" htmlFor="chat-org">Kulüp/Kurum Adı</label>
                  <div className="control">
                    <span className="ico"><svg viewBox="0 0 24 24"><path d="M3 4h18v16H3V4Zm2 2v12h14V6H5Zm2 2h10v2H7V8Zm0 4h10v2H7v-2Z"/></svg></span>
                    <input id="chat-org" type="text" className="chat-name" name="org" required autoComplete="organization" />
                  </div>
                  <small className="error">Bu alan zorunlu</small>
                </div>
                <div className="field">
                  <label className="chat-label" htmlFor="chat-name">Ad Soyad</label>
                  <div className="control">
                    <span className="ico"><svg viewBox="0 0 24 24"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4 0-7 3-7 7h2c0-2.76 2.24-5 5-5s5 2.24 5 5h2c0-4-3-7-7-7Z"/></svg></span>
                    <input id="chat-name" type="text" className="chat-name" name="name" required autoComplete="name" />
                  </div>
                  <small className="error">Bu alan zorunlu</small>
                </div>
                <div className="field">
                  <label className="chat-label" htmlFor="chat-phone">Telefon</label>
                  <div className="control">
                    <span className="ico"><svg viewBox="0 0 24 24"><path d="M6 2h4l2 5-2 2c1 3 3 5 6 6l2-2 5 2v4C16 19 5 8 6 2Z"/></svg></span>
                    <input id="chat-phone" type="tel" className="chat-phone" name="phone" required inputMode="tel" pattern="^(\+?[1-9]\d{7,14}|0\d{10})$" title="Uluslararası (+90...) veya yerel (0XXXXXXXXXX)" />
                  </div>
                  <small className="error">Format: +ülkeKodu numara veya 0XXXXXXXXXX</small>
                </div>
                <div className="field">
                  <label className="chat-label" htmlFor="chat-email">E-posta</label>
                  <div className="control">
                    <span className="ico"><svg viewBox="0 0 24 24"><path d="M2 4h20v16H2V4Zm2 2v12h16V6l-8 5-8-5Z"/></svg></span>
                    <input id="chat-email" type="email" className="chat-email" name="email" required autoComplete="email" />
                  </div>
                  <small className="error">Geçerli e‑posta girin</small>
                </div>
              </div>
              <button type="button" className="btn btn-primary chat-send" onClick={handleNext}>Devam</button>
            </div>
          )}
          {step === 2 && (
            <div className={`step-wrap ${showErrors2 ? 'show-errors-2' : ''}`}>
              <div className="field">
                <label className="chat-label" htmlFor="chat-message">Mesaj</label>
                <div className="control">
                  <input type="hidden" name="org" value={orgVal} />
                  <input type="hidden" name="name" value={nameVal} />
                  <input type="hidden" name="phone" value={phoneVal} />
                  <input type="hidden" name="email" value={emailVal} />
                  <input type="text" name="hp" className="hp-field" />
                  <textarea id="chat-message" className="chat-input" name="message" required rows={6} />
                </div>
                <small className="error">Bu alan zorunlu</small>
              </div>
              <button type="submit" className="btn btn-primary chat-send">Gönder</button>
            </div>
          )}
        </form>
        )}
        {status && (
          <div className={`chat-status ${statusKind}`}>
            <span>{status}{statusKind === "success" && closeCountdown !== null ? ` — Pencere ${closeCountdown}s içinde kapanacak` : ""}</span>
            {statusKind === "success" && (
              <button type="button" className="btn btn-primary" onClick={handleClose}>Şimdi Kapat</button>
            )}
            {statusKind === "error" && (
              <>
                {needBack && (
                  <button type="button" className="btn btn-outline retry" onClick={() => setStep(1)}>Geri</button>
                )}
                <button type="button" className="btn btn-outline retry" onClick={() => {
                  const f = document.querySelector<HTMLFormElement>("#chat-modal form.chat-form");
                  f?.requestSubmit();
                }}>Yeniden Dene</button>
              </>
            )}
          </div>
        )}
        
      </div>
    </div>
  );
}
