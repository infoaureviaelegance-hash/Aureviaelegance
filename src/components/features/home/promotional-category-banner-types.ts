export type PromotionalCategoryBanner = {
  id: string;
  image: string;
  heading: string;
  description: string;
  ctaLabel: string;
  href: string;
  order: number;
  isActive: boolean;
};

export function parsePromotionalCategoryBanners(value: unknown): PromotionalCategoryBanner[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is PromotionalCategoryBanner => {
      if (!item || typeof item !== "object") return false;
      const banner = item as Partial<PromotionalCategoryBanner>;
      return typeof banner.id === "string" && typeof banner.image === "string" && typeof banner.heading === "string" && typeof banner.href === "string";
    })
    .map((banner) => ({
      ...banner,
      description: typeof banner.description === "string" ? banner.description : "",
      ctaLabel: typeof banner.ctaLabel === "string" && banner.ctaLabel ? banner.ctaLabel : "Shop Now",
      order: Number.isFinite(banner.order) ? banner.order : 0,
      isActive: banner.isActive !== false,
    }))
    .sort((a, b) => a.order - b.order);
}
