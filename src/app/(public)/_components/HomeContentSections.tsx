import { CategoriesSection, CollectionsSection, ProductsSection } from "@/components/features/home/products-section";
import { FeaturedBlogSection } from "@/components/features/home/featured-blog-section";
import { CustomerVoicesSection } from "@/components/features/home/customer-voices-section";
import type { PublicVideo } from "@/lib/video-utils";
import { CertificationsSlider, type CertificateLogo } from "@/components/features/certifications/certifications-slider";
import { PromoBannerSection } from "@/components/features/home/promo-banner-section";
import type { PromoBanner } from "@/components/features/home/promo-banner-types";
import { PinkSaltWellnessSection, TrustStrip } from "@/components/features/home/homepage-static-sections";
import { HomepageReelsSection } from "@/components/features/home/homepage-reels-section";
import { PromotionalBannerCarousel } from "@/components/features/home/promotional-banner-carousel";
import type { PromotionalCategoryBanner } from "@/components/features/home/promotional-category-banner-types";

type HomeContentSectionsProps = {
  categories: Array<{ id: string; name: string; slug: string; description: string | null; image: string | null; parentId?: string | null; order?: number; homepageRow?: number | null; promoEnabled?: boolean; promoTitle?: string | null; promoDescription?: string | null; promoImage?: string | null; promoButtonText?: string | null; promoOrder?: number }>;
  promoBanners: PromoBanner[];
  categoryPromoBanners: PromotionalCategoryBanner[];
  products: Array<{
    id: string;
    handle: string;
    title: string;
    price: number | null;
    compareAtPrice: number | null;
    featuredImage: string | null;
    images: unknown;
    tags: unknown;
    categoryId: string | null;
    subcategoryId: string | null;
    isFeatured: boolean;
    displayOrder?: number;
    createdAt?: Date;
    updatedAt?: Date;
  }>;
  collections: Array<{ id: string; handle: string; title: string; image: string | null; isFeatured?: boolean; productHandles?: string[] }>;
  featuredBlogs: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    featuredImage?: string | null;
    publishedAt?: Date | string | null;
    content?: string | null;
  }>;
  homeVideos: PublicVideo[];
  homepageReels: PublicVideo[];
  certificates: CertificateLogo[];
};

export function HomeContentSections({
  categories,
  promoBanners,
  categoryPromoBanners,
  products,
  collections,
  featuredBlogs,
  homeVideos,
  homepageReels,
  certificates,
}: HomeContentSectionsProps) {
  return (
    <>
      <TrustStrip />
      <CategoriesSection categories={categories} />
      <PromoBannerSection banners={promoBanners} />
      <ProductsSection categories={categories} products={products} />
      <PromotionalBannerCarousel banners={categoryPromoBanners} />
      <CollectionsSection collections={collections} />
      <PinkSaltWellnessSection video={homeVideos[0]} />
      <HomepageReelsSection reels={homepageReels} />
      <CertificationsSlider certificates={certificates} />
      <FeaturedBlogSection articles={featuredBlogs} />
      <CustomerVoicesSection />
    </>
  );
}
