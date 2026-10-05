# Cheri Long Commercial — website repo

Custom code and pages for **Cheri Long Commercial** (Cheri Long, Associate Broker, Royal LePage® Commercial, Calgary).
Built and maintained by Kyle Duiker (Broker Delegate, Royal LePage Solutions).

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
   Keep all of them on the same number. Current: **1001**.
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
- Fonts: Raleway (headings) and Roboto (body). No other families.
- ® on the first "Royal LePage" on every page.
- Every public page needs the legal block: rlp.ca/notices, "independently owned and operated",
  "not intended to solicit buyers or sellers currently under contract". `clc.js` adds it.
- Email capture must state CASL consent; newsletter opt-in is a separate, unticked checkbox.
- Broker/manager sign-off before anything with brand, team/roster or recruiting claims goes live (RECA advertising rules).
- Never use Royal LePage Solutions brokerage-site elements (Deposit Instructions, Agent Hub, brokerage menu) on Cheri's site,
  and never mix in Duiker Properties content.

## Audience and design

- Many visitors are older: base font 18px, large tap targets (48px+), flat navigation with no dropdowns,
  menu always visible on phones (no hamburger), high contrast.
- Liked references: scoutrealestate.ca (clean, easy to read) and francandco.com (darker theme, strong photos).

## BoldTrail and GitHub gotchas

- BoldTrail strips `<script>` from page HTML blocks on save. Scripts go in the Custom Code fields or in `clc.js`.
- BoldTrail theme styles often win; scope everything under `.clc` and use `!important` only where needed.
- Full-width breakouts inside BoldTrail containers: `margin-left: calc(-50vw + 50%)`.
- Moving BoldTrail elements: use `appendChild`/`insertAdjacentElement` (move), never clone, to keep their JS state.
- GitHub Pages 404s filenames with `+`. Use `raw.githubusercontent.com` for those, or rename the file.
- `fetch()` of local files fails on `file://`. Preview with `python3 -m http.server 8000`.

## Open items

- [ ] Real content: phones, Vic's email, office address, team names, bio, photos, Royal LePage Commercial logo
- [ ] Listings: confirm whether BoldTrail's feed includes her commercial listings; if not, use a published
      Google Sheet (CSV) for active + sold listings
- [ ] `LEAD_ENDPOINT`: Cloudflare Worker that stores the lead and emails the checklist PDF (Resend), same pattern as
      Royal LePage Solutions' bluebird-lead-proxy. Restrict allowed origins to her two domains.
- [ ] Write the two checklist PDFs: Seller & Landlord Readiness, Buyer & Tenant Due Diligence
- [ ] Privacy Policy and Terms pages (subdomain)
- [ ] YouTube channel link when live
- [ ] Domain: "Cheri Long Commercial" (first choice) or "Cheri Long Commercial Real Estate"
- [ ] Broker sign-off before launch
