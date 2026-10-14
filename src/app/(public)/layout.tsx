import { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ChatIntegrations } from "@/components/integrations/chat-integrations";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_URL } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

const getHeaderCategories = unstable_cache(
  () => prisma.category.findMany({
    where: { parentId: null },
    orderBy: [{ order: "asc" }, { name: "asc" }],
    select: { id: true, name: true, slug: true, image: true },
  }).catch(() => []),
  ["public-header-categories"],
  { revalidate: 300, tags: ["categories"] },
);

const businessSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Aurevia Elegance",
    url: SITE_URL,
    logo: `${SITE_URL}/logo/auerviamaison.png`,
    sameAs: ["https://www.instagram.com/auerviamaison", "https://www.facebook.com/auerviamaison"],
  },
  {
    "@context": "https://schema.org",
    "@type": ["OnlineStore", "LocalBusiness", "Store"],
    "@id": `${SITE_URL}/#localbusiness`,
    name: "Aurevia Elegance",
    url: SITE_URL,
    image: `${SITE_URL}/logo/auerviamaison.png`,
    priceRange: "PKR",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Sardheri Bazar, Charsadda Mardan Road",
      addressLocality: "Charsadda",
      addressRegion: "Khyber Pakhtunkhwa",
      postalCode: "24420",
      addressCountry: "PK",
    },
    areaServed: { "@type": "Country", name: "Pakistan" },
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
  },
];

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const headerCategories = await getHeaderCategories();

  return (
    <div className="public-site flex min-h-screen min-w-0 max-w-full flex-col overflow-x-clip">
      <a href="#main-content" className="sr-only z-[100] rounded bg-white px-4 py-2 text-black focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to main content</a>
      <JsonLd data={businessSchemas} />
      <Header initialCategories={headerCategories} />
      <main id="main-content" tabIndex={-1} className="min-w-0 max-w-full flex-grow overflow-x-clip bg-white pb-16 outline-none md:pb-0 safe-area-bottom">{children}</main>
      <Footer />
      <MobileBottomNav />
      <ChatIntegrations />
    </div>
  );
}

