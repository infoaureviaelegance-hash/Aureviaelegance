"use client";

import { useRef } from "react";
import { Star } from "@esmate/shadcn/pkgs/lucide-react";

export type HomepageReview = { id: string; authorName: string; rating: number; content: string };

export function CustomerVoicesSection({ reviews }: { reviews: HomepageReview[] }) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0 });
  if (!reviews.length) return null;

  return (
    <section id="customer-reviews" aria-labelledby="customer-voices-heading" className="scroll-mt-24 bg-[#f8f4f1] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-9 max-w-2xl sm:mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#a85460]">Customer stories</p>
          <h2 id="customer-voices-heading" className="mt-3 font-serif text-3xl font-semibold tracking-tight text-[#241b18] sm:text-4xl lg:text-5xl">
            Loved by our community
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#6f625d] sm:text-base">
            Thoughtful feedback from customers who made Aurevia Elegance part of their everyday ritual.
          </p>
        </div>
        <div
          ref={viewportRef}
          className="scrollbar-hide flex cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-3 active:cursor-grabbing sm:gap-6"
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
            <article key={review.id} data-review-card className="relative flex min-h-[240px] w-[86vw] max-w-[380px] shrink-0 snap-start flex-col overflow-hidden rounded-[2rem] border border-white/80 bg-white px-6 py-7 shadow-[0_18px_50px_rgba(73,47,38,0.07)] sm:min-h-[265px] sm:w-[360px] sm:px-8 sm:py-8">
              <span aria-hidden="true" className="absolute right-6 top-2 font-serif text-7xl leading-none text-[#a85460]/10 sm:right-8 sm:text-8xl">&ldquo;</span>
              <div className="relative flex gap-1" aria-label={`${review.rating} out of 5 stars`}>
                {Array.from({ length: 5 }, (_, index) => <Star key={index} aria-hidden="true" className={`h-4 w-4 ${index < review.rating ? "fill-[#EA580C] text-[#EA580C]" : "fill-gray-100 text-gray-200"}`} />)}
              </div>
              <p className="relative mt-6 line-clamp-5 font-serif text-lg leading-8 text-[#493d38]">&ldquo;{review.content}&rdquo;</p>
              <div className="mt-auto pt-7">
                <div className="mb-3 h-px w-10 bg-[#a85460]/35" />
                <p className="text-sm font-semibold tracking-wide text-[#241b18]">{review.authorName}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#8a7b75]">Customer review</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
