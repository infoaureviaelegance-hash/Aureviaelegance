import Link from "next/link";
import { StoreProductCard } from "@/components/features/products/store-product-card-wrapper";

const FALLBACK_IMAGE = "/logo/auerviamaison.png";

type Category = { id: string; name: string; slug: string; order: number; subcategories: Array<{ id: string; name: string; slug: string; parentId: string | null; order: number }> };
type Product = { id: string; handle: string; title: string; price: number; compareAtPrice: number | null; featuredImage: string | null; images: unknown; tags: unknown };

export function ProductsFiltered({
  categories, products, page, totalPages, total, query,
}: {
  categories: Category[];
  products: Product[];
  page: number;
  totalPages: number;
  total: number;
  query: Record<string, string | undefined>;
}) {
  const pageHref = (nextPage: number) => {
    const params = new URLSearchParams(Object.entries(query).filter((entry): entry is [string, string] => Boolean(entry[1])));
    params.set("page", String(nextPage));
    return `/products?${params.toString()}`;
  };
  return (
    <section className="min-w-0 space-y-6">
      <nav aria-label="Product categories" className="overflow-hidden border-y border-[#eadfd6] bg-white py-3">
        <div className="products-category-name-track flex w-max items-center gap-8 whitespace-nowrap px-4">
          {[0, 1].map((copy) => (
            <div key={copy} aria-hidden={copy === 1} className="flex items-center gap-8">
              <Link href="/products" className="text-[15px] font-semibold text-[#EA580C] transition-colors hover:text-[#a93f08]">All</Link>
              {categories.map((category) => (
                <Link key={`${copy}-${category.id}`} href={`/category/${encodeURIComponent(category.slug)}`} className="text-[15px] font-semibold text-gray-700 transition-colors hover:text-[#EA580C]">{category.name}</Link>
              ))}
            </div>
          ))}
        </div>
      </nav>
      <p className="text-sm text-[#5A5E55]">{total} product{total === 1 ? "" : "s"} found</p>
      {products.length ? <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-6">{products.map((product) => {
        const images = Array.isArray(product.images) ? product.images.filter((item): item is string => typeof item === "string") : [];
        const tags = Array.isArray(product.tags) ? product.tags.filter((item): item is string => typeof item === "string") : [];
        return <StoreProductCard key={product.handle} handle={product.handle} title={product.title} featuredImageUrl={product.featuredImage || images[0] || FALLBACK_IMAGE} imageUrls={images} price={{ amount: product.price.toFixed(2), currencyCode: "PKR" }} compareAtPrice={product.compareAtPrice ? { amount: product.compareAtPrice.toFixed(2), currencyCode: "PKR" } : null} tag={tags[0]} productId={product.id} />;
      })}</div> : <div className="rounded-2xl border bg-white p-12 text-center"><h2 className="text-xl font-semibold">No products found</h2><p className="mt-2 text-[#5A5E55]">Try removing a filter or using a broader search.</p></div>}
      {totalPages > 1 && <nav aria-label="Product pagination" className="flex items-center justify-center gap-4">{page > 1 && <Link href={pageHref(page - 1)}>← Previous</Link>}<span>Page {page} of {totalPages}</span>{page < totalPages && <Link href={pageHref(page + 1)}>Next →</Link>}</nav>}
    </section>
  );
}
