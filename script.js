// Küçük etkileşimler: mobil menü, header sıkıştırma ve sahte abone olur feedback
(() => {
  const nav = document.querySelector('.main-nav');
  const toggle = document.querySelector('.menu-toggle');
  const header = document.querySelector('.site-header');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      const opened = nav.classList.contains('open');
      document.body.classList.toggle('nav-open', opened);
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

  // AI tarzı iletişim formu
  const chatForm = document.getElementById('contact-ai-form');
  const chatBox = document.querySelector('.chat-messages');
  const addBubble = (text, who = 'ai') => {
    const div = document.createElement('div');
    div.className = `bubble ${who}`;
    div.textContent = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  };
  const addTyping = () => {
    const div = document.createElement('div');
    div.className = 'bubble typing';
    div.innerHTML = '<span class="dot-typing"></span><span class="dot-typing"></span><span class="dot-typing"></span>';
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
    return div;
  };
  const removeNode = (node) => node && node.parentNode && node.parentNode.removeChild(node);

  async function sendToTelegram(payload) {
    try {
      const res = await fetch('http://localhost:8787/api/telegram/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Gönderim başarısız');
      return await res.json();
    } catch (e) {
      throw e;
    }
  }

  if (chatForm && chatBox) {
    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(chatForm);
      const message = (fd.get('message') || '').toString().trim();
      const name = (fd.get('name') || '').toString().trim();
      const email = (fd.get('email') || '').toString().trim();
      if (!message) return;
      addBubble(message, 'user');
      const typing = addTyping();
      try {
        const payload = {
          message,
          name,
          email,
          ua: navigator.userAgent,
          url: location.href,
          ts: Date.now(),
        };
        await sendToTelegram(payload);
        removeNode(typing);
        addBubble('Mesajını aldık! Telegram kanalına iletildi. En kısa sürede dönüş yapacağız.', 'ai');
        chatForm.reset();
      } catch (err) {
        removeNode(typing);
        addBubble('Gönderimde bir sorun oluştu. Lütfen daha sonra tekrar deneyin.', 'ai');
      }
    });
  }
})();
