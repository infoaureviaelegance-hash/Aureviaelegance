import { Metadata } from "next";
import { getCategoriesForFilters, getProductsPage } from "./service";
import { ProductsPageContent } from "./_components/products-page-content";
import { createSeoMetadata } from "@/lib/seo";

export const revalidate = 60;

/* ---------------- SEO METADATA ---------------- */

export async function generateMetadata({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }): Promise<Metadata> {
  const query = await searchParams;
  const filtered = Boolean(query.q || query.category || query.min || query.max || query.sort);
  const page = Math.max(1, Number(query.page) || 1);
  return createSeoMetadata({
    title: page > 1 ? `Beauty & Lifestyle Products – Page ${page}` : "Shop Beauty & Lifestyle Products Online",
    description: "Shop skincare, makeup, fragrance, hair care, jewelry, watches and beauty accessories online from Aurevia Elegance in Pakistan.",
    path: page > 1 && !filtered ? `/products?page=${page}` : "/products",
    keywords: ["beauty products online Pakistan", "skincare products Pakistan", "makeup online Pakistan", "fragrances Pakistan", "beauty accessories online"],
    noIndex: filtered,
  });
}

/* ---------------- PAGE ---------------- */

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; min?: string; max?: string; sort?: string; page?: string }>;
}) {
  const query = await searchParams;
  const page = Math.max(1, Number(query.page) || 1);
  const min = query.min === undefined || query.min === "" ? undefined : Math.max(0, Number(query.min));
  const max = query.max === undefined || query.max === "" ? undefined : Math.max(0, Number(query.max));
  let categories: Awaited<ReturnType<typeof getCategoriesForFilters>> = [];
  let result: Awaited<ReturnType<typeof getProductsPage>> = { products: [], total: 0, totalPages: 1 };

  try {
    [categories, result] = await Promise.all([
      getCategoriesForFilters(),
      getProductsPage({ q: query.q?.trim(), category: query.category?.trim(), min: Number.isFinite(min) ? min : undefined, max: Number.isFinite(max) ? max : undefined, sort: query.sort, page, pageSize: 24 }),
    ]);
  } catch (error) {
    console.error("Failed to load products:", error);
  }

  return (
    <ProductsPageContent
      categories={categories}
      products={result.products}
      page={page}
      totalPages={result.totalPages}
      total={result.total}
      query={query}
    />
  );
}

