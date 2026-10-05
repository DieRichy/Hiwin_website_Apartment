// Count contact actions separately from actual enquiries received.
document.addEventListener('click', event => {
  if (location.hostname !== 'hiwin-partners.com' || typeof window.gtag !== 'function') return;
  const link = event.target.closest?.('a[href]');
  if (!link) return;
  const destination = new URL(link.href, location.href);
  let channel;
  if (destination.protocol === 'mailto:') channel = 'email';
  else if (destination.protocol === 'tel:') channel = 'phone';
  else if (destination.hostname === 'wa.me') channel = 'whatsapp';
  else if (destination.hostname === 'line.me') channel = 'line';
  if (!channel) return;
  // Send only channel and page language, without recipient details or link text.
  window.gtag('event', 'contact_click', {
    contact_channel: channel,
    site_language: document.documentElement.lang,
    transport_type: 'beacon'
  });
});
