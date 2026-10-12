"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Sparkles, ShieldCheck, Truck } from "@esmate/shadcn/pkgs/lucide-react";

const infoCards = [
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: "Premium products",
    text: "Curated skincare, makeup, fragrance, accessories, and lifestyle essentials for everyday routines.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "Verified quality",
    text: "Products are reviewed for packaging, labeling, presentation, and available sourcing information before listing.",
  },
  {
    icon: <Truck className="h-5 w-5" />,
    title: "Delivery & support",
    text: "Delivery across Pakistan, with responsive support for product, order, return, and shipping questions.",
  },
];

const faqItems = [
  {
    question: "What types of products do you sell?",
    answer:
      "We offer skincare, makeup, fragrances, hair care, personal care, jewelry, watches, and beauty accessories for everyday routines and gifting.",
  },
  {
    question: "Are your products checked before sale?",
    answer:
      "Yes. Products are checked for packaging integrity, labeling, presentation and the quality information supplied by our sourcing team before listing.",
  },
  {
    question: "Can I return an eligible product?",
    answer:
      "Return eligibility depends on the product condition, reason for return, and confirmed order terms. Contact us before sending any item back so our team can provide the correct instructions.",
  },
  {
    question: "Do you deliver across Pakistan?",
    answer:
      "Yes. We ship to customers across Pakistan and also assist with pickup and delivery coordination where available.",
  },
  {
    question: "Do you help with choosing the right product?",
    answer:
      "Absolutely. Our team can guide you based on your preferred product type, use, quantity, and budget.",
  },
  {
    question: "Do you sell accessories too?",
    answer:
      "Yes. You can shop jewelry, watches, beauty tools, grooming accessories, and other finishing touches alongside our beauty collections.",
  },
  {
    question: "How can I contact support after purchase?",
    answer:
      "You can reach our support team through the contact page, phone, or WhatsApp for product and order assistance.",
  },
];

export function FaqPageContent() {
  return (
    <div className="bg-background">
      <section className="px-6 py-24 text-center sm:py-32">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Frequently Asked Questions
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Clear, practical answers about our products, warranty support, delivery, and buying guidance.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {infoCards.map((card) => (
            <div key={card.title} className="rounded-xl border border-gray-200 bg-card p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-foreground">
                {card.icon}
              </div>
              <h3 className="text-lg font-semibold text-foreground">{card.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-32">
        <div className="mx-auto max-w-4xl divide-y divide-border">
          {faqItems.map((item) => (
            <FaqItem key={item.question} question={item.question} answer={item.answer} />
          ))}
        </div>
      </section>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="m-2 rounded-2xl border border-gray-200 last:border-0">
      <button
        onClick={() => setIsOpen((value) => !value)}
        className="flex w-full items-start justify-between py-6 text-left"
      >
        <span className="pl-4 text-base font-semibold text-foreground">{question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="mr-4 h-5 w-5 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-8 pb-6 text-muted-foreground">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
