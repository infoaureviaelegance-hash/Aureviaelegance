import { getCollectionList } from "./service";
import { CollectionsPageContent } from "./_components/collections-page-content";
import { createSeoMetadata } from "@/lib/seo";

export const revalidate = 60;

export const metadata = createSeoMetadata({
  title: "Beauty & Lifestyle Collections Pakistan",
  description: "Explore curated skincare, makeup, fragrance, hair care, jewelry, watches, beauty accessories and gift collections from Aurevia Elegance.",
  path: "/collections",
  keywords: ["beauty collections Pakistan", "skincare collections", "makeup collections Pakistan", "fragrance collections", "beauty gift sets Pakistan"],
});

export default async function Page() {
  let data: Awaited<ReturnType<typeof getCollectionList>> = {
    pageInfo: { hasNextPage: false },
    edges: [],
  };

  try {
    data = await getCollectionList();
  } catch (error) {
    console.error("Failed to load collections:", error);
  }

  return <CollectionsPageContent data={data} />;
}

