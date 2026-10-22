# RUMEA verification

Checked on 22 October 2026. Browser QA used the running local Vite app in the Codex in-app browser. Production checks use the same source and optimized assets.

## Completed checks

- Nine meaningful automated commerce/catalog tests: malformed storage, invalid variants, duplicate merges, separate colors, quantity bounds, current retail totals, mixed-price totals, all-inquiry totals, encoded WhatsApp order drafts, empty-cart prevention, and catalog/image integrity.
- TypeScript strict checking and production bundling.
- Prerendered HTML for 28 routes; product-specific titles/descriptions, canonical URLs, Product JSON-LD without unsupported stock claims, sitemap, and a 404 document.
- All 22 product routes opened in-browser and showed the expected heading and authentic primary image path; no horizontal overflow at desktop width.
- Homepage checked at 360, 375, 390, 428, 768, 1024, 1280, 1440, and 1920px.
- Additional 54 layout checks: catalog, Printed Viscose, Gana, bag, about, and shopping guide at those nine widths. No horizontal overflow.
- Desktop and mobile screenshots inspected for typography, crop, spacing, navigation, product cards, product details, and mobile navigation drawer.
- Mobile menu opened, followed a collection link, and closed after route change.
- Search for “gradasi” returned one product. Combined maximum-price filter returned the expected empty state. Reset restored 22 products. Ascending prices sorted from Rp29.000 through Rp169.000, with inquiry prices last.
- Product variant Creamy Nude updated selection; 2 pieces produced Rp198.000 in the bag.
- Added Lea Pink alongside that item: only verified products entered the numerical subtotal; the order message included both exact variants and quantities, and explained the pending price.
- Updated the priced quantity to 3: subtotal became Rp297.000. Reload preserved all 4 pieces across 2 lines. Removing Lea preserved the correct priced subtotal; removing the final line showed the empty bag.
- Saved Lea, opened the saved-collection page, and reloaded to verify persistence. Test selections were cleared afterwards.
- WhatsApp draft href parsed to `https://wa.me/6281318597071`; Unicode and line breaks round-trip through URL encoding. No message was sent to the business.
- Browser console returned no warnings/errors during final route and responsive tests.
- Color/gallery review corrected thumbnails so a selected variant does not present another photographed color as its alternate angle.
- Small color controls have 24px hit areas. Native dialog handles focus, background inertness, and Escape dismissal. Focus outlines and reduced-motion CSS are present.

## Evidence and boundaries

Screenshots are local in `qa/home-desktop.jpg` and `qa/home-mobile.jpg`; they are excluded from the hosted build. Automated checks run using `npm test`, and `npm run build` also validates every generated HTML route and referenced local link/asset.

The catalog maps 22 collection folders, not every supplier photograph or the full live stock inventory. Six collection prices remain unknown. Lea/Zea material and measurements remain unknown. September catalog retail/Ecer references are used where the supplied reference already presents them to customers. No reseller costs are shipped.

Actual business confirmation, message sending, payment processing, shipping quotations, and fulfillment cannot be verified by a frontend test. The site therefore requests confirmation through WhatsApp and never claims an order is complete. No Lighthouse score, device-hardware performance result, or screen-reader certification is claimed. Reduced-motion support and dialog semantics were inspected in implementation; a full assistive-technology audit was not performed.
