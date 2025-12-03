"use client";
import Link from "next/link";
import Image from "next/image";

export default function ContactPage() {

  return (
    <div>
      <div className="page-top-bg" aria-hidden="true"></div>
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" href="/">
            <Image className="logo" src="/assets/img/spormanage-logo.png" alt="Spormanage" width={170} height={48} />
          </Link>
          <nav className="main-nav" aria-label="Ana menü">
            <Link href="/#services">Hizmetler</Link>
            <Link href="/#get-started">Çözümler</Link>
            <Link href="/#pricing">Fiyatlandırma</Link>
            <Link href="/contact">İletişim</Link>
          </nav>
          <div className="header-actions">
            <button className="btn btn-primary" onClick={() => window.dispatchEvent(new Event("open-chat"))}><span className="btn-ico">🤖</span>Asistan</button>
          </div>
        </div>
      </header>

      <section className="section contact" id="contact">
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-12 text-center">
              <div className="crumb"><span className="dot">⬤</span> İletişim</div>
              <h2 className="section-title">Bize Ulaşın</h2>
              <p className="section-subtitle">Sorularınız için hızlıca geri döneriz.</p>
            </div>
          </div>

          <div className="row justify-content-center mt-4">
            <div className="col-12 col-lg-6">
              <div className="contact-info">
                <div className="contact-list">
                  <div className="contact-item">
                    <div className="contact-ico"><svg className="ico" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="2"></rect><path d="M3 7l9 6 9-6" fill="none" stroke="currentColor" strokeWidth="2"></path></svg></div>
                    <div className="contact-text"><strong>E-posta</strong><div><a className="link" href="mailto:info@spormanage.com">info@spormanage.com</a></div></div>
                  </div>
                  <div className="contact-item address">
                    <div className="contact-ico"><svg className="ico" viewBox="0 0 24 24"><path d="M12 22s-7-6-7-11a7 7 0 1 1 14 0c0 5-7 11-7 11z" fill="none" stroke="currentColor" strokeWidth="2"></path><circle cx="12" cy="11" r="3" fill="currentColor"></circle></svg></div>
                    <div className="contact-text"><strong>Adres</strong><div>İstanbul, Türkiye</div></div>
                  </div>
                  <div className="contact-item">
                    <div className="contact-ico"><svg className="ico" viewBox="0 0 24 24"><path d="M8 16l8-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path><path d="M10 14l-3 3 a4 4 0 0 1-6-6l3-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path><path d="M14 10l3-3a4 4 0 0 1 6 6l-3 3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path></svg></div>
                    <div className="contact-text"><strong>Bağlantılar</strong><div><a className="link" href="https://spormanage.com" target="_blank">spormanage.com</a></div></div>
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
