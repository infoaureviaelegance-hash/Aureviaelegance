"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "@esmate/shadcn/pkgs/lucide-react";
import { StoreProductCard } from "@/components/features/products/store-product-card-wrapper";

const FALLBACK_IMAGE = "/logo/auerviamaison.png";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image: string | null;
  parentId?: string | null;
  order?: number;
  homepageRow?: number | null;
  promoEnabled?: boolean;
  promoTitle?: string | null;
  promoDescription?: string | null;
  promoImage?: string | null;
  promoButtonText?: string | null;
  promoOrder?: number;
}

interface Product {
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
}

interface Collection {
  id: string;
  handle: string;
  title: string;
  image: string | null;
  isFeatured?: boolean;
  productHandles?: string[];
}

export function CategoriesSection({ categories }: { categories: Category[] }) {
  const mainCategories = categories.filter((category) => !category.parentId);
  const categoriesViewportRef = useRef<HTMLDivElement | null>(null);
  const categoryDrag = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });

  const handleCategoryPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const viewport = categoriesViewportRef.current;
    if (!viewport) return;
    categoryDrag.current = {
      active: true,
      startX: event.clientX,
      scrollLeft: viewport.scrollLeft,
      moved: false,
    };
    viewport.setPointerCapture(event.pointerId);
    viewport.classList.add("is-dragging");
  };

  const handleCategoryPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const viewport = categoriesViewportRef.current;
    if (!viewport || !categoryDrag.current.active) return;
    const distance = event.clientX - categoryDrag.current.startX;
    if (Math.abs(distance) > 4) categoryDrag.current.moved = true;
    viewport.scrollLeft = categoryDrag.current.scrollLeft - distance;
  };

  const handleCategoryPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const viewport = categoriesViewportRef.current;
    if (!viewport || !categoryDrag.current.active) return;
    categoryDrag.current.active = false;
    if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
    viewport.classList.remove("is-dragging");
  };

  return (
    <section className="storefront-categories relative z-20 mt-6 bg-white lg:mx-auto lg:max-w-7xl sm:mt-9">

      <div
        ref={categoriesViewportRef}
        className="relative flex cursor-grab overflow-x-auto overflow-y-hidden px-2 scrollbar-hide sm:px-3 lg:px-4"
        onPointerDown={handleCategoryPointerDown}
        onPointerMove={handleCategoryPointerMove}
        onPointerUp={handleCategoryPointerUp}
        onPointerCancel={handleCategoryPointerUp}
        onClickCapture={(event) => {
          if (categoryDrag.current.moved) {
            event.preventDefault();
            event.stopPropagation();
            categoryDrag.current.moved = false;
          }
        }}
      >
        <div className="category-marquee-track scrollbar-hide">
          {[0, 1].map((copy) => (
            <div key={copy} className="category-marquee-group" aria-hidden={copy === 1 || undefined}>
              {mainCategories.map((category) => (
                <Link
                  key={`${copy}-${category.id}`}
                  href={`/category/${encodeURIComponent(category.slug)}`}
                  tabIndex={copy === 1 ? -1 : undefined}
                  className="category-card group relative h-[12rem] w-[9rem] flex-shrink-0 overflow-hidden rounded-2xl bg-transparent text-white sm:h-[14rem] sm:w-[10.5rem] md:h-[16rem] md:w-[12rem]"
                >
                  <div className="absolute inset-0">
                    <Image
                      src={category.image || FALLBACK_IMAGE}
                      alt={category.name}
                      fill
                      sizes="(max-width: 640px) 160px, (max-width: 768px) 190px, 220px"
                      className="object-contain transition-transform duration-1000 ease-out group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/65" />
                  </div>
                  <span className="absolute bottom-3 left-3 right-10 line-clamp-2 text-left text-xs font-semibold uppercase leading-tight text-white sm:bottom-4 sm:left-4 sm:right-12 sm:text-sm">{category.name}</span>
                  <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#d84967] text-base text-white sm:bottom-4 sm:right-4 sm:h-9 sm:w-9 sm:text-lg" aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          ))}
        </div>
        </div>
    </section>
  );
}

function MovingProductRow({ row, products, productCard }: {
  row: 1 | 2 | 3;
  products: Product[];
  productCard: (product: Product) => React.ReactNode;
}) {
  const [paused, setPaused] = useState(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const dragState = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });
  if (!products.length) return null;

  const minimumItems = 8;
  const repeatCount = Math.max(1, Math.ceil(minimumItems / products.length));
  const loopItems = Array.from({ length: repeatCount }, () => products).flat();
  const movingItems = row === 2 ? loopItems : [...loopItems, ...loopItems];
  const pauseTemporarily = () => {
    setPaused(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setPaused(false), 1800);
  };

  return (
    <section aria-label={`Featured products row ${row}`}>
      <div
        ref={viewportRef}
        className={`scrollbar-hide overflow-x-auto overflow-y-hidden py-1 ${row === 2 ? "cursor-grab touch-pan-y active:cursor-grabbing" : ""}`}
        onMouseEnter={row === 2 ? undefined : () => setPaused(true)}
        onMouseLeave={row === 2 ? undefined : () => setPaused(false)}
        onPointerDown={row === 2 ? (event) => {
          if (event.pointerType === "mouse" && event.button !== 0) return;
          const viewport = viewportRef.current;
          if (!viewport) return;
          dragState.current = { active: true, startX: event.clientX, scrollLeft: viewport.scrollLeft, moved: false };
          viewport.setPointerCapture(event.pointerId);
        } : pauseTemporarily}
        onPointerMove={row === 2 ? (event) => {
          const viewport = viewportRef.current;
          if (!viewport || !dragState.current.active) return;
          const distance = event.clientX - dragState.current.startX;
          if (Math.abs(distance) > 5) dragState.current.moved = true;
          viewport.scrollLeft = dragState.current.scrollLeft - distance;
        } : undefined}
        onPointerUp={row === 2 ? (event) => {
          dragState.current.active = false;
          if (viewportRef.current?.hasPointerCapture(event.pointerId)) {
            viewportRef.current.releasePointerCapture(event.pointerId);
          }
        } : undefined}
        onPointerCancel={row === 2 ? () => { dragState.current.active = false; } : undefined}
        onClickCapture={row === 2 ? (event) => {
          if (!dragState.current.moved) return;
          event.preventDefault();
          event.stopPropagation();
          dragState.current.moved = false;
        } : undefined}
        onTouchStart={row === 2 ? undefined : pauseTemporarily}
        onScroll={row === 2 ? undefined : pauseTemporarily}
      >
        <div
          className={`homepage-product-track flex w-max gap-3 sm:gap-6 ${row === 3 ? "homepage-product-track-reverse" : ""}`}
          style={{
            animation: row === 2 ? "none" : undefined,
            animationDuration: `${Math.max(42, loopItems.length * 7)}s`,
            animationPlayState: paused ? "paused" : "running",
          }}
        >
          {movingItems.map((product, index) => (
            <div key={`${product.handle}-${index}`} className="w-[calc((100vw-2.75rem)/2)] shrink-0 sm:w-[14rem] lg:w-[16rem]">
              {productCard(product)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CollectionSlider({ collections }: { collections: Collection[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerPage = 3;

  const currentCollections = collections || [];
  const totalSlides = currentCollections.length > itemsPerPage ? currentCollections.length : 1;
  const visibleCount = Math.min(itemsPerPage, currentCollections.length);
  const displayCollections = Array.from(
    { length: visibleCount },
    (_, offset) => currentCollections[(currentSlide + offset) % currentCollections.length],
  );

  useEffect(() => {
    if (totalSlides <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 6000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  if (displayCollections.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <div className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 transition-opacity duration-1000 ease-in-out sm:grid sm:grid-cols-3 sm:justify-items-center sm:gap-5 sm:overflow-visible sm:pb-0">
        {displayCollections.map((collection) => (
          <Link
            key={collection.id}
            href="/products"
            className="group w-[78vw] max-w-[300px] shrink-0 snap-start overflow-hidden rounded-xl border border-[#C6A24A]/20 bg-white sm:w-full sm:max-w-[340px]"
          >
            <div className="relative aspect-[40/37]">
              <Image
                src={collection.image || FALLBACK_IMAGE}
                alt={collection.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3 text-base font-semibold text-white">
                {collection.title}
              </div>
            </div>
          </Link>
        ))}
      </div>
      {totalSlides > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "w-6 bg-[#f6a45d]" : "w-2 bg-gray-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ProductsSection({ categories, products }: { categories: Category[]; products: Product[] }) {
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const resolveRow = (product: Product) => {
    const directCategory = categoryById.get(product.subcategoryId || product.categoryId || "");
    if (directCategory?.homepageRow) return directCategory.homepageRow;
    return directCategory?.parentId ? categoryById.get(directCategory.parentId)?.homepageRow ?? null : null;
  };
  const featuredProducts = products
    .filter((product) => product.isFeatured)
    .sort((a, b) => (a.displayOrder ?? 9999) - (b.displayOrder ?? 9999) || a.title.localeCompare(b.title));
  const categoryIncludesProduct = (categoryId: string, product: Product) => {
    const productCategoryIds = [product.categoryId, product.subcategoryId].filter(Boolean);
    if (productCategoryIds.includes(categoryId)) return true;
    return productCategoryIds.some((id) => categoryById.get(id || "")?.parentId === categoryId);
  };
  const filterCategories = categories
    .filter((category) => !category.parentId && featuredProducts.some((product) => resolveRow(product) && categoryIncludesProduct(category.id, product)))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name));
  const visibleProducts = selectedCategoryId === "all"
    ? featuredProducts
    : featuredProducts.filter((product) => categoryIncludesProduct(selectedCategoryId, product));
  const rows = ([1, 2, 3] as const).map((row) => ({
    row,
    products: visibleProducts.filter((product) => resolveRow(product) === row),
  })).filter((row) => row.products.length > 0);

  const productCard = (product: Product) => {
    const productImageUrls = Array.isArray(product.images)
      ? product.images.filter((x): x is string => typeof x === "string")
      : [];
    const firstImage = productImageUrls[0] || null;
    const firstTag = Array.isArray(product.tags)
      ? product.tags.find((x): x is string => typeof x === "string")
      : undefined;
    return (
      <StoreProductCard
        key={product.handle}
        handle={product.handle}
        title={product.title}
        featuredImageUrl={product.featuredImage || firstImage || FALLBACK_IMAGE}
        imageUrls={productImageUrls}
        price={{ amount: Number(product.price || 0).toFixed(2), currencyCode: "PKR" }}
        compareAtPrice={product.compareAtPrice ? { amount: Number(product.compareAtPrice).toFixed(2), currencyCode: "PKR" } : null}
        tag={firstTag}
        productId={product.id}
      />
    );
  };

  return (
    <>
      {rows.length > 0 && (
        <section className="mx-auto w-full max-w-7xl bg-white px-4 pb-5 pt-8 sm:px-6 sm:pb-6 sm:pt-10 lg:px-8 lg:pb-7 lg:pt-12">
          <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-10">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#d84967]">Curated for you</p>
            <h2 className="mt-2 font-serif text-3xl font-extrabold text-gray-950 sm:text-4xl lg:text-5xl">Our Products</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">Explore our collection of carefully selected beauty, fashion, and lifestyle essentials.</p>
          </div>
          <div className="scrollbar-hide mb-8 flex items-center gap-2 overflow-x-auto pb-1 sm:mb-10 sm:justify-center" aria-label="Filter featured products by category">
            <button
              type="button"
              onClick={() => setSelectedCategoryId("all")}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors ${selectedCategoryId === "all" ? "bg-[#1a1308] text-white" : "bg-[#f7eee8] text-[#5f4638] hover:bg-[#eeddd2]"}`}
            >
              All
            </button>
            {filterCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategoryId(category.id)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors ${selectedCategoryId === category.id ? "bg-[#EA580C] text-white" : "bg-[#f7eee8] text-[#5f4638] hover:bg-[#eeddd2]"}`}
              >
                {category.name}
              </button>
            ))}
          </div>
          <div className="space-y-8 sm:space-y-10">
            {rows.map((row) => (
              <MovingProductRow
                key={row.row}
                row={row.row}
                products={row.products}
                productCard={productCard}
              />
            ))}
          </div>
          <div className="mt-10 text-center sm:mt-12">
            <Link href="/products" className="inline-flex items-center gap-2 rounded-full bg-[#EA580C] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#c2410c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C]">
              View All Products<ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )}
    </>
  );
}

export function CollectionsSection({ collections }: { collections: Collection[] }) {
  return (
    <section className="mx-auto w-full max-w-7xl bg-gray-50 px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8 lg:px-8 lg:pb-12 lg:pt-9">
      <div className="mx-auto mb-6 max-w-3xl space-y-3 text-center sm:mb-8">
        <span className="inline-flex rounded-full bg-[#ffedd5] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#ea580c] sm:px-4 sm:py-1.5 sm:text-xs">
          Collections
        </span>
        <h2 className="font-serif text-2xl font-extrabold text-gray-900 sm:text-3xl sm:text-4xl lg:text-5xl">
          Curated Collections
        </h2>
      </div>
      <CollectionSlider collections={collections.filter((collection) => collection.isFeatured !== false)} />
    </section>
  );
}
