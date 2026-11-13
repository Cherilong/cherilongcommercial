/* =========================================================
   Cheri Long Commercial - Header, footer, forms & page fixes
   v1012 - Reads everything from site-config.js (window.CLC_SITE).
           Shared footer on EVERY page (BoldTrail + subdomain).
           Inquiry form + newsletter form components (lead capture
           placeholder: opens an email to the assistant until
           CLC_SITE.leadEndpoint is set). Service buttons preselect
           the matching option. Property pages: hide residential-only
           fields. Menu: "About Cheri".
   v1011 - Map search pages: lock page scrolling (html.clc-map-lock).
   v1010 - "Call Cheri" + socials at the right; phone "\u2630 Menu".
   v1008 - Map search pages sit below our header (--clc-top).
   v1006 - See-through header over hero photos (body.clc-overlay).
   v1001 - Builds the header on every page; html.clc-ready reveals the page.
   Bump ?v= in BOTH BoldTrail Custom Code fields and the subdomain pages when this changes.
   ========================================================= */
console.log('CLC HEADER JS LOADED v1012');
(function () {
  const VERSION = '1012';

  /* \u2500\u2500\u2500 CONFIG: everything comes from assets/js/site-config.js \u2500\u2500\u2500 */
  const S = window.CLC_SITE || {};
  const MAIN = S.mainSite || 'https://www.cherilongcommercial.com';
  const SUB = S.subSite || 'https://info.cherilongcommercial.com';
  const LISTINGS_URL = S.listingsUrl || MAIN + '/index.php?advanced=1&rtype=map&display=Calgary&pak=city%3Ag30_c3nfkdtg&types%5B%5D=4&types%5B%5D=5&types%5B%5D=3&types%5B%5D=12&sortby=listings.listingdate+DESC#rslt';
  const PAGES = S.pages || { services: SUB + '/services/', about: SUB + '/about/', contact: SUB + '/contact/' };
  const PHONE = S.phone || '403-860-9419';
  const SOCIAL = S.social || { instagram: 'https://www.instagram.com/cherilongcommercial/', facebook: 'https://www.facebook.com/CheriLongCommercialBroker', linkedin: 'https://www.linkedin.com/in/cheri-long-8646439/' };
  const ASSIST = S.assistant || { name: 'Victoria Stitt', title: 'Assistant', email: 'cladmin@royallepage.ca' };
  const OFFICE = S.office || { brokerage: 'Royal LePage\u00ae Solutions', unit: 'Unit 205', street: '264 Midpark Way SE', city: 'Calgary', province: 'AB', postal: 'T2X 1J6' };
  const isPh = S.isPlaceholder || function (v) { return !v || /^\s*\[.*\]\s*$/.test(String(v)); };
  const TEL = 'tel:+1' + PHONE.replace(/[^0-9]/g, '');
  const LOGO_URL = SUB + '/assets/images/rlp-commercial-brokerage-black-red.png';
  const LOGO_URL_LIGHT = SUB + '/assets/images/rlp-commercial-brokerage-white-red.png';

  // false = hide "Resources & Guides" (checklists) until the checklist PDFs exist.
  const SHOW_GUIDES = false;

  const esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  const SPRITE =
    '<svg width="0" height="0" style="position:absolute" aria-hidden="true">' +
    '<symbol id="clc-ig" viewBox="0 0 24 24"><path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4ZM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4ZM12 2c-2.7 0-3 0-4.1.1C4.3 2.2 2.2 4.3 2.1 7.9 2 9 2 9.3 2 12s0 3 .1 4.1c.1 3.6 2.2 5.7 5.8 5.8 1.1.1 1.4.1 4.1.1s3 0 4.1-.1c3.6-.1 5.7-2.2 5.8-5.8.1-1.1.1-1.4.1-4.1s0-3-.1-4.1c-.1-3.6-2.2-5.7-5.8-5.8C15 2 14.7 2 12 2Zm0 1.8c2.7 0 3 0 4 .1 2.6.1 3.9 1.4 4 4 .1 1 .1 1.3.1 4s0 3-.1 4c-.1 2.6-1.4 3.9-4 4-1 .1-1.3.1-4 .1s-3 0-4-.1c-2.6-.1-3.9-1.4-4-4-.1-1-.1-1.3-.1-4s0-3 .1-4c.1-2.6 1.4-3.9 4-4 1-.1 1.3-.1 4-.1Z"/></symbol>' +
    '<symbol id="clc-fb" viewBox="0 0 24 24"><path d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.5c0-.9.3-1.6 1.6-1.6h1.7V4.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.3v3.2h2.8V22h3.4Z"/></symbol>' +
    '<symbol id="clc-li" viewBox="0 0 24 24"><path d="M6.9 8.8H3.6V20h3.3V8.8ZM5.2 3.5a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8ZM20.4 13.6c0-3-.6-5.1-4.1-5.1-1.7 0-2.8.9-3.2 1.8h-.1V8.8H9.9V20h3.3v-5.5c0-1.5.3-2.9 2.1-2.9s1.8 1.7 1.8 3V20h3.3v-6.4Z"/></symbol>' +
    '<symbol id="clc-yt" viewBox="0 0 24 24"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z"/></symbol>' +
    '</svg>';

  function social() {
    return '<div class="clc-social" aria-label="Social media">' +
      (SOCIAL.instagram ? '<a href="' + SOCIAL.instagram + '" aria-label="Instagram" target="_blank" rel="noopener"><svg><use href="#clc-ig"/></svg></a>' : '') +
      (SOCIAL.facebook ? '<a href="' + SOCIAL.facebook + '" aria-label="Facebook" target="_blank" rel="noopener"><svg><use href="#clc-fb"/></svg></a>' : '') +
      (SOCIAL.linkedin ? '<a href="' + SOCIAL.linkedin + '" aria-label="LinkedIn" target="_blank" rel="noopener"><svg><use href="#clc-li"/></svg></a>' : '') +
      (SOCIAL.youtube ? '<a href="' + SOCIAL.youtube + '" aria-label="YouTube" target="_blank" rel="noopener"><svg><use href="#clc-yt"/></svg></a>' : '') +
      '</div>';
  }

  /* \u2500\u2500\u2500 Header markup \u2500\u2500\u2500 */
  const PHONE_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2Z"/></svg>';

  function buildHeaderHTML() {
    return `
      <div class="clc-wrap clc-head-top">
        <a class="clc-brand-row" data-home href="/" aria-label="Cheri Long Commercial home">
          <img class="clc-rlp-logo clc-logo-dark" src="${LOGO_URL}" alt="Royal LePage Commercial, Royal LePage Solutions" width="809" height="324">
          <img class="clc-rlp-logo clc-logo-light" src="${LOGO_URL_LIGHT}" alt="Royal LePage Commercial, Royal LePage Solutions" width="809" height="324">
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
        <li><a data-page="about" href="#">About Cheri</a></li>
        ${SHOW_GUIDES ? '<li><a data-sec="clc-guides" href="#">Resources &amp; Guides</a></li>' : ''}
        <li><a data-page="contact" href="#">Contact</a></li>
      </ul>
      <div class="clc-nav-extra">
        <a class="clc-nav-call" href="${TEL}">${PHONE_ICON}<span>Call Cheri <b class="clc-tel">${PHONE}</b></span></a>
        ${social()}
      </div></div></nav>`;
  }

  /* \u2500\u2500\u2500 Inject everything \u2500\u2500\u2500 */
  function ensureInjected() {
    const body = document.body;
    if (!document.getElementById('clc-ig')) body.insertAdjacentHTML('afterbegin', SPRITE);

    let header = document.getElementById('clc-header');
    if (!header) {
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

    const onBoldTrail = !!document.querySelector('#header, .kv-header, .site-header, .listings.container, #footer');
    const base = onBoldTrail ? '' : MAIN;
    const isHome = !!document.getElementById('clc-custom-homepage');
    document.querySelectorAll('#clc-header a[data-sec]').forEach(function (a) {
      const id = a.getAttribute('data-sec');
      a.setAttribute('href', document.getElementById(id) ? '#' + id : MAIN + '/#' + id);
    });
    document.querySelectorAll('#clc-header a[data-home]').forEach(function (a) { a.setAttribute('href', base + '/'); });
    document.querySelectorAll('a[data-listings], a[data-all-listings]').forEach(function (a) { a.setAttribute('href', LISTINGS_URL); });
    const homeLink = document.querySelector('#clc-header nav a[data-home]');
    if (homeLink) { isHome ? homeLink.setAttribute('aria-current', 'page') : homeLink.removeAttribute('aria-current'); }
    const onSubdomain = location.hostname === SUB.replace('https://', '');
    document.querySelectorAll('#clc-header a[data-page]').forEach(function (a) {
      const url = PAGES[a.getAttribute('data-page')];
      a.setAttribute('href', url);
      const here = onSubdomain && location.pathname.replace(/index\.html$/, '') === url.replace(SUB, '');
      if (here && a.closest('nav')) a.setAttribute('aria-current', 'page');
    });

    buildFooter(onBoldTrail);
    document.querySelectorAll('[data-clc-inquiry]').forEach(renderInquiry);
    document.querySelectorAll('[data-clc-newsletter]').forEach(renderNewsletter);
    bindIntentLinks();
    if (S.fill) S.fill();
    if (document.querySelector('.details-page')) cleanDetailsPage();

    body.classList.add('has-clc-header');
    setOverlay();
    setMapOffset();
    requestAnimationFrame(function () {
      const first = !document.documentElement.classList.contains('clc-ready');
      document.documentElement.classList.add('clc-ready');
      if (first && /^#clc-[\w-]+$/.test(location.hash)) {
        const t = document.getElementById(location.hash.slice(1));
        if (t) t.scrollIntoView();
      }
      if (!intentApplied && document.querySelector('form.clc-inquiry')) { intentApplied = true; applyIntentFromUrl(); }
    });
  }

  /* \u2500\u2500\u2500 Phone "\u2630 Menu" button \u2500\u2500\u2500 */
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

  /* \u2500\u2500\u2500 See-through header over a hero photo \u2500\u2500\u2500 */
  let scrollBound = false;
  function setOverlay() {
    const hasHero = !!document.querySelector('body.page-home #clc-custom-homepage, .clc-page-hero');
    document.body.classList.toggle('clc-overlay', hasHero);
    if (!hasHero || scrollBound) return;
    scrollBound = true;
    let ticking = false;
    const update = function () {
      ticking = false;
      document.body.classList.toggle('clc-scrolled', window.scrollY > 140);
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* \u2500\u2500\u2500 Map search pages \u2500\u2500\u2500 */
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
      const top = h ? Math.round(h.getBoundingClientRect().bottom) : 0;
      if (top > 0) document.documentElement.style.setProperty('--clc-top', top + 'px');
    };
    measure();
    if (!mapBound) { mapBound = true; window.addEventListener('resize', measure); window.addEventListener('load', measure); }
  }

  /* \u2500\u2500\u2500 Shared contact & legal footer (same on BoldTrail and the subdomain) \u2500\u2500\u2500
     Subdomain pages have <footer id="clc-site-footer">. On BoldTrail pages we create it just
     above BoldTrail's footer; header.css hides BoldTrail's duplicate logo/agent block but keeps
     the MLS\u00ae/CREA/DDF\u00ae disclaimers, trademark notices and "Powered by BoldTrail". */
  function buildFooter(onBoldTrail) {
    if (document.getElementById('listings-map')) return;   // full-screen map search pages have no room for a footer
    if (document.getElementById('clc-contact')) return;    // older homepage code still has its own footer section
    let slot = document.getElementById('clc-site-footer');
    if (!slot && onBoldTrail) {
      const anchor = document.getElementById('custom-footer-wrapper') || document.getElementById('footer');
      if (!anchor) return;
      slot = document.createElement('footer');
      slot.id = 'clc-site-footer';
      anchor.parentNode.insertBefore(slot, anchor);
    }
    if (!slot || slot.dataset.built === 'true') return;
    const year = new Date().getFullYear();
    const cheriEmail = isPh(S.cheriEmail) ? '' : `<p><a href="mailto:${esc(S.cheriEmail)}">${esc(S.cheriEmail)}</a></p>`;
    slot.innerHTML = `
      <div class="clc-wrap">
        <div class="clc-foot-grid">
          <div>
            <div class="clc-foot-brand"><b>Cheri Long <i>Commercial</i></b></div>
            <img class="clc-foot-logo" src="${LOGO_URL_LIGHT}" alt="Royal LePage Commercial, Royal LePage Solutions" width="809" height="324" loading="lazy">
            ${social()}
          </div>
          <div>
            <h4>${esc(S.name || 'Cheri Long')}</h4>
            <p>${esc(S.title || 'Associate Broker')}</p>
            <p>Cell <a class="clc-tel" href="${TEL}">${esc(PHONE)}</a></p>
            ${cheriEmail}
          </div>
          <div>
            <h4>General inquiries</h4>
            <p>${esc(ASSIST.name)}, ${esc(ASSIST.title)}</p>
            <p><a href="mailto:${esc(ASSIST.email)}">${esc(ASSIST.email)}</a></p>
          </div>
          <div>
            <h4>Office</h4>
            <p>${esc(OFFICE.brokerage).replace('\u00ae', '&reg;')}</p>
            <p>${esc(OFFICE.unit)}, ${esc(OFFICE.street)}</p>
            <p>${esc(OFFICE.city)}, ${esc(OFFICE.province)}&nbsp; ${esc(OFFICE.postal)}</p>
            ${S.officePhone ? `<p>Office <a class="clc-tel" href="tel:+1${String(S.officePhone).replace(/[^0-9]/g, '')}">${esc(S.officePhone)}</a></p>` : ''}
          </div>
        </div>
        <div class="clc-legal">
          <p>&copy; ${year} Cheri Long Commercial. Royal LePage&reg; is a registered trademark of Bridgemarq Real Estate Services Inc. Each office is independently owned and operated. Not intended to solicit buyers or sellers currently under contract. See <a href="https://rlp.ca/notices" target="_blank" rel="noopener">rlp.ca/notices</a>.</p>
          <p>We respect your inbox. Marketing emails are sent only with your consent under Canada's Anti-Spam Legislation (CASL), and every message includes an unsubscribe link.</p>
          <p>Listing information is deemed reliable but not guaranteed and should be independently verified.${S.officePhone ? ` Need help using this website? Call our office at ${esc(S.officePhone)}.` : ''}</p>
          <nav aria-label="Legal"><a href="https://www.royallepage.ca/en/realestate/privacy-policy/" target="_blank" rel="noopener">Privacy Policy</a><a href="https://www.royallepage.ca/en/realestate/noticesanddisclaimers" target="_blank" rel="noopener">Notices &amp; Disclaimers</a></nav>
        </div>
      </div>`;
    slot.dataset.built = 'true';
  }

  /* \u2500\u2500\u2500 Lead capture \u2500\u2500\u2500
     PLACEHOLDER until CLC_SITE.leadEndpoint is set: opens the visitor's email app with the
     details filled in, addressed to the assistant, so nothing is lost. With an endpoint set,
     the form POSTs JSON there instead (the Google Apps Script web app that creates the rlpSPHERE lead). */
  function sendLead(data, msgEl, okText) {
    data.source = location.href;
    data.submitted = new Date().toISOString();
    if (S.leadEndpoint) {
      msgEl.textContent = 'Sending\u2026';
      // Sent as text/plain (no Content-Type header) so the Google Apps Script endpoint gets no CORS preflight
      return fetch(S.leadEndpoint, { method: 'POST', body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (res) { if (!res || !res.ok) throw new Error('rejected'); msgEl.textContent = okText; return true; })
        .catch(function () { msgEl.textContent = 'That didn\u2019t go through. Please call ' + PHONE + ' or email ' + ASSIST.email + '.'; return false; });
    }
    const lines = Object.keys(data).filter(function (k) { return data[k] !== '' && data[k] != null && k !== 'type'; })
      .map(function (k) { return k.replace(/_/g, ' ') + ': ' + data[k]; });
    const subject = data.type === 'newsletter' ? 'Newsletter sign-up' : 'Website inquiry' + (data.looking_to ? ': ' + data.looking_to : '') + (data.name ? ' \u2013 ' + data.name : '');
    location.href = 'mailto:' + ASSIST.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
    msgEl.textContent = 'Your email app should open with your details filled in. Just press Send. If it doesn\u2019t, call ' + PHONE + '.';
    return Promise.resolve(true);
  }

  const INTENTS = [['buy', 'Buy a property'], ['sell', 'Sell a property'], ['lease-space', 'Lease space for my business'], ['lease-out', 'Lease out space I own'], ['business-sale', 'Buy or sell a business'], ['other', 'Something else']];
  const TYPES = [['office', 'Office'], ['industrial', 'Industrial'], ['retail', 'Retail'], ['land', 'Land'], ['business', 'Business'], ['other', 'Other']];
  const opts = function (list) { return '<option value="">Choose one</option>' + list.map(function (o) { return '<option value="' + o[0] + '">' + o[1] + '</option>'; }).join(''); };

  let formCount = 0;
  function renderInquiry(slot) {
    if (slot.dataset.built === 'true') return;
    const compact = slot.getAttribute('data-clc-inquiry') === 'compact';
    const n = ++formCount, id = function (k) { return 'clc-q' + n + '-' + k; };
    slot.innerHTML = `
      <form class="clc-inquiry${compact ? ' is-compact' : ''}" novalidate>
        <div class="clc-q-grid">
          <div class="clc-q-field"><label for="${id('name')}">Name <span aria-hidden="true">*</span></label><input id="${id('name')}" name="name" autocomplete="name" required></div>
          <div class="clc-q-field"><label for="${id('email')}">Email <span aria-hidden="true">*</span></label><input id="${id('email')}" name="email" type="email" autocomplete="email" required></div>
          <div class="clc-q-field"><label for="${id('phone')}">Phone</label><input id="${id('phone')}" name="phone" type="tel" autocomplete="tel"></div>
          <div class="clc-q-field"><label for="${id('intent')}">I\u2019m looking to</label><select id="${id('intent')}" name="looking_to" data-q="intent">${opts(INTENTS)}</select></div>
          <div class="clc-q-field"><label for="${id('ptype')}">Property type</label><select id="${id('ptype')}" name="property_type" data-q="ptype">${opts(TYPES)}</select></div>
          ${compact ? '' : `<div class="clc-q-field"><label for="${id('area')}">Area</label><input id="${id('area')}" name="area" placeholder="e.g. NE Calgary, Strathmore"></div>
          <div class="clc-q-field clc-q-wide"><label for="${id('details')}">Size, budget or timeline <span class="clc-q-opt">(optional)</span></label><input id="${id('details')}" name="size_budget_timeline" placeholder="e.g. 2,000\u20133,000 sq ft, by spring"></div>`}
          <div class="clc-q-field clc-q-wide"><label for="${id('msg')}">Message</label><textarea id="${id('msg')}" name="message" rows="${compact ? 3 : 5}"></textarea></div>
        </div>
        <label class="clc-q-check"><input type="checkbox" name="marketing_consent" value="yes"> Yes, also send me Cheri\u2019s Calgary commercial market updates by email. I can unsubscribe at any time.</label>
        <div class="clc-q-actions">
          <button class="clc-q-submit" type="submit">Send to Cheri\u2019s team</button>
          <p class="clc-q-msg" role="status" aria-live="polite"></p>
        </div>
        <p class="clc-q-note">Prefer to talk? Call Cheri at <a href="${TEL}">${esc(PHONE)}</a>.</p>
      </form>`;
    slot.dataset.built = 'true';
    const form = slot.querySelector('form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const msg = form.querySelector('.clc-q-msg');
      const name = form.name.value.trim(), email = form.email.value.trim();
      if (!name || !email || !form.email.checkValidity()) {
        msg.textContent = 'Please add your name and a valid email address.';
        (!name ? form.name : form.email).focus();
        return;
      }
      const data = { type: 'inquiry' };
      new FormData(form).forEach(function (v, k) {
        if (k === 'looking_to' || k === 'property_type') {
          const sel = form.querySelector('[name="' + k + '"]');
          v = sel && sel.value ? sel.options[sel.selectedIndex].text : '';
        }
        data[k] = typeof v === 'string' ? v.trim() : v;
      });
      data.marketing_consent = form.marketing_consent.checked ? 'yes' : 'no';
      sendLead(data, msg, 'Thanks, ' + name + '. Cheri\u2019s team will be in touch shortly.').then(function (ok) { if (ok && S.leadEndpoint) form.reset(); });
    });
  }

  function renderNewsletter(slot) {
    if (slot.dataset.built === 'true') return;
    const n = ++formCount;
    slot.innerHTML = `
      <form class="clc-news-form" novalidate>
        <label class="clc-sr" for="clc-n${n}-email">Email address</label>
        <input id="clc-n${n}-email" name="email" type="email" placeholder="Your email address" autocomplete="email" required>
        <button type="submit">Subscribe</button>
        <label class="clc-news-consent"><input type="checkbox" name="consent" required> I agree to receive Calgary commercial market updates by email from Cheri Long, ${esc(OFFICE.brokerage)}. Unsubscribe at any time.</label>
        <p class="clc-news-msg" role="status" aria-live="polite"></p>
      </form>`;
    slot.dataset.built = 'true';
    const form = slot.querySelector('form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const msg = form.querySelector('.clc-news-msg');
      if (!form.email.value || !form.email.checkValidity()) { msg.textContent = 'Please enter a valid email address.'; form.email.focus(); return; }
      if (!form.consent.checked) { msg.textContent = 'Please tick the box to confirm you\u2019d like to receive emails.'; form.consent.focus(); return; }
      sendLead({ type: 'newsletter', email: form.email.value.trim(), marketing_consent: 'yes' }, msg, 'You\u2019re subscribed. Thank you!')
        .then(function (ok) { if (ok && S.leadEndpoint) form.reset(); });
    });
  }

  /* Service buttons: data-intent="sell" (+ optional data-ptype). On a page with the form they
     preselect + scroll; elsewhere they go to the Contact page as ?intent=sell#inquiry. */
  function setIntent(intent, ptype) {
    document.querySelectorAll('form.clc-inquiry').forEach(function (f) {
      if (intent && f.querySelector('[data-q="intent"] option[value="' + intent + '"]')) f.querySelector('[data-q="intent"]').value = intent;
      if (ptype && f.querySelector('[data-q="ptype"] option[value="' + ptype + '"]')) f.querySelector('[data-q="ptype"]').value = ptype;
    });
  }
  let intentBound = false;
  function bindIntentLinks() {
    document.querySelectorAll('a[data-intent]').forEach(function (a) {
      if (a.dataset.intentSet) return;
      a.dataset.intentSet = '1';
      if (!document.querySelector('form.clc-inquiry')) {
        a.href = PAGES.contact + '?intent=' + encodeURIComponent(a.dataset.intent) + (a.dataset.ptype ? '&type=' + encodeURIComponent(a.dataset.ptype) : '') + '#inquiry';
      }
    });
    if (intentBound) return;
    intentBound = true;
    document.addEventListener('click', function (e) {
      const a = e.target.closest && e.target.closest('a[data-intent]');
      const form = document.querySelector('form.clc-inquiry');
      if (!a || !form) return;
      e.preventDefault();
      setIntent(a.dataset.intent, a.dataset.ptype);
      const box = form.closest('[id]') || form;
      box.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(function () { form.querySelector('[name="name"]').focus({ preventScroll: true }); }, 500);
    });
  }
  let intentApplied = false;
  function applyIntentFromUrl() {
    const p = new URLSearchParams(location.search);
    if (p.get('intent') || p.get('type')) setIntent(p.get('intent'), p.get('type'));
  }

  /* \u2500\u2500\u2500 Property detail pages: hide residential-only fields (commercial listings) \u2500\u2500\u2500 */
  function cleanDetailsPage() {
    const txt = function (el) { return (el.textContent || '').replace(/\s+/g, ' ').trim(); };
    document.querySelectorAll('.details-page li').forEach(function (li) {
      const label = li.querySelector('strong');
      if (!label || !/^(Bedrooms|Bathrooms|Half Bathrooms)$/.test(txt(label))) return;
      const value = txt(li).slice(txt(label).length).trim();
      if (value === '' || value === '0' || value === '{}' || value === '-') li.classList.add('clc-hide');
    });
    document.querySelectorAll('.details-page tr').forEach(function (tr) {
      const th = tr.querySelector('th');
      if (th && /^(jumpId|Property Subtype French|Listing Type French)$/.test(txt(th))) tr.classList.add('clc-hide');
    });
    document.querySelectorAll('.details-page h2').forEach(function (h) {
      if (txt(h) !== 'Amenities') return;
      h.classList.add('clc-hide');
      let n = h.nextElementSibling;
      while (n && n.tagName !== 'H2') { n.classList.add('clc-hide'); n = n.nextElementSibling; }
    });
    document.querySelectorAll('a[href*="/seller/valuation"]').forEach(function (a) {
      (a.closest('li') || a).classList.add('clc-hide');
    });
  }

  function run() {
    ensureInjected();
    setTimeout(ensureInjected, 500);
    setTimeout(ensureInjected, 1500);
    setTimeout(function () { if (document.querySelector('.details-page')) cleanDetailsPage(); }, 4000);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
    window.addEventListener('load', run);
  } else {
    run();
  }
  console.log('[CLC Header] ready - v' + VERSION);
})();
