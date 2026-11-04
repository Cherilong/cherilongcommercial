/* =========================================================
   Cheri Long Commercial - Header Injection & Behavior
   v1002 - "Listings" opens the map of all commercial listings in Calgary
           (LISTINGS_URL) instead of the homepage carousel.
   v1001 - Builds the utility bar + flat-nav header at the top
           of every page (BoldTrail and info.cherilongcommercial.com).
           Adds body.has-clc-header (header.css then hides
           BoldTrail's own header) and html.clc-ready (reveals
           the page; FOUC guard lives in Custom Header Code).
   Bump ?v= in BOTH BoldTrail Custom Code fields when this changes.
   ========================================================= */
console.log('CLC HEADER JS LOADED v1002');
(function () {
  const VERSION = '1002';

  /* ─── CONFIG ─── */
  const BOLDTRAIL_BASE = 'https://cherilongcommercial.com';   // used only off BoldTrail (subdomain pages)
  // "Listings" menu link: all commercial listings in Calgary. Keep the same as
  // ALL_LISTINGS_URL in the Custom Body Code.
  const LISTINGS_URL = '/index.php?advanced=1&rtype=map&display=Calgary&types%5B%5D=5&types%5B%5D=3&types%5B%5D=4&types%5B%5D=12#rslt';
  const PHONE = '403-000-0000';                                 // TODO: Cheri's cell
  // Logo image (white background version). Leave '' to show the text name instead.
  // e.g. 'https://raw.githubusercontent.com/Cherilong/cherilongcommercial/main/assets/images/logo.png'
  const LOGO_URL = '';
  const SOCIAL = {
    instagram: '#',   // TODO
    facebook:  '#',   // TODO
    linkedin:  '#',   // TODO
    youtube:   '#'    // placeholder until her channel is live
  };

  const SPRITE =
    '<svg width="0" height="0" style="position:absolute" aria-hidden="true">' +
    '<symbol id="clc-ig" viewBox="0 0 24 24"><path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4ZM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4ZM12 2c-2.7 0-3 0-4.1.1C4.3 2.2 2.2 4.3 2.1 7.9 2 9 2 9.3 2 12s0 3 .1 4.1c.1 3.6 2.2 5.7 5.8 5.8 1.1.1 1.4.1 4.1.1s3 0 4.1-.1c3.6-.1 5.7-2.2 5.8-5.8.1-1.1.1-1.4.1-4.1s0-3-.1-4.1c-.1-3.6-2.2-5.7-5.8-5.8C15 2 14.7 2 12 2Zm0 1.8c2.7 0 3 0 4 .1 2.6.1 3.9 1.4 4 4 .1 1 .1 1.3.1 4s0 3-.1 4c-.1 2.6-1.4 3.9-4 4-1 .1-1.3.1-4 .1s-3 0-4-.1c-2.6-.1-3.9-1.4-4-4-.1-1-.1-1.3-.1-4s0-3 .1-4c.1-2.6 1.4-3.9 4-4 1-.1 1.3-.1 4-.1Z"/></symbol>' +
    '<symbol id="clc-fb" viewBox="0 0 24 24"><path d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.5c0-.9.3-1.6 1.6-1.6h1.7V4.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.3v3.2h2.8V22h3.4Z"/></symbol>' +
    '<symbol id="clc-li" viewBox="0 0 24 24"><path d="M6.9 8.8H3.6V20h3.3V8.8ZM5.2 3.5a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8ZM20.4 13.6c0-3-.6-5.1-4.1-5.1-1.7 0-2.8.9-3.2 1.8h-.1V8.8H9.9V20h3.3v-5.5c0-1.5.3-2.9 2.1-2.9s1.8 1.7 1.8 3V20h3.3v-6.4Z"/></symbol>' +
    '<symbol id="clc-yt" viewBox="0 0 24 24"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z"/></symbol>' +
    '</svg>';

  function social() {
    return '<div class="clc-social" aria-label="Social media">' +
      '<a href="' + SOCIAL.instagram + '" aria-label="Instagram" target="_blank" rel="noopener"><svg><use href="#clc-ig"/></svg></a>' +
      '<a href="' + SOCIAL.facebook + '" aria-label="Facebook" target="_blank" rel="noopener"><svg><use href="#clc-fb"/></svg></a>' +
      '<a href="' + SOCIAL.linkedin + '" aria-label="LinkedIn" target="_blank" rel="noopener"><svg><use href="#clc-li"/></svg></a>' +
      '<a href="' + SOCIAL.youtube + '" aria-label="YouTube (coming soon)" target="_blank" rel="noopener"><svg><use href="#clc-yt"/></svg></a>' +
      '</div>';
  }

  /* ─── Markup ─── */
  function buildTopbarHTML() {
    return `
      <div class="clc-wrap">
        ${social()}
        <div class="clc-util-right">
          <a data-sec="clc-newsletter" href="#">Newsletter sign-up</a>
          <a class="clc-call" href="tel:${PHONE.replace(/[^0-9+]/g, '')}">Call Cheri <span class="clc-tel">${PHONE}</span></a>
        </div>
      </div>`;
  }

  function buildHeaderHTML() {
    return `
      <div class="clc-wrap clc-head-top">
        <a class="clc-brand" data-home href="/" aria-label="Cheri Long Commercial home">
          ${LOGO_URL
            ? '<img src="' + LOGO_URL + '" alt="Cheri Long Commercial, Royal LePage Commercial">'
            : '<b>Cheri Long <i>Commercial</i></b><span>Royal LePage&reg; Commercial</span>'}
        </a>
        <a class="clc-btn" data-sec="clc-contact" href="#">Talk to Our Team</a>
      </div>
      <nav class="clc-nav" aria-label="Main"><div class="clc-wrap"><ul>
        <li><a data-home href="/">Home</a></li>
        <li><a data-listings href="#">Listings</a></li>
        <li><a data-sec="clc-services" href="#">Services</a></li>
        <li><a data-sec="clc-team" href="#">About Cheri &amp; Team</a></li>
        <li><a data-sec="clc-guides" href="#">Resources &amp; Guides</a></li>
        <li><a data-sec="clc-contact" href="#">Contact</a></li>
      </ul></div></nav>`;
  }

  /* ─── Inject everything ─── */
  function ensureInjected() {
    const body = document.body;
    if (!document.getElementById('clc-ig')) body.insertAdjacentHTML('afterbegin', SPRITE);

    let header = document.getElementById('clc-header');
    if (!header) {
      // Skip link for keyboard / screen-reader users (visible only when focused)
      const main = document.querySelector('#clc-custom-homepage, #clc-page, .main, main');
      if (main && !main.id) main.id = 'clc-main';
      const skip = document.createElement('a');
      skip.className = 'clc-skip';
      skip.href = '#' + (main ? main.id : 'clc-header');
      skip.textContent = 'Skip to main content';
      body.insertAdjacentElement('afterbegin', skip);

      header = document.createElement('header');
      header.id = 'clc-header';
      header.innerHTML = buildHeaderHTML();
      const topbar = document.createElement('div');
      topbar.id = 'clc-topbar';
      topbar.innerHTML = buildTopbarHTML();
      skip.insertAdjacentElement('afterend', topbar);
      topbar.insertAdjacentElement('afterend', header);
    }

    // Links: section on this page → #id; otherwise the homepage section
    const onBoldTrail = !!document.querySelector('#header, .kv-header, .site-header, .listings.container');
    const base = onBoldTrail ? '' : BOLDTRAIL_BASE;
    const isHome = !!document.getElementById('clc-custom-homepage');
    document.querySelectorAll('#clc-topbar a[data-sec], #clc-header a[data-sec]').forEach(function (a) {
      const id = a.getAttribute('data-sec');
      a.setAttribute('href', document.getElementById(id) ? '#' + id : base + '/#' + id);
    });
    document.querySelectorAll('#clc-header a[data-home]').forEach(function (a) { a.setAttribute('href', base + '/'); });
    document.querySelectorAll('#clc-header a[data-listings]').forEach(function (a) { a.setAttribute('href', base + LISTINGS_URL); });
    const homeLink = document.querySelector('#clc-header nav a[data-home]');
    if (homeLink) { isHome ? homeLink.setAttribute('aria-current', 'page') : homeLink.removeAttribute('aria-current'); }

    body.classList.add('has-clc-header');
    requestAnimationFrame(function () {
      const first = !document.documentElement.classList.contains('clc-ready');
      document.documentElement.classList.add('clc-ready');   // FOUC guard: reveal the page
      // Arrived via /#clc-section from another page: jump there now that it exists
      if (first && /^#clc-[\w-]+$/.test(location.hash)) {
        const t = document.getElementById(location.hash.slice(1));
        if (t) t.scrollIntoView();
      }
    });
    console.log('[CLC Header] Injected + bound OK - v' + VERSION);
  }

  function run() {
    ensureInjected();
    setTimeout(ensureInjected, 500);
    setTimeout(ensureInjected, 1500);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
    window.addEventListener('load', run);
  } else {
    run();
  }
})();
