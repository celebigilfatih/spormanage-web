"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [navOpen, setNavOpen] = useState(false);
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

  return (
    <div>
      <div className="page-top-bg" aria-hidden="true"></div>
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#">
            <img className="logo" src="/assets/img/spormanage-logo.png" alt="Spormanage" />
          </a>
          <nav className={`main-nav ${navOpen ? "open" : ""}`} aria-label="Ana menü">
            <a href="#services">Hizmetler</a>
            <a href="#get-started">Başla</a>
            <a href="#pricing">Fiyatlandırma</a>
            <a href="#contact">İletişim</a>
          </nav>
          <div className="header-actions">
            <button className="btn btn-primary" onClick={() => {
              window.dispatchEvent(new Event('open-chat'));
            }}>Asistan</button>
            <button className="menu-toggle" aria-label="Menüyü aç/kapat" onClick={() => setNavOpen(v => !v)}>☰</button>
          </div>
        </div>
      </header>

      

      <section className="section services" id="services">
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-12 text-center">
              <div className="crumb"><span className="dot">⬤</span> Hizmetlerimiz / Ürünlerimiz</div>
              <h2 className="section-title">Spor dünyasına özel yazılım çözümleri</h2>
              <p className="section-subtitle">Kulüpler, antrenörler ve yöneticiler için uçtan uca dijital yönetim.</p>
            </div>
          </div>
          <div className="row g-4 mt-5">
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
                <h3>NextGen Coaching System</h3>
                <p>Antrenörler için planlama, performans analizi ve takım yönetimi.</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="section hero" id="get-started">
        <div className="container hero-inner">
          <div className="hero-content">
            <h1>Web tabanlı, modüler ve güçlü spor yönetimi</h1>
            <p className="subtitle">Kulübünüzü tek bir yerden yönetin: üye takibi, antrenman planları ve analitik. Güvenli, hızlı ve esnek.</p>
            <div className="cta">
              <a className="btn btn-primary btn-lg" href="#signup">Hemen Başla</a>
              <a className="btn btn-ghost btn-lg" href="#demo">Canlı Demo Gör</a>
            </div>
          </div>
          <div className="hero-card">
            <div className="panel">
              <div className="panel-head"><div className="dot"></div><div className="dot"></div><div className="dot"></div></div>
              <div className="panel-body">
                <div className="panel-title">Kontrol Paneli</div>
                <div className="panel-grid">
                  <div className="mini-card"><div className="mini-title">Üyeler</div><div className="mini-value">1.245</div></div>
                  <div className="mini-card"><div className="mini-title">Tahsilatlar</div><div className="mini-value">₺ 92.400</div></div>
                  <div className="mini-card"><div className="mini-title">Antrenmanlar</div><div className="mini-value">48</div></div>
                  <div className="mini-card"><div className="mini-title">Katılım</div><div className="mini-value">92%</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section pricing" id="pricing">
        <div className="container">
          <div className="grid grid-3">
            <div className="price-card">
              <div className="price-title">Ay</div>
              <div className="price-value">2.000 ₺</div>
              <ul className="price-features"><li>100 sporcu</li><li>Temel raporlar</li><li>Topluluk desteği</li></ul>
              <a className="btn btn-outline" href="#">Denemeye Başla</a>
            </div>
            <div className="price-card">
              <div className="price-title">6 Ay</div>
              <div className="price-value">₺12.000 ₺</div>
              <ul className="price-features"><li>SSO ve SLA</li><li>Özel raporlar</li><li>Atanan başarı yöneticisi</li></ul>
              <a className="btn btn-outline" href="#">İletişime Geç</a>
            </div>
            <div className="price-card emphasized">
              <div className="badge">Popüler</div>
              <div className="price-title">Yıllık</div>
              <div className="price-value">20.000 ₺</div>
              <ul className="price-features"><li>Sınırsız sporcu</li><li>Online tahsilat</li><li>Gelişmiş analitik</li></ul>
              <a className="btn btn-primary" href="#">Satın Al</a>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="section contact">
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-12 text-center">
              <div className="crumb"><span className="dot">⬤</span> İletişim</div>
              <h2 className="section-title">Bize Ulaşın</h2>
              <p className="section-subtitle">Sorularınız için hızlıca geri döneriz.</p>
            </div>
          </div>
          <div className="row justify-content-center mt-4">
            <div className="col-12 col-lg-8">
              <article className="card chat h-100">
                <div className="chat-head">
                  <div className="crumb"><span className="dot">⬤</span> Akıllı İletişim</div>
                  <div className="chat-desc">Mesajınızı yazın, kısa bir ön yanıt ve Telegram’a iletim.</div>
                </div>
                <div className="chat-messages" aria-live="polite">
                  <div className="bubble ai">Merhaba! Nasıl yardımcı olabilirim?</div>
                </div>
                <form className="chat-form" onSubmit={(e) => { e.preventDefault(); window.dispatchEvent(new Event('open-chat')); }}>
                  <input type="text" className="chat-input" name="message" placeholder="Mesajınızı yazın…" required />
                  <div className="chat-fields">
                    <input type="text" className="chat-name" name="name" placeholder="Adınız (opsiyonel)" />
                    <input type="email" className="chat-email" name="email" placeholder="E-posta (opsiyonel)" />
                  </div>
                  <button type="submit" className="btn btn-primary chat-send">Asistanı Aç</button>
                </form>
                
              </article>
            </div>
          </div>
        </div>
      </section>

      
      <footer className="site-footer">
        <div className="container footer-bottom">
          <div><img className="logo" src="/assets/img/spormanage-logo.png" alt="Spormanage" /></div>
          <div className="muted">Tüm hakları saklıdır.</div>
        </div>
      </footer>
    </div>
  );
}
