import { prisma } from "@/lib/prisma";
import { serializeVideo } from "@/lib/video-utils";
import { VideosPageClient } from "@/components/features/videos/videos-page-client";
import { createSeoMetadata } from "@/lib/seo";

export const revalidate = 900;

export const metadata = createSeoMetadata({
  title: "Beauty Product Videos & Buying Guides",
  description: "Watch Aurevia Elegance beauty product demos, skincare and makeup guidance, buying guides, and new product updates in Pakistan.",
  path: "/videos",
  keywords: ["beauty product videos", "skincare guides Pakistan", "makeup tutorials Pakistan", "fragrance buying guide"],
});

export default async function VideosPage() {
  const videos = await prisma.video.findMany({
    where: { active: true },
    orderBy: [{ featured: "desc" }, { displayOrder: "asc" }, { createdAt: "desc" }],
  });

  return <VideosPageClient videos={videos.map(serializeVideo)} />;
}
