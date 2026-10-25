# Meet Mei update — 25 October 2026

The homepage brand-story position and `/tentang` now use `src/components/FounderStory.tsx`. It contains the client's exact Meet Mei copy and the supplied original second photograph at `public/assets/images/mei-founder.jpeg`.

The old “Ruang untuk menjadi dirimu” About section was replaced. Existing product data, checkout configuration, commerce logic, storage, homepage hero, categories, and product pages were preserved. WhatsApp remains **081318597071**.

The section uses the existing RUMEA font/color tokens and stacks photo above text on mobile. Screenshots and viewport checks are in the parent workspace's `qa/` directory. Existing commerce tests and the full production build pass; the browser cart regression confirms the original WhatsApp destination. Regression QA also found and fixed a 4px category-strip overflow at 360px with a scoped margin adjustment.
