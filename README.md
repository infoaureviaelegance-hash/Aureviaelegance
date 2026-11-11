# Auerviamaison

Full-stack e-commerce storefront built with Next.js, Prisma, NextAuth, and Cloudinary.

## Meta Pixel deployment

Set `NEXT_PUBLIC_META_PIXEL_ID` to the Auerviamaison Pixel ID in every deployment environment that should send browser events, then redeploy. Leave it unset where tracking should remain disabled.

The Meta product catalog feed is available at `https://<your-site-domain>/meta-catalog.xml` (the original endpoint remains available at `/api/meta/catalog`). Add this URL as a scheduled data feed in Meta Commerce Manager. It returns product items only; configure `NEXT_PUBLIC_SITE_URL` to the canonical HTTPS storefront URL so product links and images use the correct domain.

The browser Pixel tracks `PageView` across navigation, `ViewContent` on product pages, `AddToCart`, `InitiateCheckout`, `AddPaymentInfo`, and `Purchase` after a successful order response. No additional npm package is required for this integration.
