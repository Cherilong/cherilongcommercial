/**
 * Cheri Long Commercial – website forms → rlpSPHERE (kvCORE Public API v2)
 *
 * Receives the inquiry and newsletter forms built by assets/js/header.js
 * (CLC_SITE.leadEndpoint in assets/js/site-config.js points here).
 *
 * Script Properties (Project Settings → Script Properties):
 *   BT_TOKEN      Cheri's API token (LeadEngine → Lead Dropbox → My API Tokens)   REQUIRED
 *   AGENT_ID      233574  (Cheri's BoldTrail user id)                               REQUIRED
 *   NOTIFY_EMAIL  who gets an email per lead, e.g. cladmin@royallepage.ca           optional
 *
 * Bound to the "Cheri Website Signups" Google Sheet: every submission is logged
 * there first, so nothing is lost if BoldTrail is down.
 *
 * Hashtags added in rlpSPHERE (use them as Smart Campaign "Hashtag is" triggers):
 *   web-lead                   every website submission
 *   web-inquiry                inquiry form
 *   web-newsletter             newsletter form, or inquiry with the market-updates box ticked
 *   checklist-seller-landlord  checklist form (future)
 *   checklist-buyer-tenant     checklist form (future)
 */

var API = 'https://api.kvcore.com/v2/public';

var PDFS = {
  'checklist-seller-landlord': 'https://info.cherilongcommercial.com/assets/pdf/seller-landlord-readiness-checklist.pdf',
  'checklist-buyer-tenant':    'https://info.cherilongcommercial.com/assets/pdf/buyer-tenant-due-diligence-guide.pdf'
};

// "I'm looking to" text from the inquiry form → BoldTrail deal_type
var DEAL_TYPES = {
  'Buy a property': 'buyer',
  'Sell a property': 'seller',
  'Lease space for my business': 'renter',
  'Buy': 'buyer', 'Sell': 'seller', 'Lease': 'renter'
};

function doPost(e) {
  var d;
  try { d = JSON.parse(e.postData.contents); } catch (err) { return out_({ ok: false, error: 'bad request' }); }

  // Honeypot (if a form includes one): silently accept bots
  if (d.company_website) return out_({ ok: true });

  var s = function (k, max) { return String(d[k] == null ? '' : d[k]).trim().slice(0, max || 200); };
  var type = ['inquiry', 'newsletter', 'checklist'].indexOf(d.type) > -1 ? d.type : 'inquiry';
  var email = s('email', 120).toLowerCase();
  var name = s('name', 80) || s('first_name', 60);
  var parts = name.split(/\s+/);
  var first = parts.shift() || '';
  var last = parts.join(' ');
  var marketing = d.marketing_consent === 'yes' || d.consent === true || type === 'newsletter';

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return out_({ ok: false, error: 'invalid email' });
  if (type === 'inquiry' && !name) return out_({ ok: false, error: 'missing name' });

  var tags = ['web-lead'];
  var checklist = '';
  if (type === 'inquiry') tags.push('web-inquiry');
  if (type === 'checklist' && PDFS[d.tag]) { checklist = d.tag; tags.push(checklist); }
  if (marketing) tags.push('web-newsletter');

  var details = [
    'Website ' + type + ' from cherilongcommercial.com',
    s('looking_to') && 'Looking to: ' + s('looking_to'),
    s('property_type') && 'Property type: ' + s('property_type'),
    s('area') && 'Area: ' + s('area'),
    s('size_budget_timeline') && 'Size / budget / timeline: ' + s('size_budget_timeline'),
    s('message', 2000) && 'Message: ' + s('message', 2000),
    s('phone', 30) && 'Phone: ' + s('phone', 30),
    'Email marketing consent: ' + (marketing ? 'YES, given ' + new Date().toISOString() : 'no'),
    'Page: ' + s('source', 300)
  ].filter(Boolean).join('\n');

  var row = logRow_([new Date(), type, name, email, s('phone', 30), s('looking_to'), s('message', 2000), marketing ? 'yes' : 'no', 'pending', '']);

  var status = 'ok', contactId = '';
  try {
    contactId = upsertContact_({
      first: first, last: last, email: email, phone: s('phone', 30),
      dealType: DEAL_TYPES[s('looking_to')] || '', optin: marketing
    });
    addTags_(contactId, tags);
    addNote_(contactId, 'Website ' + type, details);
  } catch (err) {
    status = 'error: ' + err.message;
  }
  updateRow_(row, status, contactId);
  notify_(type, name, email, details, status);

  // The visitor gets a success message even if the CRM step failed: the lead is in the Sheet.
  return out_({ ok: true, download: PDFS[checklist] || null });
}

/* ---------- kvCORE ---------- */

function call_(method, path, body) {
  var opts = {
    method: method,
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + PropertiesService.getScriptProperties().getProperty('BT_TOKEN') },
    muteHttpExceptions: true
  };
  if (body) opts.payload = JSON.stringify(body);
  var res = UrlFetchApp.fetch(API + path, opts);
  var code = res.getResponseCode();
  if (code >= 300) throw new Error(method.toUpperCase() + ' ' + path.split('?')[0] + ' → ' + code + ' ' + res.getContentText().slice(0, 200));
  var txt = res.getContentText();
  try { return txt ? JSON.parse(txt) : {}; } catch (e) { return {}; }
}

function findContactId_(email) {
  var r = call_('get', '/contacts?filter[email]=' + encodeURIComponent(email));
  var list = (r && r.data) || [];
  for (var i = 0; i < list.length; i++) {
    if (String(list[i].email || '').toLowerCase() === email) return list[i].id;
  }
  return null;
}

function upsertContact_(c) {
  var id = findContactId_(c.email);
  if (id) return id; // existing contact: just add tags + note

  var body = {
    first_name: c.first,
    last_name: c.last,
    email: c.email,
    source: 'cherilongcommercial.com',
    capture_method: 'Website Lead Capture',
    status: 0,
    email_optin: c.optin ? 1 : 0,
    assigned_agent_id: PropertiesService.getScriptProperties().getProperty('AGENT_ID')
  };
  var digits = c.phone.replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');
  if (digits.length === 10) body.cell_phone_1 = digits;
  if (c.dealType) body.deal_type = c.dealType;

  var created = call_('post', '/contact', body);
  if (created && created.id) return created.id;

  // The docs show no response body for create, so look the new contact up (retry briefly)
  for (var n = 0; n < 4; n++) {
    Utilities.sleep(1500);
    id = findContactId_(c.email);
    if (id) return id;
  }
  throw new Error('contact created but id not found');
}

function addTags_(id, tags) {
  call_('put', '/contact/' + id + '/tags', { tags: tags.map(function (t) { return { name: t, locked: 0 }; }) });
}

function addNote_(id, title, details) {
  call_('put', '/contact/' + id + '/action/note', { title: title, details: details });
}

/* ---------- Sheet log + notify ---------- */

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName('Signups') || ss.insertSheet('Signups');
  if (sh.getLastRow() === 0) {
    sh.appendRow(['Date', 'Form', 'Name', 'Email', 'Phone', 'Looking to', 'Message', 'Marketing consent', 'CRM status', 'Contact ID']);
    sh.setFrozenRows(1);
  }
  return sh;
}
function logRow_(values) { var sh = sheet_(); sh.appendRow(values); return sh.getLastRow(); }
function updateRow_(row, status, id) { sheet_().getRange(row, 9, 1, 2).setValues([[status, id]]); }

function notify_(type, name, email, details, status) {
  var to = PropertiesService.getScriptProperties().getProperty('NOTIFY_EMAIL');
  if (!to) return;
  MailApp.sendEmail({
    to: to,
    replyTo: email,
    subject: 'New website ' + type + ': ' + (name || email),
    body: 'Name: ' + (name || '—') + '\nEmail: ' + email + '\n\n' + details +
          '\n\nrlpSPHERE: ' + (status === 'ok' ? "added to Cheri's contacts" : status + ' (lead is saved in the Cheri Website Signups sheet)')
  });
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/* ---------- Run once from the editor to check the token (Run → testConnection) ---------- */
function testConnection() {
  var r = call_('get', '/contacts?limit=1');
  Logger.log('Token works. Contacts endpoint returned ' + ((r.data || []).length) + ' row(s).');
}
