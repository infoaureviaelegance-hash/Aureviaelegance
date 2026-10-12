import { FaqPageContent } from "./_components/faq-page-content";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Beauty Shopping & Delivery FAQ Pakistan",
  description: "Answers about buying beauty, personal care, fragrance, and lifestyle products in Pakistan from Aurevia Elegance.",
  path: "/faq",
  keywords: ["beauty shopping FAQ Pakistan", "skincare delivery Pakistan", "Aurevia Elegance returns", "beauty product support"],
});

const faqItems = [
  ["What types of products do you sell?", "We offer skincare, makeup, fragrances, hair care, personal care, jewelry, watches, and beauty accessories for everyday routines and gifting."],
  ["Are your products checked before sale?", "Yes. Products are checked for packaging integrity, labeling, presentation and the quality information supplied by our sourcing team before listing."],
  ["Can I return an eligible product?", "Return eligibility depends on the product condition, reason for return, and confirmed order terms. Contact us before sending any item back so our team can provide the correct instructions."],
  ["Do you deliver across Pakistan?", "Yes. We ship to customers across Pakistan and also assist with pickup and delivery coordination where available."],
  ["How can I choose the right product?", "Our team can help you compare product types, features, shades, sizes, and budgets through the contact page or WhatsApp before you order."],
];

export default function FAQPage() {
  return (
    <>
      <JsonLd data={[
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq" }]),
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map(([question, answer]) => ({
            "@type": "Question",
            name: question,
            acceptedAnswer: { "@type": "Answer", text: answer },
          })),
        },
      ]} />
      <FaqPageContent />
    </>
  );
}

