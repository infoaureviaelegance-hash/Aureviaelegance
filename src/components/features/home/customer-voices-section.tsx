"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Star } from "@esmate/shadcn/pkgs/lucide-react";

export type HomepageReview = { id: string; authorName: string; rating: number; content: string };

export function CustomerVoicesSection({ reviews }: { reviews: HomepageReview[] }) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0 });
  if (!reviews.length) return null;

  const scroll = (direction: -1 | 1) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const card = viewport.querySelector<HTMLElement>("[data-review-card]");
    viewport.scrollBy({ left: direction * ((card?.offsetWidth || 280) + 12), behavior: "smooth" });
  };

  return (
    <section className="bg-[#faf8f5] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d84967]">Customer reviews</p>
            <h2 className="mt-1 font-serif text-2xl font-extrabold text-gray-950 sm:text-3xl">Loved by our customers</h2>
          </div>
          {reviews.length > 1 ? (
            <div className="hidden gap-2 sm:flex">
              <button type="button" onClick={() => scroll(-1)} aria-label="Previous review" className="flex h-9 w-9 items-center justify-center rounded-full border border-[#dfd5cc] bg-white text-gray-700 transition hover:border-[#EA580C] hover:text-[#EA580C]"><ChevronLeft className="h-4 w-4" /></button>
              <button type="button" onClick={() => scroll(1)} aria-label="Next review" className="flex h-9 w-9 items-center justify-center rounded-full border border-[#dfd5cc] bg-white text-gray-700 transition hover:border-[#EA580C] hover:text-[#EA580C]"><ChevronRight className="h-4 w-4" /></button>
            </div>
          ) : null}
        </div>
        <div
          ref={viewportRef}
          className="scrollbar-hide flex cursor-grab snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2 active:cursor-grabbing"
          onPointerDown={(event) => {
            const viewport = viewportRef.current;
            if (!viewport) return;
            drag.current = { active: true, startX: event.clientX, scrollLeft: viewport.scrollLeft };
            viewport.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            const viewport = viewportRef.current;
            if (!viewport || !drag.current.active) return;
            viewport.scrollLeft = drag.current.scrollLeft - (event.clientX - drag.current.startX);
          }}
          onPointerUp={(event) => {
            drag.current.active = false;
            const viewport = viewportRef.current;
            if (viewport?.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
          }}
          onPointerCancel={() => { drag.current.active = false; }}
        >
          {reviews.map((review) => (
            <article key={review.id} data-review-card className="w-[82vw] max-w-[310px] shrink-0 snap-start rounded-2xl border border-[#eadfd6] bg-white p-5 sm:w-[300px]">
              <div className="flex gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                {Array.from({ length: 5 }, (_, index) => <Star key={index} aria-hidden="true" className={`h-4 w-4 ${index < review.rating ? "fill-[#EA580C] text-[#EA580C]" : "fill-gray-100 text-gray-200"}`} />)}
              </div>
              <p className="mt-3 line-clamp-4 text-sm leading-6 text-gray-600">&ldquo;{review.content}&rdquo;</p>
              <p className="mt-4 text-sm font-bold text-gray-950">{review.authorName}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
