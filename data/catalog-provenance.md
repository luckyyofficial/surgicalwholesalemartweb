# Catalog selection

Source: https://www.drsmith.co.in/ and its public product-explorer.json, catalogue-taxonomy.json and department-product-photos.json. Reviewed 2026-11-08.

15 product photos were visually inspected and retained without visible logos or watermarks. Source quality flags alone were insufficient: excluded instrument sets and scrub uniforms had watermarks; several equipment images had branding or damaged transparency. Instruments and consumables therefore use clearly marked category enquiries rather than invented individual product listings. Instrument category artwork is representative, not a photograph of a particular set.

Prices, stock, ratings, certifications, warranty and delivery estimates were not supplied. The storefront requests quotations and does not invent these values. Source URLs and original titles are preserved in catalog.json. Contact handoff uses the source site's published enquiry email and WhatsApp number. No payment gateway or order backend is configured.

## Temporary SWM catalog import

Additional source: https://www.surgicalwholesalemart.co.in/products-and-services.html, retrieved via web tool on 2026-11-08 (tool reported a cached copy). 169 index entries yielded 162 additional unique listings after exact-name and reviewed alias deduplication, for 177 total products. All retrieved index entries are preserved in swm-index-products.json. Product-level pages and further images could not be fully verified: direct downloads returned HTTP 403, and native browser origin approval was declined. Individual category pages may contain additional products beyond the index's preview links; this import is not a verified complete export of the live catalog. Imported products without verified, unbranded photographs use an explicit photo-on-enquiry state. Product/model brand names are retained where they identify a specific source product rather than misrepresenting them as generic equipment. No branded product images are displayed.

## Temporary external photo pass — 2026-11-08

Additional product photographs are stored as direct absolute HTTPS URLs, with per-product imageSource, imageReview, imageKind and review date. Research manifests under data/image-research-*.json preserve the reviewed URLs and image dimensions. Manufacturer logos, watermarks and damaged source images were excluded. Generic reference images are explicitly labelled in cards and product details; they are not confirmation of an exact model, configuration or compatibility. Some named devices remain without photos because no clean matching image has been verified. External hosts can change or remove images; the frontend falls back to the enquiry photo state when a hotlink fails.
