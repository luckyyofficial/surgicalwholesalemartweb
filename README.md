# Surgical Wholesale Mart storefront

A responsive, buildless HTML/CSS/JavaScript medical procurement storefront. Open `index.html` using a local web server.

## Features

- Six editable hero banners with distinct transitions, a four-second interval and synchronized header colors.
- Six product families, search, department filters, sorting, saved products and comparison of up to three items.
- A persistent quote basket with quantities and removal; validated enquiry preparation; email, WhatsApp and text-file handoff.
- 177 catalog listings: selected Dr. Smith products with reviewed photos plus the retrieved Surgical Wholesale Mart catalog index. See `data/catalog-provenance.md` for import coverage and image restrictions.
- Shared responsive layout across storefront, company profile, locations, support, meeting requests, warranty and policy pages.

## Edit and regenerate

Edit `data/catalog.json` for products/categories, `data/hero.html` for banner copy, `css/hero.css` for hero styling, and `css/storefront.css` for the storefront design. Run:

```sh
python3 scripts/build-storefront.py
```

This regenerates the storefront and company-information pages and `js/catalog.js`. No package installation or framework build is required. `js/store.js` handles commerce interactions; `js/hero.js` handles hero transitions.

## Verify

```sh
node --test tests/*.test.cjs
python3 tests/check-static.py
```

## Current boundaries

Prices and stock are confirmed by quotation; no payment gateway or order backend is configured. Forms prepare a reviewable draft and do not claim to send automatically. Contact drafts use session storage; basket/saved IDs use local storage. Imported items without a verified unbranded photo show “Product photograph available on enquiry.”

The temporary SWM site's index was available via cached web retrieval, but direct access returned HTTP 403 and browser origin approval was declined. Products that appear only inside individual category pages may be missing. A full owner-provided export or renewed authorized access is needed to verify complete catalog coverage and remaining photos.

Company details are maintained in `data/company.json` and `scripts/company_content.py`, sourced from the published Dr. Smith company pages. Product-brand and procurement-company roles are kept distinct. Full addresses, regional/export phone numbers, leadership and commercial-support information are included; an additional legacy Punjab service-centre record is marked unconfirmed.

## External product photos

Reviewed internet photos use absolute HTTPS URLs in the catalog. The image review and source are stored with each product; representative range photos are labelled in the UI. Run `python3 scripts/apply-reviewed-images.py` to apply new reviewed manifests, then regenerate. See `data/image-coverage.json` for the latest count and `data/image-research-*-unresolved.json` for research gaps. Images with unverified branding or the wrong model must not be used just to fill a card.
