"use client";

import { useRef, useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "@esmate/shadcn/pkgs/lucide-react";

export type HomepageReview = { id: string; authorName: string; rating: number; content: string };

export function CustomerVoicesSection({ reviews }: { reviews: HomepageReview[] }) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0 });
  const [currentIndex, setCurrentIndex] = useState(0);
  if (!reviews.length) return null;

  const scrollLeft = () => {
    if (viewportRef.current) {
      viewportRef.current.scrollBy({ left: -400, behavior: "smooth" });
      setCurrentIndex(Math.max(0, currentIndex - 1));
    }
  };

  const scrollRight = () => {
    if (viewportRef.current) {
      viewportRef.current.scrollBy({ left: 400, behavior: "smooth" });
      setCurrentIndex(Math.min(reviews.length - 1, currentIndex + 1));
    }
  };

  return (
    <section id="customer-reviews" aria-labelledby="customer-voices-heading" className="scroll-mt-24 bg-[#f5f0eb] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[1500px]">
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
          <span className="inline-block rounded-full border border-[#f0be8d] bg-[#f7e7d8] px-5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#d9873b] sm:text-[11px]">
            Customer Voices
          </span>
          <h2 id="customer-voices-heading" className="mt-5 text-[clamp(3rem,5vw,7rem)] font-black leading-[0.95] tracking-[-0.07em] text-[#1b1716]">
            What Our Customers Say
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#5d514d] sm:text-[1.2rem]">
            Trusted by buyers who value performance, reliability, and support.
          </p>
        </div>

        <div className="relative">
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#e7ddd1] bg-white/90 text-[#221b18] shadow-[0_10px_24px_rgba(40,28,22,0.08)] transition-all hover:scale-105 hover:bg-white disabled:opacity-30 disabled:hover:scale-100"
            disabled={currentIndex === 0}
            aria-label="Previous reviews"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div
            ref={viewportRef}
            className="scrollbar-hide flex cursor-grab snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-4 pb-2 pt-1 active:cursor-grabbing sm:px-8 lg:px-12"
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
              <article key={review.id} data-review-card className="relative flex min-h-[240px] w-[90vw] max-w-[420px] shrink-0 snap-start flex-col overflow-hidden rounded-[1.65rem] border border-[#e8dfd5] bg-[#efe9e2] px-5 py-5 shadow-[0_8px_30px_rgba(73,47,38,0.06)] sm:min-h-[260px] sm:w-[380px] sm:px-6 sm:py-6 lg:w-[390px]">
                <div className="relative flex gap-1" aria-label={`${review.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      aria-hidden="true"
                      className={`h-5 w-5 ${index < review.rating ? "fill-[#d8a33a] text-[#d8a33a]" : "fill-[#d7d0c7] text-[#d7d0c7]"}`}
                    />
                  ))}
                </div>

                <p className="relative mt-6 line-clamp-4 text-base leading-7 tracking-[-0.02em] text-[#211c1a] sm:text-[1.08rem]">
                  &ldquo;{review.content}&rdquo;
                </p>

                <div className="mt-auto pt-6">
                  <p className="text-[1.05rem] font-semibold tracking-[-0.03em] text-[#221b18]">{review.authorName}</p>
                </div>
              </article>
            ))}
          </div>

          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 z-10 flex h-11 w-11 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#e7ddd1] bg-white/90 text-[#221b18] shadow-[0_10px_24px_rgba(40,28,22,0.08)] transition-all hover:scale-105 hover:bg-white disabled:opacity-30 disabled:hover:scale-100"
            disabled={currentIndex >= reviews.length - 1}
            aria-label="Next reviews"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
