import type { ReactNode } from "react";
import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Your Wishlist",
  description: "View products saved to your Aurevia Elegance wishlist.",
  path: "/wishlist",
  noIndex: true,
});

export default function WishlistLayout({ children }: { children: ReactNode }) {
  return children;
}
