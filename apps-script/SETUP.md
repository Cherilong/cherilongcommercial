# Cheri's website leads → BoldTrail + Smart Campaigns

**How it works:** a visitor submits a form → `header.js` sends the answers to a Google Apps Script → the script creates the contact in **Cheri's** BoldTrail (source "Cheri Long Commercial Website", status New Lead), adds hashtags based on the answers, adds a note with everything they typed, and emails Victoria a backup copy. In BoldTrail, each **trigger hashtag** starts its own Smart Campaign.

Cost: $0 (Google Apps Script + BoldTrail API, both free).

---

## 1. Get Cheri's API token (in Cheri's BoldTrail login)

Lead Engine → Lead Dropbox → scroll to **My API Tokens** → tick **Contacts** → **Generate** → copy it.

- It must be generated in **Cheri's own** account. A token from your login or the office puts her leads in your database or the office rotation.
- Each account can have only 3 tokens.

## 2. Create the Apps Script (in the Google account that should own it)

1. Go to script.google.com → **New project** → name it `CLC Website Leads`.
2. Paste `Code.gs` over the default code. Check `NOTIFY_EMAIL` (Victoria by default).
3. **Project Settings** (gear icon) → **Script properties** → Add: `BOLDTRAIL_TOKEN` = the token from step 1.
4. Run **`testBoldTrail`** (choose it in the function dropdown → Run). Approve the permissions. The log should say "Token works".
5. Run **`testLead`**. Check Cheri's BoldTrail: a "Test Lead" contact should appear with the hashtags `#clcwebsite #clcinquiry #clcsell #clcindustrial #clcoptin` and a note. Delete it afterwards.
   - If the contact appears but hashtags or the note are missing, the API field names changed: tell me the error from the Execution log and I'll adjust `sendToBoldTrail()`.
6. **Deploy → New deployment** → type **Web app** → Execute as **Me** → Who has access **Anyone** → Deploy → copy the URL ending in `/exec`.
7. Paste that URL into `site-config.js` → `leadEndpoint`, push to GitHub, bump `?v=1013` in both BoldTrail Custom Code fields.

> After any later change to Code.gs: **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy.** That keeps the same /exec URL.

## 3. Hashtags the script adds

| Form answer | Hashtag | Starts a campaign? |
|---|---|---|
| Every website lead | `clcwebsite` | No (filter) |
| Inquiry form | `clcinquiry` | No (filter) |
| Looking to: Buy a property | `clcbuy` | **Yes** |
| Looking to: Sell a property | `clcsell` | **Yes** |
| Looking to: Lease space for my business | `clcleasespace` | **Yes** |
| Looking to: Lease out space I own | `clcleaseout` | **Yes** |
| Looking to: Buy or sell a business | `clcbusiness` | **Yes** |
| Looking to: Something else / left blank | `clcother` | **Yes** |
| Property type: Office / Industrial / Retail / Land / Business | `clcoffice` `clcindustrial` `clcretail` `clcland` `clcbusinessproperty` | No (filter) |
| Newsletter form | `clcnewsletter` | **Yes** |
| Checklist requested (the "Free checklist" field on the inquiry form, or the old checklist form) | `clcguide` | No (filter) |
| Free checklist: Seller & Landlord Readiness | `clcguideseller` | **Yes (Always Run)** |
| Free checklist: Buyer & Tenant Due Diligence | `clcguidebuyer` | **Yes (Always Run)** |
| Ticked the email-updates box (CASL consent) | `clcoptin` | No (use for mass emails) |

Every inquiry gets exactly **one** intent hashtag, so exactly one inquiry campaign starts. Since v1035 there is one form everywhere: an inquiry that also picks a free checklist gets its intent tag **and** `clcguide` + the checklist tag, so the checklist campaign (Always Run) sends the PDF too.

## 4. Build the campaigns (Cheri's BoldTrail → Marketing → Smart Campaigns)

For each campaign: **Campaign Logic → Hashtag is →** the tag below. **Designed For → ALL** (otherwise the campaign won't attach to website leads with no Buyer/Seller type).

| Campaign | Trigger hashtag | Suggested first step |
|---|---|---|
| CLC – Buyer inquiry | `clcbuy` | Email now: "Thanks, here's how we'll find the right property" + task for Cheri to call |
| CLC – Seller inquiry | `clcsell` | Email now + call task (same day) |
| CLC – Tenant inquiry | `clcleasespace` | Email now: what we need to start a space search |
| CLC – Landlord inquiry | `clcleaseout` | Email now + call task |
| CLC – Business brokerage | `clcbusiness` | Personal email from Cheri, confidentiality note, call task |
| CLC – General inquiry | `clcother` | Email now + call task |
| CLC – Newsletter welcome | `clcnewsletter` | Welcome email (don't use a first-name merge field: newsletter sign-ups only give an email, so the name is "Website Lead") |
| CLC – Seller/Landlord checklist | `clcguideseller` | **Turn on Always Run.** Email at 0 minutes with the PDF link, then light follow-up |
| CLC – Buyer/Tenant checklist | `clcguidebuyer` | **Turn on Always Run.** Email at 0 minutes with the PDF link, then light follow-up |

Rules worth knowing:
- **A contact has one main campaign.** If two match, BoldTrail keeps the one matching the most triggers. That's why the two checklist campaigns use **Always Run**: the PDF always sends, even if the person already sits in an inquiry campaign.
- **Concierge:** leads with Concierge turned ON don't get campaigns automatically. Check that Concierge is off for these leads in Cheri's account.
- A campaign that's toggled off is never assigned. Turn each one on after building it.
- Put the checklist PDFs on `info.cherilongcommercial.com/assets/guides/` and link them in the emails.

## 5. CASL

- Inquiries: following up on what they asked about is fine (implied consent from their inquiry). Keep inquiry campaigns about their request.
- Market updates / mass emails: only send to contacts with `#clcoptin` (they ticked the box). The note on each contact records the answer.

## 6. Test end to end (after deploy)

1. Submit the homepage inquiry form with your own `+test` email and "Sell a property".
2. Within a minute: contact in Cheri's BoldTrail with `#clcsell`, the note, the Seller campaign attached, and Victoria gets the backup email.
3. If the backup email subject starts with **"⚠ NOT IN BOLDTRAIL"**, the email has the error and the hashtags to add by hand.

## Turning on the checklists

When the two PDFs are ready: set `SHOW_GUIDES = true` in `header.js`, add a section with `id="clc-guides"` containing `<div data-clc-guide></div>` (and optional buttons with `data-guide="seller"` / `data-guide="buyer"`), and build the two Always Run campaigns.
