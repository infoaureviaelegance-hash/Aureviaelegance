import ContactClient from "./contact-client";
import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Contact Aurevia Elegance",
  description: "Contact Aurevia Elegance for beauty, skincare, makeup, fragrance, accessories, and delivery support across Pakistan.",
  path: "/contact",
  keywords: ["Aurevia Elegance contact", "beauty store Pakistan", "skincare Pakistan", "makeup support Pakistan"],
});

export default function ContactPage() {
  return <ContactClient />;
}

