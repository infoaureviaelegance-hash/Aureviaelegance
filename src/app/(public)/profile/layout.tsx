import type { ReactNode } from "react";
import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Customer Profile",
  description: "Manage your Aurevia Elegance customer details and order history.",
  path: "/profile",
  noIndex: true,
});

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return children;
}
