// Küçük etkileşimler: mobil menü, header sıkıştırma ve sahte abone olur feedback
(() => {
  const nav = document.querySelector('.main-nav');
  const toggle = document.querySelector('.menu-toggle');
  const header = document.querySelector('.site-header');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
  }

  const onScroll = () => {
    const compact = window.scrollY > 8;
    header.style.borderBottomColor = compact ? 'rgba(255,106,0,.35)' : 'var(--border)';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const form = document.querySelector('.subscribe-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (!input) return;
      const email = input.value.trim();
      if (!email) return;
      input.value = '';
      const btn = form.querySelector('button');
      if (btn) {
        const old = btn.textContent;
        btn.textContent = 'Teşekkürler!';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = old;
          btn.disabled = false;
        }, 1800);
      }
    });
  }
})();