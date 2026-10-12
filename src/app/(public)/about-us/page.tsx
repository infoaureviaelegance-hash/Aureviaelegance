import { prisma } from "@/lib/prisma"
import { serializeVideo } from "@/lib/video-utils"
import { FeaturedVideoSection } from "@/components/features/videos/featured-video-section"
import { AboutPageContent } from "./_components/about-page-content"
import { absoluteUrl, breadcrumbSchema, createSeoMetadata } from "@/lib/seo"
import { JsonLd } from "@/components/seo/json-ld"

export const metadata = createSeoMetadata({
  title: "About Us",
  description: "Learn about Aurevia Elegance and the beauty, skincare, fragrance, and personal-style essentials we curate for modern routines.",
  path: "/about-us",
  keywords: ["Aurevia Elegance", "beauty store Pakistan", "skincare Pakistan", "makeup products Pakistan", "premium fragrance Pakistan"],
})

export const revalidate = 3600;

export default async function AboutPage() {
  const aboutVideos = await prisma.video.findMany({
    where: { active: true, placement: "ABOUT" },
    orderBy: [{ featured: "desc" }, { displayOrder: "asc" }, { createdAt: "desc" }],
    take: 8,
  });

  return (
    <>
      <JsonLd data={[
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: "About Us", path: "/about-us" }]),
        {
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About Aurevia Elegance",
          description: "The story, values, and curated beauty philosophy behind Aurevia Elegance.",
          url: absoluteUrl("/about-us"),
          mainEntity: { "@id": `${absoluteUrl("/")}#organization` },
        },
      ]} />
      <AboutPageContent />
      <FeaturedVideoSection
        videos={aboutVideos.map(serializeVideo)}
        heading="Meet our work through video"
        description="A separate featured story for the about page, managed from the admin video module."
      />
    </>
  );
}


