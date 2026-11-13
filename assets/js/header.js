/* =========================================================
   Cheri Long Commercial - Header Injection & Behavior
   v1011 - Map search pages: lock page scrolling (html.clc-map-lock) so only the
           results list scrolls, not the hidden page behind the map.
   v1010 - No "Talk to Our Team" button and no top strip: "Call Cheri" + social
           icons sit at the right of the header. Phones get a "☰ Menu"
           button (hamburger) with a drop-down menu, plus a call button.
   v1008 - Listings link filters to the City of Calgary (pak=city:…) and
           sorts newest first. Map search pages (body.clc-map-page): BoldTrail's
           pinned map + results panel start below our header (--clc-top).
   v1007 - No script changes (full-width layout is CSS only).
   v1006 - See-through header over the hero photo on the homepage and
           the subdomain pages (body.clc-overlay); turns solid black
           after scrolling. Logo only (no "Cheri Long Commercial" text).
   v1005 - Services, About and Contact are now their own pages on
           info.cherilongcommercial.com (PAGES). Builds the shared
           contact & legal footer into #clc-site-footer on those pages.
   v1004 - Royal LePage Commercial / Royal LePage Solutions logo beside
           Cheri's name in the header (LOGO_URL).
   v1003 - Real phone + social links. YouTube removed (no channel yet).
           SHOW_FORMS = false hides "Resources & Guides" and
           "Newsletter sign-up" until the lead forms are wired up.
   v1002 - "Listings" opens the map of all commercial listings in Calgary
           (LISTINGS_URL) instead of the homepage carousel.
   v1001 - Builds the utility bar + flat-nav header at the top
           of every page (BoldTrail and info.cherilongcommercial.com).
           Adds body.has-clc-header (header.css then hides
           BoldTrail's own header) and html.clc-ready (reveals
           the page; FOUC guard lives in Custom Header Code).
   Bump ?v= in BOTH BoldTrail Custom Code fields when this changes.
   ========================================================= */
console.log('CLC HEADER JS LOADED v1011');
(function () {
  const VERSION = '1011';

  /* ─── CONFIG ─── */
  const BOLDTRAIL_BASE = 'https://cherilongcommercial.com';   // used only off BoldTrail (subdomain pages)
  // "Listings" menu link: all commercial listings in Calgary. Keep the same as
  // ALL_LISTINGS_URL in the Custom Body Code.
  const LISTINGS_URL = '/index.php?advanced=1&rtype=map&display=Calgary&pak=city%3Ag30_c3nfkdtg&types%5B%5D=4&types%5B%5D=5&types%5B%5D=3&types%5B%5D=12&sortby=listings.listingdate+DESC#rslt';
  const PHONE = '403-860-9419';                                 // Cheri's cell
  // Royal LePage Commercial logo: black/red for the white header (search & listing pages),
  // white/red for the see-through header over photos. Leave LOGO_URL '' to show a text name instead.
  const LOGO_URL = 'https://info.cherilongcommercial.com/assets/images/rlp-commercial-brokerage-black-red.png';
  const LOGO_URL_LIGHT = 'https://info.cherilongcommercial.com/assets/images/rlp-commercial-brokerage-white-red.png';
  const SOCIAL = {
    instagram: 'https://www.instagram.com/cherilongcommercial/',
    facebook:  'https://www.facebook.com/CheriLongCommercialBroker',
    linkedin:  'https://www.linkedin.com/in/cheri-long-8646439/',
    youtube:   ''     // add her channel link here when it exists; '' hides the icon
  };
  // Stand-alone pages on the subdomain (menu + "Talk to Our Team" link here)
  const SITE = 'https://info.cherilongcommercial.com';
  const PAGES = {
    services: SITE + '/services/',
    about:    SITE + '/about/',
    contact:  SITE + '/contact/'
  };
  const EMAIL = 'cladmin@royallepage.ca';            // Victoria Stitt, general inquiries
  const FOOTER_LOGO = SITE + '/assets/images/rlp-commercial-brokerage-white-red.png';

  // false = hide "Resources & Guides" and "Newsletter sign-up" until the lead forms are live.
  // Keep the same as SHOW_FORMS in the Custom Body Code.
  const SHOW_FORMS = false;

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
      (SOCIAL.youtube ? '<a href="' + SOCIAL.youtube + '" aria-label="YouTube" target="_blank" rel="noopener"><svg><use href="#clc-yt"/></svg></a>' : '') +
      '</div>';
  }

  /* ─── Markup ─── */
  const TEL = 'tel:+1' + PHONE.replace(/[^0-9]/g, '');
  const PHONE_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2Z"/></svg>';

  function buildHeaderHTML() {
    return `
      <div class="clc-wrap clc-head-top">
        <a class="clc-brand-row" data-home href="/" aria-label="Cheri Long Commercial home">
          ${LOGO_URL
            ? '<img class="clc-rlp-logo clc-logo-dark" src="' + LOGO_URL + '" alt="Royal LePage Commercial, Royal LePage Solutions" width="809" height="324">' +
              '<img class="clc-rlp-logo clc-logo-light" src="' + LOGO_URL_LIGHT + '" alt="Royal LePage Commercial, Royal LePage Solutions" width="809" height="324">'
            : '<span class="clc-brand"><b>Cheri Long <i>Commercial</i></b><span>Royal LePage&reg; Commercial</span></span>'}
        </a>
        <div class="clc-head-contact">
          <a class="clc-call" href="${TEL}">Call Cheri <span class="clc-tel">${PHONE}</span></a>
          ${social()}
        </div>
        <div class="clc-mobile-actions">
          <a class="clc-call-icon" href="${TEL}" aria-label="Call Cheri ${PHONE}">${PHONE_ICON}</a>
          <button class="clc-menu-btn" type="button" aria-expanded="false" aria-controls="clc-nav">
            <span class="clc-burger" aria-hidden="true"><i></i><i></i><i></i></span><span class="clc-menu-label">Menu</span>
          </button>
        </div>
      </div>
      <nav class="clc-nav" id="clc-nav" aria-label="Main"><div class="clc-wrap"><ul>
        <li><a data-home href="/">Home</a></li>
        <li><a data-listings href="#">Listings</a></li>
        <li><a data-page="services" href="#">Services</a></li>
        <li><a data-page="about" href="#">About Cheri &amp; Team</a></li>
        ${SHOW_FORMS ? '<li><a data-sec="clc-guides" href="#">Resources &amp; Guides</a></li>' : ''}
        <li><a data-page="contact" href="#">Contact</a></li>
      </ul>
      <div class="clc-nav-extra">
        <a class="clc-nav-call" href="${TEL}">${PHONE_ICON}<span>Call Cheri <b class="clc-tel">${PHONE}</b></span></a>
        ${social()}
      </div></div></nav>`;
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
      skip.insertAdjacentElement('afterend', header);
      bindMenu(header);
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
    // Stand-alone pages: menu links + mark the page we're on
    const onSubdomain = location.hostname === SITE.replace('https://', '');
    document.querySelectorAll('#clc-header a[data-page]').forEach(function (a) {
      const url = PAGES[a.getAttribute('data-page')];
      a.setAttribute('href', url);
      const here = onSubdomain && location.pathname.replace(/index\.html$/, '') === url.replace(SITE, '');
      if (here && a.closest('nav')) a.setAttribute('aria-current', 'page');
    });
    buildFooter();

    body.classList.add('has-clc-header');
    setOverlay();
    setMapOffset();
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

  /* ─── Phone "☰ Menu" button ─── */
  function bindMenu(header) {
    const btn = header.querySelector('.clc-menu-btn');
    if (!btn) return;
    const label = btn.querySelector('.clc-menu-label');
    const set = function (open) {
      document.body.classList.toggle('clc-menu-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (label) label.textContent = open ? 'Close' : 'Menu';
    };
    btn.addEventListener('click', function () { set(!document.body.classList.contains('clc-menu-open')); });
    header.querySelectorAll('.clc-nav a').forEach(function (a) { a.addEventListener('click', function () { set(false); }); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('clc-menu-open')) { set(false); btn.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 760) set(false); });
  }

  /* ─── See-through header over a hero photo ───
     On: BoldTrail homepage (#clc-custom-homepage) and subdomain pages with .clc-page-hero.
     Off: every other BoldTrail page (search, listings) keeps the solid white header. */
  let scrollBound = false;
  function setOverlay() {
    const hasHero = !!document.querySelector('body.page-home #clc-custom-homepage, .clc-page-hero');
    document.body.classList.toggle('clc-overlay', hasHero);
    if (!hasHero || scrollBound) return;
    scrollBound = true;
    let ticking = false;
    const update = function () {
      ticking = false;
      // Turn solid once the visitor has scrolled past the see-through header
      document.body.classList.toggle('clc-scrolled', window.scrollY > 140);
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ─── Map search pages: BoldTrail pins #listings-map 110px from the top (its own header).
     Measure our header and move the map + results panel down to match. */
  let mapBound = false;
  function setMapOffset() {
    if (!document.getElementById('listings-map')) return;
    document.body.classList.add('clc-map-page');
    if (window.innerWidth >= 768) {
      document.documentElement.classList.add('clc-map-lock');
      if (window.scrollY) window.scrollTo(0, 0);
    }
    const measure = function () {
      const h = document.getElementById('clc-header');
      const top = h ? Math.round(h.getBoundingClientRect().bottom) : 0;   // bottom edge of our header
      if (top > 0) document.documentElement.style.setProperty('--clc-top', top + 'px');
    };
    measure();
    if (!mapBound) { mapBound = true; window.addEventListener('resize', measure); window.addEventListener('load', measure); }
  }

  /* ─── Contact & legal footer for subdomain pages (fills #clc-site-footer) ─── */
  function buildFooter() {
    const slot = document.getElementById('clc-site-footer');
    if (!slot || slot.dataset.built === 'true') return;
    const tel = PHONE.replace(/[^0-9]/g, '');
    slot.innerHTML = `
      <div class="clc-wrap">
        <div class="clc-foot-grid">
          <div>
            <div class="clc-foot-brand"><b>Cheri Long <i>Commercial</i></b></div>
            <img class="clc-foot-logo" src="${FOOTER_LOGO}" alt="Royal LePage Commercial, Royal LePage Solutions" width="809" height="324" loading="lazy">
            ${social()}
          </div>
          <div>
            <h4>Cheri Long</h4>
            <p>Associate Broker</p>
            <p>Cell <a class="clc-tel" href="tel:+1${tel}">${PHONE}</a></p>
          </div>
          <div>
            <h4>General inquiries</h4>
            <p>Victoria Stitt, Assistant</p>
            <p><a href="mailto:${EMAIL}">${EMAIL}</a></p>
          </div>
          <div>
            <h4>Office</h4>
            <p>Royal LePage&reg; Solutions</p>
            <p>Unit 205, 264 Midpark Way SE</p>
            <p>Calgary, AB&nbsp; T2X 1J6</p>
          </div>
        </div>
        <div class="clc-legal">
          <p>&copy; ${new Date().getFullYear()} Cheri Long Commercial. Royal LePage&reg; is a registered trademark of Bridgemarq Real Estate Services Inc. Each office is independently owned and operated. Not intended to solicit buyers or sellers currently under contract. See <a href="https://rlp.ca/notices" target="_blank" rel="noopener">rlp.ca/notices</a>.</p>
          <p>Listing information is deemed reliable but not guaranteed and should be independently verified.</p>
          <nav aria-label="Legal"><a href="https://www.royallepage.ca/en/realestate/privacy-policy/" target="_blank" rel="noopener">Privacy Policy</a><a href="https://www.royallepage.ca/en/realestate/noticesanddisclaimers" target="_blank" rel="noopener">Notices &amp; Disclaimers</a></nav>
        </div>
      </div>`;
    slot.dataset.built = 'true';
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
