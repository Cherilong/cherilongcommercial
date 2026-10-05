/* =========================================================
   Cheri Long Commercial — header, footer & page behaviour
   VERSION 1001

   Loaded on:
   - Her BoldTrail site (via Custom Body Code)
   - Every custom page on the GitHub Pages subdomain

   What it does:
   1. Inserts the utility bar + flat-nav header at the top of every page
   2. On BoldTrail, hides BoldTrail's own header (CSS in clc.css, keyed off body.has-clc-header)
   3. Keeps the homepage sections (#clc-home) on the BoldTrail homepage only
   4. Adds the contact & legal section on the homepage and on subdomain pages
      (other BoldTrail pages keep BoldTrail's own footer)
   5. Runs listing filters, checklist chooser and form handlers where present
   6. Reveals the page (html.clc-ready) once the header is in place

   Edit CONFIG below for contact details and links. Bump VERSION and the
   ?v= numbers in the BoldTrail fields every time this file changes.
   ========================================================= */
(function () {
  'use strict';

  var VERSION = '1001';

  /* ───────── CONFIG: fill in the {{…}} placeholders ───────── */
  var CONFIG = {
    BOLDTRAIL_BASE: 'https://{{BOLDTRAIL_DOMAIN}}',   // her main BoldTrail site, no trailing slash
    LEAD_ENDPOINT:  '',                               // Cloudflare Worker URL once built; blank = demo mode
    PHONE_CELL:     '403-000-0000',
    PHONE_DIRECT:   '403-000-0000',
    ADMIN_NAME:     'Vic',
    ADMIN_ROLE:     'Administration',
    ADMIN_EMAIL:    'vic@example.ca',
    OFFICE_LINES:   ['Royal LePage® Solutions', 'Street address', 'Calgary, AB  T0T 0T0'],
    SOCIAL: {
      instagram: '#',
      facebook:  '#',
      linkedin:  '#',
      youtube:   '#'      // placeholder until her channel is live
    }
  };
  /* ────────────────────────────────────────────────────────── */

  var esc = function (t) { return String(t).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); };

  /* ---- Markup ---- */
  var SPRITE =
    '<svg width="0" height="0" style="position:absolute" aria-hidden="true">' +
    '<symbol id="clc-ig" viewBox="0 0 24 24"><path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4ZM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4ZM12 2c-2.7 0-3 0-4.1.1C4.3 2.2 2.2 4.3 2.1 7.9 2 9 2 9.3 2 12s0 3 .1 4.1c.1 3.6 2.2 5.7 5.8 5.8 1.1.1 1.4.1 4.1.1s3 0 4.1-.1c3.6-.1 5.7-2.2 5.8-5.8.1-1.1.1-1.4.1-4.1s0-3-.1-4.1c-.1-3.6-2.2-5.7-5.8-5.8C15 2 14.7 2 12 2Zm0 1.8c2.7 0 3 0 4 .1 2.6.1 3.9 1.4 4 4 .1 1 .1 1.3.1 4s0 3-.1 4c-.1 2.6-1.4 3.9-4 4-1 .1-1.3.1-4 .1s-3 0-4-.1c-2.6-.1-3.9-1.4-4-4-.1-1-.1-1.3-.1-4s0-3 .1-4c.1-2.6 1.4-3.9 4-4 1-.1 1.3-.1 4-.1Z"/></symbol>' +
    '<symbol id="clc-fb" viewBox="0 0 24 24"><path d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.5c0-.9.3-1.6 1.6-1.6h1.7V4.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.3v3.2h2.8V22h3.4Z"/></symbol>' +
    '<symbol id="clc-li" viewBox="0 0 24 24"><path d="M6.9 8.8H3.6V20h3.3V8.8ZM5.2 3.5a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8ZM20.4 13.6c0-3-.6-5.1-4.1-5.1-1.7 0-2.8.9-3.2 1.8h-.1V8.8H9.9V20h3.3v-5.5c0-1.5.3-2.9 2.1-2.9s1.8 1.7 1.8 3V20h3.3v-6.4Z"/></symbol>' +
    '<symbol id="clc-yt" viewBox="0 0 24 24"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z"/></symbol>' +
    '</svg>';

  function socialLinks(label) {
    var s = CONFIG.SOCIAL;
    return '<div class="clc-social" aria-label="' + label + '">' +
      '<a href="' + esc(s.instagram) + '" aria-label="Instagram" target="_blank" rel="noopener"><svg><use href="#clc-ig"/></svg></a>' +
      '<a href="' + esc(s.facebook) + '" aria-label="Facebook" target="_blank" rel="noopener"><svg><use href="#clc-fb"/></svg></a>' +
      '<a href="' + esc(s.linkedin) + '" aria-label="LinkedIn" target="_blank" rel="noopener"><svg><use href="#clc-li"/></svg></a>' +
      '<a href="' + esc(s.youtube) + '" aria-label="YouTube (coming soon)" target="_blank" rel="noopener"><svg><use href="#clc-yt"/></svg></a>' +
      '</div>';
  }

  function brand() {
    return '<b>Cheri Long <i>Commercial</i></b><span>Royal LePage® Commercial</span>';
  }

  function topbarHTML() {
    return '<div class="clc-util"><div class="clc-wrap">' + socialLinks('Social media') +
      '<div class="clc-util-right"><a data-sec="clc-newsletter" href="#">Newsletter sign-up</a>' +
      '<span>Call Cheri <span class="clc-tel">' + esc(CONFIG.PHONE_CELL) + '</span></span></div>' +
      '</div></div>';
  }

  function headerHTML() {
    return '<header class="clc-head">' +
      '<div class="clc-wrap clc-head-top">' +
        '<a class="clc-brand" data-home href="#" aria-label="Cheri Long Commercial home">' + brand() + '</a>' +
        '<a class="clc-btn clc-btn-red" data-sec="clc-contact" href="#">Talk to Our Team</a>' +
      '</div>' +
      '<nav class="clc-nav" aria-label="Main"><div class="clc-wrap"><ul>' +
        '<li><a data-home href="#">Home</a></li>' +
        '<li><a data-sec="clc-listings" href="#">Listings</a></li>' +
        '<li><a data-sec="clc-services" href="#">Services</a></li>' +
        '<li><a data-sec="clc-team" href="#">About Cheri &amp; Team</a></li>' +
        '<li><a data-sec="clc-guides" href="#">Resources &amp; Guides</a></li>' +
        '<li><a data-sec="clc-contact" href="#">Contact</a></li>' +
      '</ul></div></nav>' +
      '</header>';
  }

  function footerHTML() {
    var year = new Date().getFullYear();
    return '<footer class="clc-foot" id="clc-contact"><div class="clc-wrap"><div class="clc-foot-grid">' +
        '<div><div class="clc-brand">' + brand() + '</div>' + socialLinks('Social media') + '</div>' +
        '<div><h4>Cheri Long</h4><p>Cell <span class="clc-tel">' + esc(CONFIG.PHONE_CELL) + '</span></p><p>Direct <span class="clc-tel">' + esc(CONFIG.PHONE_DIRECT) + '</span></p></div>' +
        '<div><h4>General inquiries</h4><p>' + esc(CONFIG.ADMIN_NAME) + ', ' + esc(CONFIG.ADMIN_ROLE) + '</p><p>' + esc(CONFIG.ADMIN_EMAIL) + '</p></div>' +
        '<div><h4>Office</h4>' + CONFIG.OFFICE_LINES.map(function (l) { return '<p>' + esc(l) + '</p>'; }).join('') + '</div>' +
      '</div><div class="clc-legal">' +
        '<p>© ' + year + ' Cheri Long Commercial. Royal LePage® is a registered trademark of Bridgemarq Real Estate Services Inc. Each office is independently owned and operated. Not intended to solicit buyers or sellers currently under contract. See rlp.ca/notices.</p>' +
        '<p>We respect your inbox. Emails are sent only with your consent under Canada’s Anti-Spam Legislation (CASL), and every message includes an unsubscribe link.</p>' +
        '<p>Listing information is deemed reliable but not guaranteed and should be independently verified.</p>' +
        '<nav aria-label="Legal"><a href="#">Privacy Policy</a><a href="#">Terms of Use</a><a href="#">Accessibility</a></nav>' +
      '</div></div></footer>';
  }

  /* ---- Page detection ---- */
  function onBoldTrail() { return !!document.querySelector('#header, .kv-header, .site-header'); }
  function isRootPath() {
    var p = location.pathname.replace(/\/+$/, '');
    return (p === '' || p === '/index.php' || p === '/index.html') && !location.search;
  }

  /* ---- Build ---- */
  function build() {
    var body = document.body;
    var bt = onBoldTrail();
    var home = document.getElementById('clc-home');

    // 1. Homepage sections: BoldTrail homepage only
    if (home && bt && !isRootPath()) { home.remove(); home = null; }

    // 2. Sprite, top bar, header (once)
    if (!document.getElementById('clc-header')) {
      body.insertAdjacentHTML('afterbegin',
        SPRITE +
        '<div class="clc" id="clc-topbar">' + topbarHTML() + '</div>' +
        '<div class="clc" id="clc-header">' + headerHTML() + '</div>');
    }
    var header = document.getElementById('clc-header');

    // Homepage content sits directly under the header, outside BoldTrail's containers
    if (home && home.previousElementSibling !== header) header.insertAdjacentElement('afterend', home);
    if (home) body.classList.add('clc-is-home');

    // 3. Contact & legal section: homepage + non-BoldTrail pages
    if (!document.getElementById('clc-contact') && (home || !bt)) {
      var wrap = document.createElement('div');
      wrap.innerHTML = footerHTML();
      var foot = wrap.firstElementChild;
      if (home) { home.appendChild(foot); }
      else {
        var holder = document.createElement('div');
        holder.className = 'clc';
        holder.appendChild(foot);
        body.appendChild(holder);
      }
    }

    // 4. Links: in-page anchor when the section is here, otherwise the BoldTrail homepage
    document.querySelectorAll('#clc-topbar a[data-sec], #clc-header a[data-sec]').forEach(function (a) {
      var id = a.getAttribute('data-sec');
      a.setAttribute('href', document.getElementById(id) ? '#' + id : CONFIG.BOLDTRAIL_BASE + '/#' + id);
    });
    document.querySelectorAll('#clc-header a[data-home]').forEach(function (a) {
      a.setAttribute('href', home ? '#' : CONFIG.BOLDTRAIL_BASE + '/');
    });
    var homeLink = document.querySelector('#clc-header nav a[data-home]');
    if (homeLink) { home ? homeLink.setAttribute('aria-current', 'page') : homeLink.removeAttribute('aria-current'); }

    // 5. Hide BoldTrail header (CSS) and reveal page
    body.classList.add('has-clc-header');
    requestAnimationFrame(function () { document.documentElement.classList.add('clc-ready'); });
  }

  /* ---- Interactions (each runs only if its section exists) ---- */
  function bindListings() {
    var tabs = document.querySelectorAll('.clc-tab');
    if (!tabs.length || tabs[0].dataset.clcBound) return;
    var cards = document.querySelectorAll('.clc-card'), empty = document.getElementById('clc-empty');
    tabs.forEach(function (t) {
      t.dataset.clcBound = '1';
      t.addEventListener('click', function () {
        var f = t.getAttribute('data-f'), shown = 0;
        tabs.forEach(function (x) { x.setAttribute('aria-pressed', x === t ? 'true' : 'false'); });
        cards.forEach(function (c) {
          var ok = f === 'all' || (' ' + c.getAttribute('data-tags') + ' ').indexOf(' ' + f + ' ') > -1;
          c.hidden = !ok; if (ok) shown++;
        });
        if (empty) empty.hidden = shown > 0;
      });
    });
  }

  function bindGuides() {
    var guides = document.querySelectorAll('.clc-guide'), input = document.getElementById('clc-guide');
    if (!guides.length || !input || guides[0].dataset.clcBound) return;
    guides.forEach(function (g) {
      g.dataset.clcBound = '1';
      g.addEventListener('click', function () {
        guides.forEach(function (x) { x.setAttribute('aria-pressed', x === g ? 'true' : 'false'); });
        input.value = g.getAttribute('data-g');
        var f = document.getElementById('clc-fname'); if (f) f.focus();
      });
    });
  }

  function send(data, msgEl, okText) {
    if (!CONFIG.LEAD_ENDPOINT) { msgEl.textContent = okText + ' (Demo: form not connected yet.)'; return Promise.resolve(); }
    data.source = location.href;
    return fetch(CONFIG.LEAD_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      .then(function (r) { if (!r.ok) throw new Error(r.status); msgEl.textContent = okText; })
      .catch(function () { msgEl.textContent = 'That didn’t go through. Please try again, or call ' + CONFIG.PHONE_CELL + '.'; throw new Error('send failed'); });
  }

  function bindForms() {
    var mag = document.getElementById('clc-mag-form');
    if (mag && !mag.dataset.clcBound) {
      mag.dataset.clcBound = '1';
      mag.addEventListener('submit', function (e) {
        e.preventDefault();
        var f = e.target, msg = document.getElementById('clc-mag-msg');
        if (!f.first_name.value.trim() || !f.email.value || !f.email.checkValidity() || !f.intent.value) {
          msg.textContent = 'Please fill in your first name, a valid email and what you’re looking to do.'; return;
        }
        send({ type: 'checklist', guide: f.guide.value, first_name: f.first_name.value.trim(), email: f.email.value, intent: f.intent.value, newsletter: f.newsletter.checked },
          msg, 'Thanks, ' + f.first_name.value.trim() + '. Check your inbox for the ' + f.guide.value + '.')
          .then(function () { var g = f.guide.value; f.reset(); f.guide.value = g; }, function () {});
      });
    }
    var news = document.getElementById('clc-news-form');
    if (news && !news.dataset.clcBound) {
      news.dataset.clcBound = '1';
      news.addEventListener('submit', function (e) {
        e.preventDefault();
        var input = document.getElementById('clc-nemail'), msg = document.getElementById('clc-news-msg');
        if (!input.value || !input.checkValidity()) { msg.textContent = 'Please enter a valid email address.'; return; }
        send({ type: 'newsletter', email: input.value }, msg, 'You’re subscribed.').then(function () { input.value = ''; }, function () {});
      });
    }
  }

  function run() {
    build(); bindListings(); bindGuides(); bindForms();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
  // BoldTrail sometimes re-renders its header late; re-check once the page has fully loaded
  window.addEventListener('load', run);

  window.CLC = { version: VERSION, rebuild: run };
  console.log('[CLC] clc.js v' + VERSION);
})();
