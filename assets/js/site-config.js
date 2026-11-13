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
  version: '1012',

  // Main BoldTrail site. Always the www address.
  mainSite: 'https://www.cherilongcommercial.com',
  subSite:  'https://info.cherilongcommercial.com',

  // LISTINGS: every "Listings", "Browse Listings", "View all listings" link uses this.
  // Today: all commercial/land listings in the City of Calgary, newest first.
  // TODO(Kyle): swap in the BoldTrail page that shows Cheri's OWN listings once it exists.
  listingsUrl: 'https://www.cherilongcommercial.com/index.php?advanced=1&rtype=map&display=Calgary&pak=city%3Ag30_c3nfkdtg&types%5B%5D=4&types%5B%5D=5&types%5B%5D=3&types%5B%5D=12&sortby=listings.listingdate+DESC#rslt',

  pages: {
    services: 'https://info.cherilongcommercial.com/services/',
    about:    'https://info.cherilongcommercial.com/about/',
    contact:  'https://info.cherilongcommercial.com/contact/'
  },

  name:   'Cheri Long',
  title:  'Associate Broker',
  phone:  '403-860-9419',                 // Cheri's cell
  cheriEmail: '[CHERI_EMAIL]',            // TODO(Kyle): Cheri's direct email. Hidden until filled in.
  assistant: { name: 'Victoria Stitt', title: 'Assistant', email: 'cladmin@royallepage.ca' },
  officePhone: '403-252-5900',            // brokerage office line (from BoldTrail's own footer)

  // OFFICE ADDRESS. Used by the footer, Contact page, map and links page.
  // TODO(Kyle) CONFIRM POSTAL CODE: BoldTrail's footer says T2X 1J6, Google Maps shows T2X 1M2.
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

  // LEAD CAPTURE: where the inquiry + newsletter forms send data.
  // PLACEHOLDER: no endpoint yet. While this is '', forms open the visitor's email app
  // with everything filled in, addressed to the assistant email above, so no lead is lost.
  // Set to the Google Apps Script Web app URL (ends in /exec) to switch over. It adds the lead to
  // Cheri's rlpSPHERE contacts with hashtags (see apps-script/SETUP.md).
  leadEndpoint: ''
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
      var url = k === 'listings' ? S.listingsUrl : k === 'home' ? S.mainSite + '/' : S.pages[k] || '';
      if (url) a.href = url;
    });
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
