# Cheri website forms → rlpSPHERE (Google Apps Script)

The site's **inquiry** and **newsletter** forms (built by `assets/js/header.js`) send to the address in
`CLC_SITE.leadEndpoint` (`assets/js/site-config.js`). While it's empty, the forms open the visitor's
email app instead. Once the Apps Script URL is pasted in, every submission is:

1. logged in the **Cheri Website Signups** Google Sheet (backup)
2. added to **Cheri's** rlpSPHERE contacts, assigned to her (user 233574), or matched to an existing contact by email
3. tagged `web-lead`, plus `web-inquiry` and/or `web-newsletter`, with a note holding the form details and consent
4. emailed to the notify address (Victoria)

## 1. Create the Sheet and script (about 10 minutes)
1. In Google Drive, create a new Google Sheet named **Cheri Website Signups**.
2. Open **Extensions → Apps Script**. Replace everything in `Code.gs` with this folder's `Code.gs`, then save.

## 2. Script Properties (the token never goes in code)
Go to **Project Settings (gear) → Script Properties → Add script property**:

| Property | Value |
|---|---|
| `BT_TOKEN` | Cheri's API token |
| `AGENT_ID` | `233574` |
| `NOTIFY_EMAIL` | `cladmin@royallepage.ca` (Victoria) |

## 3. Test the token
Pick **testConnection** in the function menu and click **Run**. Approve the Google permissions. The log should say "Token works."

## 4. Deploy
1. Click **Deploy → New deployment → Web app**.
2. Set **Execute as: Me** and **Who has access: Anyone**.
3. Click **Deploy** and copy the **Web app URL** (it ends in `/exec`).

> After any later code change, use **Deploy → Manage deployments → Edit → Version: New version**. That keeps the same URL.

## 5. Switch the site over
In `assets/js/site-config.js`, set:
```js
leadEndpoint: 'https://script.google.com/macros/s/XXXX/exec'
```
Commit and push. No BoldTrail re-paste is needed, because the site loads `site-config.js` from GitHub.
GitHub Pages can cache for up to 10 minutes.

## 6. Test
- [ ] Contact page inquiry with a test email: a row appears in the Sheet with CRM status `ok`.
- [ ] The contact is in **Cheri's** contacts with `web-lead` and `web-inquiry`, and a note with the details.
- [ ] Newsletter form: the contact gets `web-newsletter`.
- [ ] The same email again: no duplicate contact.
- [ ] Victoria receives the notification.
- [ ] Delete the test contacts.

## 7. Smart Campaigns (after Cheri/Victoria approve the drafts)
Go to **Marketing → Smart Campaigns → + Add Campaign** and set **Start Campaign When → Hashtag is**:
- `web-newsletter`: newsletter welcome
- `web-inquiry`: optional "thanks, we'll be in touch" plus follow-up

Checklist campaigns come later, once the PDFs exist. The script already supports `type: 'checklist'` with
`tag: 'checklist-seller-landlord' | 'checklist-buyer-tenant'`.

If the CRM status shows an error, the lead is still in the Sheet. Send me the error text.
