# Cheri Long Commercial — website repo

Custom code and pages for **Cheri Long Commercial** (Cheri Long, Associate Broker, Royal LePage® Commercial, Calgary).
Built and maintained by Kyle Duiker (Broker Delegate, Royal LePage Solutions).

> **v1012 (Nov 13 2026) — read this first.**
> - `assets/js/site-config.js` is the SINGLE source for phone, emails, office address, listings URL, page URLs,
>   social links and `leadEndpoint`. Loaded first by the BoldTrail Custom Header Code and every subdomain page.
>   Values in [BRACKETS] are placeholders and are hidden on the live site (`CLC_SITE.isPlaceholder`).
> - `header.js` builds: header, the shared footer on EVERY page (inserted above BoldTrail's #footer on BoldTrail pages),
>   the inquiry form (`[data-clc-inquiry]`, `="compact"` on the homepage) and newsletter form (`[data-clc-newsletter]`),
>   service-button preselect (`a[data-intent]` / `data-ptype`, or `?intent=&type=` on /contact/), and the property-page
>   cleanup (hides 0-value Bedrooms/Bathrooms, jumpId/French rows, Amenities, "Find Your Home's Value").
> - Lead capture is a PLACEHOLDER: with `leadEndpoint` empty, forms open a pre-filled email to the assistant.
> - `[data-todo]` sections are hidden unless the URL has `#clc-preview` (homepage) or `?preview=1` (subdomain).
> - Custom Header Code: `html.clc-ready` background MUST stay transparent (BoldTrail inner pages make <body> one screen
>   tall; a black <html> showed behind everything below the first screen on property pages).
> - Body Code: every homepage rule scoped to `body.page-home` except section 1 (BoldTrail modal/filter fix, site-wide on
>   purpose) and section 6 (map auto-search script).
> - Per-page hero photos: replace `assets/images/hero-services.jpg` / `hero-about.jpg` / `hero-contact.jpg` (same names).
>   Inline CSS var URLs must be root-relative (`/assets/...`), not `../`.
> - Keep JS ASCII-only (non-ASCII as \uXXXX); body code HTML uses entities.

> **Current live setup (Nov 2026, v1012):** the header is built by `assets/js/header.js` + `assets/css/header.css`
> (same pattern as the Royal LePage Solutions site). `boldtrail/custom-header-code.html` and
> `boldtrail/custom-body-code.html` hold the homepage. `assets/js/clc.js`, `assets/css/clc.css` and `preview/` are an
> earlier draft and are NOT loaded anywhere. Sections below that mention clc.js describe that draft.
> Main domain: cherilongcommercial.com. Subdomain: info.cherilongcommercial.com.
> `SHOW_FORMS` (in header.js AND the Body Code) is false until the lead forms are wired up.
> **Subdomain pages (v1005):** `/services/`, `/about/`, `/contact/` (site header + footer, styles in
> `assets/css/pages.css`; header.js fills `<footer id="clc-site-footer">`) and `/links/` (stand-alone Instagram
> link-in-bio page, own inline styles). New pages: copy `/_template/` to `/<page-name>/`. The old `pages/` folder
> convention below is replaced by top-level folders. v1006: see-through header on pages with a hero
> (homepage + subdomain pages, `body.clc-overlay`), solid black after scrolling; logo only, no name text.
> v1009: every other page (BoldTrail search/map/listings) gets a solid black header, white/red logo. Menu links for Services/About/Contact come from `PAGES` in header.js.

Two parts work together:

1. **BoldTrail site** (`{{BOLDTRAIL_DOMAIN}}`): the main site, IDX listings and lead capture. We change it only through
   BoldTrail's **Custom Header Code** and **Custom Body Code** fields.
2. **GitHub Pages subdomain** (`{{SUBDOMAIN}}`): this repo. It hosts the shared CSS/JS that BoldTrail loads, plus
   custom pages BoldTrail can't build (guides, resources, landing pages).

## Fill in before first deploy

Search the repo for `{{` and replace every placeholder:

| Placeholder | What it is | Where |
|---|---|---|
| `{{SUBDOMAIN}}` | e.g. `info.cherilongcommercial.com` | `boldtrail/*.html`, `pages/_template/index.html`, `CNAME` |
| `{{BOLDTRAIL_DOMAIN}}` | her main BoldTrail domain, e.g. `www.cherilongcommercial.com` | `assets/js/clc.js` CONFIG, `index.html` |

Also fill in `CONFIG` at the top of `assets/js/clc.js`: phones, Vic's email, office address, social links, `LEAD_ENDPOINT`.

Until the subdomain DNS is live, the files can be served from `https://{{GITHUB_USER}}.github.io/{{REPO}}/`.
Once it is live, add a `CNAME` file at the repo root containing just the subdomain.

## Repo layout

```
CLAUDE.md                       this file
index.html                      subdomain root, redirects to the BoldTrail site
assets/css/clc.css              ALL shared styles (header, homepage sections, page pieces)
assets/js/clc.js                header, contact/legal section, page detection, filters, forms
assets/images/                  photos and logos (no "+" or spaces in filenames)
boldtrail/custom-header-code.html   paste into BoldTrail > Custom Header Code
boldtrail/custom-body-code.html     paste into BoldTrail > Custom Body Code (homepage sections + script tag)
pages/_template/index.html      starting point for every subdomain page
pages/<page-name>/index.html    one folder per live page
preview/index.html              preview of the BoldTrail homepage without BoldTrail
```

## How it works

- `clc.js` builds the utility bar + flat-nav header at the top of every page (BoldTrail and subdomain).
- On BoldTrail it adds `body.has-clc-header`; `clc.css` then hides BoldTrail's own header with the same
  selectors the Royal LePage Solutions site uses: `#header`, `div#header`, `.site-header`, `.kv-header`,
  `#quick-search`, `#fixed-header-spacer`, `.page-wrapper > #header`, plus the spacer classes.
  If the script fails, BoldTrail's header stays visible. Never hide it unconditionally.
- "On BoldTrail" = the page has `#header`, `.kv-header` or `.site-header`.
- Homepage sections live in `#clc-home` inside the Body Code field. `clc.js` keeps them only on the BoldTrail
  homepage (`/`, `/index.php`, `/index.html` with no query string) and moves them directly under the header,
  outside BoldTrail's containers.
- The contact & legal section (`#clc-contact`) is built by `clc.js` on the homepage and on subdomain pages.
  Other BoldTrail pages keep BoldTrail's own footer. There is no custom footer field.
- Nav links point to `#section` when that section is on the page, otherwise to `{{BOLDTRAIL_DOMAIN}}/#section`.
- FOUC guard: `html { visibility:hidden }` until `clc.js` adds `html.clc-ready`, with a 2.5 s fallback.
- The homepage sections and header markup each exist in exactly one place. Don't duplicate them.

## Deploying a change

1. Edit the file(s) and commit to `main`. GitHub Pages ignores `?v=`, so the commit is what updates the file.
2. If `clc.css` or `clc.js` changed, bump the version: `VERSION` in the file header, then every `?v=` in
   `boldtrail/custom-header-code.html`, `boldtrail/custom-body-code.html` and every `pages/*/index.html`.
   Keep all of them on the same number. Current: **1012**.
3. Tell Kyle which BoldTrail field(s) to re-paste. Always give the complete file, never a partial diff.
4. Check the live BoldTrail homepage, one BoldTrail inner page (e.g. a search page) and one subdomain page.

## Making a new subdomain page

1. Copy `pages/_template/` to `pages/<page-name>/` (lowercase, hyphens).
2. Update `<title>`, meta description and canonical URL.
3. Prefix page-only CSS classes with a short code (`.lg-`, `.ck-`) to avoid clashing with `.clc-` styles.
4. Wrap any page JavaScript in an IIFE. Asset paths from a page are `../../assets/`.
5. Link it from the header or homepage if it should be found.

## Brand rules (Royal LePage, strict)

- Colours (tokens in `clc.css`): black `#000000`, red `#EA002A`, white, warm grey `#6B6660`, taupe `#A89E92`,
  stone `#D6D1C8`, light grey `#EFEFEF`. `#C20023` is for hover only. No blue, yellow or gold. One accent: red.
- Fonts: Raleway (headings) and Roboto (body). Only exception: Great Vibes (script) for the "Cheri Long" signature
  in the homepage hero (`--clc-script`), approved by Kyle Nov 2026. No other families.
- ® on the first "Royal LePage" on every page.
- Every public page needs the legal block: rlp.ca/notices, "independently owned and operated",
  "not intended to solicit buyers or sellers currently under contract". `clc.js` adds it.
- Email capture must state CASL consent; newsletter opt-in is a separate, unticked checkbox.
- Broker/manager sign-off before anything with brand, team/roster or recruiting claims goes live (RECA advertising rules).
- Never use Royal LePage Solutions brokerage-site elements (Deposit Instructions, Agent Hub, brokerage menu) on Cheri's site,
  and never mix in Duiker Properties content.

## Audience and design

- Many visitors are older: base font 18px, large tap targets (48px+), flat navigation with no dropdowns, high contrast.
  Phones (v1010, Kyle's call): "☰ Menu" button with a visible word label + a red tap-to-call button in the bar.
- Header (v1010): no top strip, no "Talk to Our Team" button; "Call Cheri" + social icons at the right.
- Liked references: scoutrealestate.ca (clean, easy to read) and francandco.com (darker theme, strong photos).

## BoldTrail and GitHub gotchas

- BoldTrail strips `<script>` from page HTML blocks on save. Scripts go in the Custom Code fields or in `clc.js`.
- BoldTrail theme styles often win; scope everything under `.clc` and use `!important` only where needed.
- Full-width breakouts inside BoldTrail containers: `margin-left: calc(-50vw + 50%)`.
- Moving BoldTrail elements: use `appendChild`/`insertAdjacentElement` (move), never clone, to keep their JS state.
- GitHub Pages 404s filenames with `+`. Use `raw.githubusercontent.com` for those, or rename the file.
- `fetch()` of local files fails on `file://`. Preview with `python3 -m http.server 8000`.

## Open items

- [x] Real content: Cheri's cell 403-860-9419, Victoria Stitt (Assistant) cladmin@royallepage.ca, office Unit 205, 264 Midpark Way SE, socials
- [x] Royal LePage Commercial logos in assets/images (brokerage versions used in header + footer)
- [ ] Hero photo, Cheri's direct line (if any)
- [x] Listings: BoldTrail feed works. Calgary filter needs `pak=city:g30_c3nfkdtg` (display= alone does nothing);
      sorted newest first. Types: 4 Commercial, 5 Land, 3 Multi-Family, 12 Farm.
- [ ] `LEAD_ENDPOINT`: Cloudflare Worker that stores the lead and emails the checklist PDF (Resend), same pattern as
      Royal LePage Solutions' bluebird-lead-proxy. Restrict allowed origins to her two domains.
- [ ] Write the two checklist PDFs: Seller & Landlord Readiness, Buyer & Tenant Due Diligence
- [ ] Own Privacy Policy page (legal links currently point to royallepage.ca privacy policy + notices)
- [ ] YouTube channel link when live
- [x] Domain: cherilongcommercial.com (always link the www version)
- [ ] Confirm office postal code (T2X 1J6 per BoldTrail vs T2X 1M2 per Google Maps) in site-config.js
- [ ] Fill placeholders: [CHERI_EMAIL], stats, transactions, testimonials, About proof points/deals/specialties/designations/community
- [ ] Broker sign-off before launch
