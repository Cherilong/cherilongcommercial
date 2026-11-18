/* =========================================================
   Cheri Long Commercial - SITE CONFIG (single source of truth)
   Loaded FIRST on every page: BoldTrail (Custom Header Code) and
   every info.cherilongcommercial.com page. header.js, the homepage
   code and the subdomain pages all read from window.CLC_SITE.

   Change a value here once and it updates everywhere.
   Values in [SQUARE_BRACKETS] are placeholders: anything still
   showing a placeholder is hidden on the live site, never shown.
   ========================================================= */
window.CLC_SITE = {
  version: '1028',

  // Main BoldTrail site. Always the www address.
  mainSite: 'https://www.cherilongcommercial.com',
  subSite:  'https://info.cherilongcommercial.com',

  // ALL LISTINGS: "Listings" (menu), "Browse Listings" and "Search all listings" use this.
  // All commercial/land listings in the City of Calgary, newest first.
  listingsUrl: 'https://www.cherilongcommercial.com/index.php?advanced=1&rtype=map&display=Calgary&pak=city%3Ag30_c3nfkdtg&types%5B%5D=4&types%5B%5D=5&types%5B%5D=3&types%5B%5D=12&sortby=listings.listingdate+DESC#rslt',

  // CHERI'S LISTINGS: BoldTrail's built-in "My Listings" search (her Agent MLS ID), shown on the map.
  // Used by the homepage "Cheri's listings on the map" button.
  myListingsUrl: 'https://www.cherilongcommercial.com/index.php?showagent=1&rtype=map#rslt',

  pages: {
    services: 'https://info.cherilongcommercial.com/services/',
    about:    'https://info.cherilongcommercial.com/about/',
    contact:  'https://info.cherilongcommercial.com/contact/'
  },

  name:   'Cheri Long',
  // Cheri's photo: her current BoldTrail profile picture. BoldTrail gives every NEW upload a new
  // file name, so when she changes her photo: right-click it on her BoldTrail profile ->
  // Copy image address -> paste it here, commit and push. Nothing else needs changing.
  photo:  'https://dtzulyujzhqiu.cloudfront.net/royallepagesolutions2034/profiles/1794930163.jpg',
  title:  'Associate Broker',
  phone:  '403-860-9419',                 // Cheri's cell
  cheriEmail: 'clong@royallepagecommercial.com',   // Cheri's direct email
  assistant: { name: 'Victoria Stitt', title: 'Assistant', email: 'cladmin@royallepage.ca' },
  officePhone: '403-252-5900',            // brokerage office line (from BoldTrail's own footer)

  // OFFICE ADDRESS. Used by the footer, Contact page, map and links page.
  // Postal code confirmed by Kyle (Nov 17 2026): T2X 1J6
  office: {
    brokerage: 'Royal LePage\u00ae Solutions',
    unit: 'Unit 205',
    street: '264 Midpark Way SE',
    city: 'Calgary', province: 'AB',
    postal: 'T2X 1J6'
  },

  social: {
    instagram: 'https://www.instagram.com/cherilongcommercial/',
    facebook:  'https://www.facebook.com/CheriLongCommercialBroker',
    linkedin:  'https://www.linkedin.com/in/cheri-long-8646439/',
    youtube:   ''                          // add when her channel exists ('' hides the icon)
  },

  // LEAD CAPTURE: where the inquiry, newsletter and checklist forms send data.
  // The Google Apps Script web app "CLC Website Leads" (apps-script/Code.gs). It creates the
  // contact in Cheri's BoldTrail, adds hashtags from the answers (they start her Smart
  // Campaigns) and emails Victoria a backup copy. See apps-script/SETUP.md.
  // Set to '' to fall back to opening the visitor's email app addressed to the assistant.
  leadEndpoint: 'https://script.google.com/macros/s/AKfycbzarLrwie3DPobnmxEu-uV52RfCUQtnM9Ky85GnBy_DbktUB0Nv-DMr8tW9mktX8KhR/exec'
};

/* ---- helpers (no need to edit below) ---- */
(function (S) {
  S.isPlaceholder = function (v) { return !v || /^\s*\[.*\]\s*$/.test(String(v)); };
  S.tel = function (p) { return 'tel:+1' + String(p || S.phone).replace(/[^0-9]/g, ''); };
  S.officeLine = function () { var o = S.office; return o.unit + ', ' + o.street + ', ' + o.city + ', ' + o.province + ' ' + o.postal; };
  S.mapQuery = function () { var o = S.office; return encodeURIComponent(o.street + ', ' + o.city + ', ' + o.province + ' ' + o.postal); };
  // Preview mode shows hidden placeholder sections (add #clc-preview to the address, or ?preview=1 on subdomain pages)
  S.preview = /clc-preview/.test(location.hash) || /[?&]preview=1/.test(location.search);
  if (S.preview) document.documentElement.classList.add('clc-preview');

  // Fill any element marked data-clc="key" from this config (static text stays as the fallback)
  S.fill = function (root) {
    root = root || document;
    var map = {
      phone: S.phone, officePhone: S.officePhone, assistantName: S.assistant.name,
      assistantEmail: S.assistant.email, cheriEmail: S.cheriEmail,
      brokerage: S.office.brokerage, officeUnitStreet: S.office.unit + ', ' + S.office.street,
      officeCity: S.office.city + ', ' + S.office.province + '\u00a0 ' + S.office.postal,
      officeLine: S.officeLine()
    };
    root.querySelectorAll('[data-clc]').forEach(function (el) {
      var k = el.getAttribute('data-clc'), v = map[k];
      if (v === undefined) return;
      if (S.isPlaceholder(v)) { el.hidden = true; var wrap = el.closest('[data-clc-wrap]'); if (wrap) wrap.hidden = true; return; }
      el.textContent = v;
      if (el.tagName === 'A') {
        if (/phone/i.test(k)) el.href = S.tel(v);
        else if (/email/i.test(k)) el.href = 'mailto:' + v;
      }
    });
    root.querySelectorAll('a[data-clc-link]').forEach(function (a) {
      var k = a.getAttribute('data-clc-link');
      var url = k === 'listings' ? S.listingsUrl : k === 'myListings' ? S.myListingsUrl : k === 'home' ? S.mainSite + '/' : S.pages[k] || '';
      if (url) a.href = url;
    });
    // Cheri's photo: always the current BoldTrail profile picture, re-checked daily
    if (S.photo) {
      var day = new Date().toISOString().slice(0, 10).replace(/-/g, '');   // e.g. 20261117
      root.querySelectorAll('img[data-clc-photo]').forEach(function (img) {
        var want = S.photo + (S.photo.indexOf('?') > -1 ? '&' : '?') + 'd=' + day;
        if (img.getAttribute('src') !== want) img.setAttribute('src', want);
      });
    }
    root.querySelectorAll('iframe[data-clc-map]').forEach(function (f) {
      f.src = 'https://www.google.com/maps?q=' + S.mapQuery() + '&output=embed';
    });
    root.querySelectorAll('a[data-clc-directions]').forEach(function (a) {
      a.href = 'https://www.google.com/maps/dir/?api=1&destination=' + S.mapQuery();
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { S.fill(); });
  else S.fill();
})(window.CLC_SITE);
