# Cheri signup: Google Apps Script setup (about 15 minutes)

## 1. Create the Sheet and script
1. In Google Drive, create a new Google Sheet named **Cheri Website Signups**. Every signup is logged here as a backup.
2. In the Sheet, open **Extensions → Apps Script**.
3. Delete what's in `Code.gs` and paste in the contents of **Code.gs**. Name the project "Cheri Website Signups" and save.

## 2. Add the settings (the token never goes in code)
In Apps Script, open **Project Settings (gear) → Script Properties → Add script property**:

| Property | Value |
|---|---|
| `BT_TOKEN` | Cheri's API token |
| `AGENT_ID` | `233574` |
| `NOTIFY_EMAIL` | Victoria's email (optional) |

## 3. Test the token
In the editor, pick **testConnection** from the function menu and click **Run**. Approve the Google permissions. The log should say "Token works."

## 4. Deploy
1. Click **Deploy → New deployment → Select type: Web app**.
2. Set **Execute as: Me** and **Who has access: Anyone**.
3. Click **Deploy** and copy the **Web app URL** (it ends in `/exec`).
4. Paste that URL into `signup.js` as `ENDPOINT`.

> After any later code change, use **Deploy → Manage deployments → Edit → New version**. That keeps the same URL.

## 5. Website (cherilongcommercial repo)
- Put `signup.js` in `assets/js/signup.js`.
- Put the two PDFs in `assets/pdf/`:
  - `seller-landlord-readiness-checklist.pdf`
  - `buyer-tenant-due-diligence-guide.pdf`
- Place the forms from `forms.html`: checklists in **Resources & Guides**, and the newsletter form in the header button and footer.
- Commit and push.

## 6. rlpSPHERE Smart Campaigns (after Cheri/Victoria approve the email drafts)
Go to **Marketing → Smart Campaigns → + Add Campaign**. For each campaign, set **Start Campaign When → Hashtag is** to:
- `checklist-seller-landlord`
- `checklist-buyer-tenant`
- `web-newsletter`

The hashtags are created automatically by the first signup. Do one test signup per form before building the campaigns so each hashtag exists to select.

## 7. Test
- [ ] Submit each form with a test email. A row appears in the Sheet with CRM status `ok`.
- [ ] The contact is in **Cheri's** contacts with the hashtags, the `web-lead` tag and a note.
- [ ] Victoria gets the notification email.
- [ ] The campaign starts and email 1 arrives.
- [ ] Submit again with the same email: no duplicate contact.
- [ ] Delete the test contacts.

If the CRM status shows an error, the lead is still in the Sheet. Send me the error text.
