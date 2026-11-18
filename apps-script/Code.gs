/* =========================================================
   Cheri Long Commercial — Website leads → BoldTrail (rlpSPHERE)
   Google Apps Script web app. Receives the inquiry, newsletter and
   checklist forms from header.js, then:
     1. creates (or finds) the contact in Cheri's BoldTrail
     2. adds hashtags built from the form answers  →  each hashtag can
        start a BoldTrail Smart Campaign ("Hashtag is ..." trigger)
     3. adds a note with everything the visitor typed
     4. emails a backup copy of every lead to NOTIFY_EMAIL, so a lead is
        never lost even if BoldTrail is down or the token expires.

   SETUP (once):
     Project Settings → Script properties → add
       BOLDTRAIL_TOKEN = Cheri's API token (Lead Engine → Lead Dropbox →
                         My API Tokens → tick Contacts → Generate)
     Deploy → New deployment → Web app → Execute as: Me,
       Who has access: Anyone → copy the /exec URL into
       site-config.js → leadEndpoint.
     Run testBoldTrail() once from the editor to confirm the token works.
   ========================================================= */

const CONFIG = {
  API: 'https://api.kvcore.com/v2/public',
  SOURCE: 'Cheri Long Commercial Website',
  NOTIFY_EMAIL: 'cladmin@royallepage.ca',   // Victoria. Add more with commas.
  LOG_SHEET_ID: ''                           // optional: a Google Sheet ID to log every lead
};

/* ─── HASHTAG MAP ───────────────────────────────────────────────
   Lower-case letters and numbers only (BoldTrail strips other characters).
   Build one Smart Campaign per "trigger" hashtag in BoldTrail:
     Marketing → Smart Campaigns → Campaign Logic → Hashtag is <tag>.
   The other hashtags are for filtering and mass emails only. */
const TAGS = {
  site: 'clcwebsite',                       // every lead from the site
  form: {                                   // which form they used
    inquiry: 'clcinquiry',
    newsletter: 'clcnewsletter',            // TRIGGER: newsletter welcome
    guide: 'clcguide'
  },
  intent: {                                 // "I'm looking to"  (TRIGGERS on inquiries)
    'buy': 'clcbuy',
    'sell': 'clcsell',
    'lease-space': 'clcleasespace',         // tenant
    'lease-out': 'clcleaseout',             // landlord
    'business-sale': 'clcbusiness',
    'other': 'clcother'
  },
  ptype: {                                  // "Property type" (filtering only)
    'office': 'clcoffice',
    'industrial': 'clcindustrial',
    'retail': 'clcretail',
    'land': 'clcland',
    'business': 'clcbusinessproperty'
  },
  guide: {                                  // TRIGGERS: checklist delivery (set to Always Run)
    'seller': 'clcguideseller',             // Seller & Landlord Readiness Checklist
    'buyer': 'clcguidebuyer'                // Buyer & Tenant Due Diligence Guide
  },
  optin: 'clcoptin'                         // ticked the CASL consent box → OK for mass email
};

// Which checklist a "looking to" answer gets on the checklist form
const GUIDE_FOR_INTENT = { 'buy': 'buyer', 'lease-space': 'buyer', 'sell': 'seller', 'lease-out': 'seller' };

/* ─── WEB APP ENTRY ─────────────────────────────────────────── */
function doPost(e) {
  let data = {};
  try { data = JSON.parse((e && e.postData && e.postData.contents) || '{}'); }
  catch (err) { return json({ ok: false, error: 'bad request' }); }

  // Spam trap: real visitors never fill the hidden "website" field
  if (data.website) return json({ ok: true });

  const email = String(data.email || '').trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ ok: false, error: 'email' });
  data.email = email;

  const lead = buildLead(data);
  let crm = { ok: false, error: 'not attempted' };
  try { crm = sendToBoldTrail(lead); }
  catch (err) { crm = { ok: false, error: String(err && err.message || err) }; }

  try { notify(lead, crm); } catch (err) { console.error('notify failed', err); }
  try { logRow(lead, crm); } catch (err) { console.error('log failed', err); }

  // The visitor always sees success once we have the lead (backup email covers a BoldTrail failure)
  return json({ ok: true });
}

function doGet() { return json({ ok: true, service: 'clc-leads' }); }

/* ─── FORM ANSWERS → CONTACT + HASHTAGS (pure, testable) ─────── */
function buildLead(d) {
  const type = TAGS.form[d.type] ? d.type : 'inquiry';
  const name = splitName(d.first_name ? (d.first_name + ' ' + (d.last_name || '')) : (d.name || ''));
  const consent = d.marketing_consent === 'yes';
  const tags = [TAGS.site, TAGS.form[type]];

  if (type === 'inquiry') {
    // Exactly one intent hashtag per inquiry, so exactly one inquiry campaign starts
    tags.push(TAGS.intent[d.intent] || TAGS.intent.other);
    if (TAGS.ptype[d.ptype]) tags.push(TAGS.ptype[d.ptype]);
  }
  if (type === 'guide') {
    const g = TAGS.guide[d.guide] ? d.guide : GUIDE_FOR_INTENT[d.intent];
    if (g) tags.push(TAGS.guide[g]);
  }
  if (consent) tags.push(TAGS.optin);

  const labels = {
    looking_to: 'Looking to', property_type: 'Property type', area: 'Area',
    size_budget_timeline: 'Size / budget / timeline', message: 'Message', guide_title: 'Checklist requested'
  };
  const lines = ['Website ' + (type === 'guide' ? 'checklist download' : type) + ' — ' + CONFIG.SOURCE];
  Object.keys(labels).forEach(function (k) { if (d[k]) lines.push(labels[k] + ': ' + d[k]); });
  lines.push('Email updates consent (CASL): ' + (consent ? 'YES' : 'no'));
  if (d.source) lines.push('Page: ' + d.source);

  return {
    type: type,
    first_name: name.first,
    last_name: name.last,
    email: d.email,
    phone: String(d.phone || '').replace(/[^0-9+]/g, ''),
    tags: tags.filter(function (t, i, a) { return t && a.indexOf(t) === i; }),
    note: lines.join('\n'),
    consent: consent
  };
}

function splitName(full) {
  const parts = String(full).trim().split(/\s+/).filter(String);
  if (!parts.length) return { first: 'Website', last: 'Lead' };
  return { first: parts[0], last: parts.slice(1).join(' ') };
}

/* ─── BOLDTRAIL (kvCORE Public API v2) ──────────────────────────
   Endpoints per apidocs.kvcore.com → Contact Management. If BoldTrail
   changes a field name, only this section needs editing. */
function sendToBoldTrail(lead) {
  let id = findContactId(lead.email);
  const isNew = !id;
  if (isNew) {
    const body = {
      first_name: lead.first_name,
      last_name: lead.last_name,
      email: lead.email,
      source: CONFIG.SOURCE,
      status: 0                               // 0 = New Lead
    };
    if (lead.phone) body.cell_phone_1 = lead.phone;
    const res = api('post', '/contact', body);
    id = res && (res.id || (res.data && res.data.id) || res.contact_id);
    if (!id) throw new Error('No contact id returned: ' + JSON.stringify(res).slice(0, 300));
  }
  api('put', '/contact/' + id + '/tags', { tags: lead.tags.map(function (t) { return { name: t }; }) });

  // The note is a nice-to-have: if it fails, the contact and hashtags (which start the campaigns) still count
  let noteError = '';
  try { addNote(id, lead.note); }
  catch (err) { noteError = String(err && err.message || err); console.warn('Note failed', noteError); }
  return { ok: true, id: id, isNew: isNew, noteError: noteError };
}

// BoldTrail's note route only accepts PUT. The text is sent under both common field names.
function addNote(id, text) {
  return api('put', '/contact/' + id + '/action/note', { note: text, details: text });
}

function findContactId(email) {
  try {
    const res = api('get', '/contacts?filter[email]=' + encodeURIComponent(email));
    const list = (res && (res.data || res.contacts)) || [];
    const hit = list.filter(function (c) { return String(c.email || '').toLowerCase() === email; })[0];
    return hit ? hit.id : null;
  } catch (err) {
    console.warn('Contact search failed, will create a new contact', err);
    return null;
  }
}

function api(method, path, body) {
  const token = PropertiesService.getScriptProperties().getProperty('BOLDTRAIL_TOKEN');
  if (!token) throw new Error('BOLDTRAIL_TOKEN script property is missing');
  const opts = {
    method: method,
    muteHttpExceptions: true,
    headers: { Authorization: 'Bearer ' + token, Accept: 'application/json' }
  };
  if (body) { opts.contentType = 'application/json'; opts.payload = JSON.stringify(body); }
  const r = UrlFetchApp.fetch(CONFIG.API + path, opts);
  const code = r.getResponseCode(), text = r.getContentText();
  if (code >= 300) throw new Error(method.toUpperCase() + ' ' + path + ' → ' + code + ' ' + text.slice(0, 300));
  try { return text ? JSON.parse(text) : {}; } catch (e) { return {}; }
}

/* ─── BACKUP EMAIL + OPTIONAL SHEET LOG ─────────────────────── */
function notify(lead, crm) {
  if (!CONFIG.NOTIFY_EMAIL) return;
  const flag = crm.ok ? '' : '⚠ NOT IN BOLDTRAIL — ';
  const who = (lead.first_name + ' ' + lead.last_name).trim();
  MailApp.sendEmail({
    to: CONFIG.NOTIFY_EMAIL,
    replyTo: lead.email,
    subject: flag + 'New website ' + (lead.type === 'guide' ? 'checklist download' : lead.type) + ': ' + who,
    body: [
      'Name: ' + who, 'Email: ' + lead.email, 'Phone: ' + (lead.phone || '—'), '',
      lead.note, '',
      'Hashtags: #' + lead.tags.join(' #'),
      'BoldTrail: ' + (crm.ok ? (crm.isNew ? 'new contact ' : 'existing contact ') + crm.id : 'FAILED — ' + crm.error + '\nAdd this contact by hand with the hashtags above.'),
      crm.ok && crm.noteError ? 'Note was NOT added to the contact (' + crm.noteError + '). The details are above.' : ''
    ].join('\n')
  });
}

function logRow(lead, crm) {
  if (!CONFIG.LOG_SHEET_ID) return;
  SpreadsheetApp.openById(CONFIG.LOG_SHEET_ID).getSheets()[0].appendRow([
    new Date(), lead.type, lead.first_name, lead.last_name, lead.email, lead.phone,
    lead.tags.join(' '), lead.consent ? 'yes' : 'no', crm.ok ? crm.id : 'FAILED: ' + crm.error
  ]);
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/* ─── TESTS: run from the editor ────────────────────────────── */
// 1) Token check: lists one contact. Run this first.
function testBoldTrail() {
  const res = api('get', '/contacts?limit=1');
  console.log('Token works. Sample response:', JSON.stringify(res).slice(0, 500));
}
// 2) Full test lead (creates or updates a real contact — delete it after). Logs the result.
function testLead() {
  const fake = { postData: { contents: JSON.stringify({
    type: 'inquiry', name: 'Test Lead', email: 'kyleduiker+clctest@royallepage.ca',
    intent: 'sell', looking_to: 'Sell a property', ptype: 'industrial', property_type: 'Industrial',
    message: 'Test from Apps Script', marketing_consent: 'yes', source: 'apps-script-test'
  }) } };
  const lead = buildLead(JSON.parse(fake.postData.contents));
  const crm = sendToBoldTrail(lead);
  console.log('Result:', JSON.stringify(crm));
  console.log('Hashtags:', lead.tags.join(' '));
}
// 3) Note check on an existing contact. Put the contact number from its BoldTrail address (…/contacts/68108).
function testNote() {
  const CONTACT_ID = 68108;
  try {
    console.log('Note OK:', JSON.stringify(addNote(CONTACT_ID, 'Test note from Apps Script ' + new Date().toLocaleString())));
  } catch (err) {
    console.log('Note FAILED:', err.message);
  }
}
