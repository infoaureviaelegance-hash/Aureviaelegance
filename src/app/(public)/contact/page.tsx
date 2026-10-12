import ContactClient from "./contact-client";
import { createSeoMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, breadcrumbSchema } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Contact Us",
  description: "Contact Aurevia Elegance for beauty, skincare, makeup, fragrance, accessories, and delivery support across Pakistan.",
  path: "/contact",
  keywords: ["Aurevia Elegance contact", "beauty store Pakistan", "skincare Pakistan", "makeup support Pakistan"],
});

export default function ContactPage() {
  return (
    <>
      <JsonLd data={[
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Contact Us", path: "/contact" }]),
        {
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact Aurevia Elegance",
          description: "Contact Aurevia Elegance for product guidance, orders, delivery, returns, and wholesale inquiries.",
          url: absoluteUrl("/contact"),
          mainEntity: { "@id": `${absoluteUrl("/")}#organization` },
        },
      ]} />
      <ContactClient />
    </>
  );
}

