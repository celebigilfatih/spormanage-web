"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

export default function Home() {
  const [navOpen, setNavOpen] = useState(false);
  const connectRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".site-header");
    const onScroll = () => {
      if (!header) return;
      const compact = window.scrollY > 8;
      header.style.borderBottomColor = compact ? "rgba(255,106,0,.35)" : "var(--border)";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  useEffect(() => {
    document.body.classList.toggle("nav-open", navOpen);
  }, [navOpen]);

  useEffect(() => {
    const el = connectRef.current;
    if (!el) return;
    const svg = el.querySelector<SVGSVGElement>("svg.connect-svg");
    if (!svg) return;
    const hubEl = el.querySelector<HTMLElement>(".center-logo");
    if (!hubEl) return;
    const rect = el.getBoundingClientRect();
    svg.setAttribute("viewBox", `0 0 ${Math.round(rect.width)} ${Math.round(rect.height)}`);
    const hubRect = hubEl.getBoundingClientRect();
    const xh = hubRect.left - rect.left + hubRect.width / 2;
    const yh = hubRect.top - rect.top + hubRect.height / 2;
    const setPath = (id: string, d: string) => { const p = svg.querySelector<SVGPathElement>(`#${id}`); if (p) p.setAttribute("d", d); };
    const getChipCenter = (selector: string, side: "left" | "right") => {
      const chip = el.querySelector<HTMLElement>(selector);
      if (!chip) return null;
      const r = chip.getBoundingClientRect();
      const x = side === "left" ? r.left - rect.left + r.width + 6 : r.left - rect.left - 6;
      const y = r.top - rect.top + r.height / 2;
      return { x, y };
    };
    const L1 = getChipCenter(".chip-left.top", "left");
    const L2 = getChipCenter(".chip-left.mid", "left");
    const L3 = getChipCenter(".chip-left.bottom", "left");
    const R1 = getChipCenter(".chip-right.top", "right");
    const R2 = getChipCenter(".chip-right.mid", "right");
    const R3 = getChipCenter(".chip-right.bottom", "right");
    const LYs = [L1, L2, L3].filter(Boolean).map(p => (p as {x:number;y:number}).y);
    const RYs = [R1, R2, R3].filter(Boolean).map(p => (p as {x:number;y:number}).y);
    const yMinL = LYs.length ? Math.min(...LYs) : yh - 60;
    const yMaxL = LYs.length ? Math.max(...LYs) : yh + 60;
    const yMinR = RYs.length ? Math.min(...RYs) : yh - 60;
    const yMaxR = RYs.length ? Math.max(...RYs) : yh + 60;
    const gap = 24;
    const edgeL = xh - hubRect.width / 2;
    const edgeR = xh + hubRect.width / 2;
    const xmL = edgeL - gap;
    const xmR = edgeR + gap;
    // Horizontal connectors from chips to rails
    if (L1) setPath("l1", `M ${Math.round(L1.x)},${Math.round(L1.y)} H ${Math.round(xmL)}`);
    if (L2) setPath("l2", `M ${Math.round(L2.x)},${Math.round(L2.y)} H ${Math.round(xmL)}`);
    if (L3) setPath("l3", `M ${Math.round(L3.x)},${Math.round(L3.y)} H ${Math.round(xmL)}`);
    if (R1) setPath("r1", `M ${Math.round(R1.x)},${Math.round(R1.y)} H ${Math.round(xmR)}`);
    if (R2) setPath("r2", `M ${Math.round(R2.x)},${Math.round(R2.y)} H ${Math.round(xmR)}`);
    if (R3) setPath("r3", `M ${Math.round(R3.x)},${Math.round(R3.y)} H ${Math.round(xmR)}`);
    // Rails spanning chips vertically
    setPath("leftRail", `M ${Math.round(xmL)},${Math.round(yMinL)} V ${Math.round(yMaxL)}`);
    setPath("rightRail", `M ${Math.round(xmR)},${Math.round(yMinR)} V ${Math.round(yMaxR)}`);
    // Connect rails to hub edges at centerline
    setPath("hubLeft", `M ${Math.round(xmL)},${Math.round(yh)} H ${Math.round(edgeL)}`);
    setPath("hubRight", `M ${Math.round(xmR)},${Math.round(yh)} H ${Math.round(edgeR)}`);
    const onResize = () => {
      requestAnimationFrame(() => {
        const evt = new Event("recalc-connect");
        el.dispatchEvent(evt);
      });
    };
    window.addEventListener("resize", onResize);
    const recalc = () => {
      const e = new CustomEvent("do-recalc");
      el.dispatchEvent(e);
    };
    recalc();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div>
      <div className="page-top-bg" aria-hidden="true"></div>
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#">
            <Image className="logo" src="/assets/img/spormanage-logo.png" alt="Spormanage" width={170} height={48} priority/>
          </a>
          <nav className={`main-nav ${navOpen ? "open" : ""}`} aria-label="Ana menü">
            <a href="#services">Hizmetler</a>
            <a href="#get-started">Çözümler</a>
            <a href="#pricing">Fiyatlandırma</a>
            <a href="/contact">İletişim</a>
          </nav>
          <div className="header-actions">
            <button className="btn btn-primary" onClick={() => {
              window.dispatchEvent(new Event('open-chat'));
            }}><span className="btn-ico">🤖</span>Asistan</button>
            <button className="menu-toggle" aria-label="Menüyü aç/kapat" onClick={() => setNavOpen(v => !v)}>☰</button>
          </div>
        </div>
      </header>

      <section className="section hero" id="get-started">
        <div className="hero-bg" aria-hidden="true"></div>
        <div className="container hero-inner single">
          <div className="hero-content text-center">
            <h1>Sporun içinden gelen bir ekip olarak, sahadaki disiplini dijital dünyaya taşıyoruz.</h1>
            <p className="subtitle">Sporu seven, yazılıma tutkuyla bağlı bir ekibiz. Geliştirdiğimiz uygulamalarla özellikle bir antrenörün, yöneticinin veya velinin işini kolaylaştırmayı hedefliyoruz.</p>
            <p className="subtitle">Spormanage, kulüplerin, antrenörlerin ve spor okullarının günlük operasyonlarını kolaylaştırmak amacıyla geliştirilmiş, tamamen web tabanlı bir yönetim platformudur.</p>
          </div>
        </div>
        <div className="connect">
          <div className="container">
            <div className="connect-graph" ref={connectRef}>
              <svg aria-hidden="true" width="0" height="0" style={{ position: "absolute" }}>
                <symbol id="ico-user" viewBox="0 0 24 24">
                  <circle cx="12" cy="8" r="4" fill="currentColor"></circle>
                  <path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="none" stroke="currentColor" strokeWidth="2"></path>
                </symbol>
                <symbol id="ico-calendar" viewBox="0 0 24 24">
                  <rect x="3" y="5" width="18" height="16" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="2"></rect>
                  <path d="M8 3v4M16 3v4M3 11h18" fill="none" stroke="currentColor" strokeWidth="2"></path>
                </symbol>
                <symbol id="ico-qr" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="2"></rect>
                  <rect x="13" y="3" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="2"></rect>
                  <rect x="3" y="13" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="2"></rect>
                  <path d="M15 13h6v8h-6M15 17h2M19 17h2" fill="none" stroke="currentColor" strokeWidth="2"></path>
                </symbol>
                <symbol id="ico-card" viewBox="0 0 24 24">
                  <rect x="2" y="5" width="20" height="14" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="2"></rect>
                  <path d="M2 10h20" fill="none" stroke="currentColor" strokeWidth="2"></path>
                </symbol>
                <symbol id="ico-chart" viewBox="0 0 24 24">
                  <path d="M3 20h18" stroke="currentColor" strokeWidth="2" fill="none"></path>
                  <rect x="5" y="12" width="3" height="6" fill="currentColor"></rect>
                  <rect x="11" y="9" width="3" height="9" fill="currentColor"></rect>
                  <rect x="17" y="6" width="3" height="12" fill="currentColor"></rect>
                </symbol>
                <symbol id="ico-mobile" viewBox="0 0 24 24">
                  <rect x="7" y="2" width="10" height="20" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="2"></rect>
                  <circle cx="12" cy="18" r="1" fill="currentColor"></circle>
                </symbol>
              </svg>

              <svg className="connect-svg" viewBox="0 0 1000 420" preserveAspectRatio="none" aria-hidden="true">
                <path id="l1" className="dotted d1"></path>
                <path id="l2" className="dotted d2"></path>
                <path id="l3" className="dotted d3"></path>
                <path id="r1" className="dotted d1"></path>
                <path id="r2" className="dotted d2"></path>
                <path id="r3" className="dotted d3"></path>
                <path id="leftRail" className="dotted d1"></path>
                <path id="rightRail" className="dotted d1"></path>
                <path id="hubLeft" className="dotted d2"></path>
                <path id="hubRight" className="dotted d2"></path>
              </svg>

              <div className="chip chip-left top"><svg className="ico" viewBox="0 0 24 24"><use href="#ico-user"/></svg>Üye Yönetimi</div>
              <div className="chip chip-left mid"><svg className="ico" viewBox="0 0 24 24"><use href="#ico-calendar"/></svg>Antrenman Planlama</div>
              <div className="chip chip-left bottom"><svg className="ico" viewBox="0 0 24 24"><use href="#ico-qr"/></svg>Yoklama (QR)</div>

              <div className="center-logo"><div className="logo-mask" aria-hidden="true"></div></div>

              <div className="chip chip-right top"><svg className="ico" viewBox="0 0 24 24"><use href="#ico-card"/></svg>Finans & Tahsilat</div>
              <div className="chip chip-right mid"><svg className="ico" viewBox="0 0 24 24"><use href="#ico-chart"/></svg>Raporlama & Analitik</div>
              <div className="chip chip-right bottom"><svg className="ico" viewBox="0 0 24 24"><use href="#ico-mobile"/></svg>Mobil PWA</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section services" id="services">
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-12 text-center">
              <div className="crumb"><span className="dot">⬤</span> Hizmetlerimiz / Ürünlerimiz</div>
              <h2 className="section-title">Spor dünyasına özel yazılım çözümleri</h2>
              <p className="section-subtitle">Kulüpler, antrenörler ve yöneticiler için uçtan uca dijital yönetim.</p>
            </div>
          </div>
          <div className="svc-grid row g-4 mt-5">
            <div className="col-12 col-md-4">
              <article className="svc-card h-100">
                <div className="svc-icon"><svg className="ico" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M16.5 16.5 L21 21" stroke="currentColor" strokeWidth="2" fill="none"/></svg></div>
                <h3>Spor Kulüpleri CMS</h3>
                <p>Kulüp web sitesi, içerik, etkinlik ve medya yönetimi; SEO ve çoklu dil desteği.</p>
              </article>
            </div>
            <div className="col-12 col-md-4">
              <article className="svc-card h-100">
                <div className="svc-icon"><svg className="ico" viewBox="0 0 24 24"><path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M8 7h8M8 11h8M8 15h5" fill="none" stroke="currentColor" strokeWidth="2"/></svg></div>
                <h3>Aidat & Antrenman Takip Sistemi</h3>
                <p>Ödeme takibi, yoklama, antrenman planı, ayrıntılı raporlar.</p>
              </article>
            </div>
            <div className="col-12 col-md-4">
              <article className="svc-card h-100">
                <div className="svc-icon"><svg className="ico" viewBox="0 0 24 24"><path d="M3 20h18" stroke="currentColor" strokeWidth="2" fill="none"></path><rect x="5" y="12" width="3" height="6" fill="currentColor"></rect><rect x="11" y="9" width="3" height="9" fill="currentColor"></rect><rect x="17" y="6" width="3" height="12" fill="currentColor"></rect></svg></div>
                <h3>Next Generation Coaching System</h3>
                <p>Antrenörler için planlama, performans analizi ve takım yönetimi.</p>
              </article>
            </div>
            <div className="col-12 col-md-4">
              <article className="svc-card h-100">
                <div className="svc-icon"><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4h14v3a6 6 0 0 1-6 6h-2a6 6 0 0 1-6-6V4z"/><path d="M5 7c-1.7 0-3-1.3-3-3h3"/><path d="M19 7c1.7 0 3-1.3 3-3h-3"/><path d="M12 13v2"/><path d="M10 15l-2 5h8l-2-5"/><polygon points="12 7.4 12.6 8.6 13.9 8.7 12.9 9.5 13.2 10.8 12 10.2 10.8 10.8 11.1 9.5 10.1 8.7 11.4 8.6"/></g></svg></div>
                <h3>Turnuva Yönetim Yazılımı</h3>
                <p>Turnuva planlama, fikstür, kayıt ve skor yönetimi.</p>
              </article>
            </div>
          </div>
        </div>
      </section>
      
      
      
      <section className="section pricing" id="pricing">
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-12 text-center">
              <div className="crumb"><span className="dot">⬤</span> Fiyatlandırma</div>
              <h2 className="section-title">Planlar ve Fiyatlandırma</h2>
              <p className="section-subtitle">İhtiyacınıza uygun paketleri seçin.</p>
            </div>
          </div>
          <div className="grid grid-3">
            <div className="price-card">
              <div className="price-title">Ay</div>
              <div className="price-value">2.000 ₺</div>
              <ul className="price-features"><li>Topluluk desteği</li><li>Online tahsilat</li><li>Gelişmiş analitik</li><li>SSO ve SLA</li></ul>
              <a className="btn btn-outline" href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('open-chat', { detail: { message: 'Deneme talebi' } })); }}>Denemeye Başla</a>
            </div>
            <div className="price-card">
              <div className="price-title">6 Ay</div>
              <div className="price-value">12.000 ₺</div>
              <ul className="price-features"><li>Topluluk desteği</li><li>Online tahsilat</li><li>Gelişmiş analitik</li><li>SSO ve SLA</li></ul>
              <a className="btn btn-outline" href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('open-chat', { detail: { message: 'Fiyat teklifi (6 Ay)' } })); }}>İletişime Geç</a>
            </div>
            <div className="price-card emphasized">
              <div className="badge">Popüler</div>
              <div className="price-title">Yıllık</div>
              <div className="price-value">20.000 ₺</div>
              <div className="price-savings">Tasarruf: 4.000 ₺</div>
              <ul className="price-features"><li>Topluluk desteği</li><li>Online tahsilat</li><li>Gelişmiş analitik</li><li>SSO ve SLA</li></ul>
              <a className="btn btn-primary" href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('open-chat', { detail: { message: 'Satın alma talebi (Yıllık)' } })); }}>Satın Al</a>
            </div>
          </div>
          <div className="price-compare">
            <div className="pc-row pc-head">
              <div className="pc-cell">Özellik</div>
              <div className="pc-cell">Ay</div>
              <div className="pc-cell">6 Ay</div>
              <div className="pc-cell">Yıllık</div>
            </div>
            
            <div className="pc-row">
              <div className="pc-cell">Online tahsilat</div>
              <div className="pc-cell"><span className="pc-yes">✓</span></div>
              <div className="pc-cell"><span className="pc-yes">✓</span></div>
              <div className="pc-cell"><span className="pc-yes">✓</span></div>
            </div>
            <div className="pc-row">
              <div className="pc-cell">Gelişmiş analitik</div>
              <div className="pc-cell"><span className="pc-yes">✓</span></div>
              <div className="pc-cell"><span className="pc-yes">✓</span></div>
              <div className="pc-cell"><span className="pc-yes">✓</span></div>
            </div>
            <div className="pc-row">
              <div className="pc-cell">SSO</div>
              <div className="pc-cell"><span className="pc-yes">✓</span></div>
              <div className="pc-cell"><span className="pc-yes">✓</span></div>
              <div className="pc-cell"><span className="pc-yes">✓</span></div>
            </div>
            <div className="pc-row">
              <div className="pc-cell">SLA</div>
              <div className="pc-cell"><span className="pc-yes">✓</span></div>
              <div className="pc-cell"><span className="pc-yes">✓</span></div>
              <div className="pc-cell"><span className="pc-yes">✓</span></div>
            </div>
            <div className="pc-row">
              <div className="pc-cell">Topluluk desteği</div>
              <div className="pc-cell"><span className="pc-yes">✓</span></div>
              <div className="pc-cell"><span className="pc-yes">✓</span></div>
              <div className="pc-cell"><span className="pc-yes">✓</span></div>
            </div>
            <div className="pc-note">Fiyatlara KDV dahil değildir.</div>
          </div>
        </div>
      </section>

      

      <section className="section contact" id="contact-inline">
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-12 text-center">
              <div className="crumb"><span className="dot">⬤</span> İletişim</div>
            </div>
          </div>
          <div className="row justify-content-center mt-4">
            <div className="col-12 col-lg-7">
              <div className="contact-info">
                <div className="contact-list">
                  <div className="contact-item">
                    <div className="contact-ico"><svg className="ico" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="2"></rect><path d="M3 7l9 6 9-6" fill="none" stroke="currentColor" strokeWidth="2"></path></svg></div>
                    <div className="contact-text"><strong>E-posta</strong><div><a className="link" href="mailto:info@spormanage.com">info@spormanage.com</a></div></div>
                  </div>
                  <div className="contact-item">
                    <div className="contact-ico"><svg className="ico" viewBox="0 0 24 24"><path d="M8 16l8-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path><path d="M10 14l-3 3 a4 4 0 0 1-6-6l3-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path><path d="M14 10l3-3a4 4 0 0 1 6 6l-3 3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path></svg></div>
                    <div className="contact-text"><strong>Web</strong><div><a className="link" href="https://spormanage.com" target="_blank">spormanage.com</a></div></div>
                  </div>
                  <div className="contact-item">
                    <div className="contact-ico"><svg className="ico" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"></circle><path d="M8 12h8" stroke="currentColor" strokeWidth="2"></path><path d="M12 8v8" stroke="currentColor" strokeWidth="2"></path></svg></div>
                    <div className="contact-text"><strong>Sosyal</strong><div className="social-links"><a className="link" href="https://linkedin.com" target="_blank">LinkedIn</a><a className="link" href="https://instagram.com" target="_blank">Instagram</a><a className="link" href="https://x.com" target="_blank">X</a></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-bottom">
          <div><Image className="logo" src="/assets/img/spormanage-logo.png" alt="Spormanage" width={170} height={48} /></div>
          <div className="muted">Tüm hakları saklıdır.</div>
        </div>
      </footer>
    </div>
  );
}
