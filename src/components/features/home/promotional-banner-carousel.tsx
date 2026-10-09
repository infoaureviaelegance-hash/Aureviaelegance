"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "@esmate/shadcn/pkgs/lucide-react";
import type { PromotionalCategoryBanner } from "./promotional-category-banner-types";

export function PromotionalBannerCarousel({ banners }: { banners: PromotionalCategoryBanner[] }) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });
  const visibleBanners = banners.filter((banner) => banner.isActive).sort((a, b) => a.order - b.order);
  if (!visibleBanners.length) return null;

  const move = (direction: -1 | 1) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    viewport.scrollBy({ left: direction * viewport.clientWidth, behavior: "smooth" });
  };

  return (
    <section className="bg-[#f8f4ef] px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between gap-5 sm:mb-10">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#d84967]">Shop by mood</p>
            <h2 className="mt-2 font-serif text-3xl font-extrabold text-[#1a1308] sm:text-4xl">Find your next signature look</h2>
          </div>
          {visibleBanners.length > 2 ? (
            <div className="hidden items-center gap-2 md:flex">
              <button type="button" onClick={() => move(-1)} aria-label="Previous promotional banners" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d9c9ba] bg-white text-[#1a1308] transition hover:border-[#EA580C] hover:text-[#EA580C]"><ArrowLeft className="h-4 w-4" /></button>
              <button type="button" onClick={() => move(1)} aria-label="Next promotional banners" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d9c9ba] bg-white text-[#1a1308] transition hover:border-[#EA580C] hover:text-[#EA580C]"><ArrowRight className="h-4 w-4" /></button>
            </div>
          ) : null}
        </div>
        <div
          ref={viewportRef}
          className="scrollbar-hide cursor-grab snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth active:cursor-grabbing"
          onPointerDown={(event) => {
            const viewport = viewportRef.current;
            if (!viewport) return;
            drag.current = { active: true, startX: event.clientX, scrollLeft: viewport.scrollLeft, moved: false };
            viewport.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            const viewport = viewportRef.current;
            if (!viewport || !drag.current.active) return;
            const distance = event.clientX - drag.current.startX;
            if (Math.abs(distance) > 5) drag.current.moved = true;
            viewport.scrollLeft = drag.current.scrollLeft - distance;
          }}
          onPointerUp={(event) => {
            const viewport = viewportRef.current;
            drag.current.active = false;
            if (viewport?.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
          }}
          onPointerCancel={() => { drag.current.active = false; }}
          onClickCapture={(event) => {
            if (!drag.current.moved) return;
            event.preventDefault();
            event.stopPropagation();
            drag.current.moved = false;
          }}
        >
          <div className="flex gap-4">
            {visibleBanners.map((banner) => (
              <Link key={banner.id} href={banner.href} draggable={false} className="group relative min-h-[340px] w-full shrink-0 snap-start overflow-hidden rounded-[1.75rem] bg-[#1a1308] shadow-[0_14px_35px_-24px_rgba(26,19,8,0.65)] md:w-[calc(50%_-_0.5rem)]">
                <Image src={banner.image} alt={banner.heading} fill draggable={false} sizes="(min-width: 768px) 50vw, 100vw" className="pointer-events-none select-none object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/5" />
                <div className="absolute inset-x-0 bottom-0 max-w-lg p-6 text-white sm:p-8">
                  <h3 className="font-serif text-2xl font-extrabold sm:text-3xl">{banner.heading}</h3>
                  {banner.description ? <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/75 sm:text-base">{banner.description}</p> : null}
                  <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#1a1308] transition group-hover:bg-[#EA580C] group-hover:text-white">{banner.ctaLabel}<ArrowUpRight className="h-4 w-4" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
