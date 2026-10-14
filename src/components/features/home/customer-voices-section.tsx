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
    <section id="customer-reviews" aria-labelledby="customer-voices-heading" className="scroll-mt-24 overflow-hidden bg-[#f4f5f7] px-4 py-12 sm:px-6 sm:py-16 lg:py-13">
      <div className="mx-auto max-w-[1512px]">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <span className="inline-block rounded-full bg-[#fff0dc] px-4 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#f05a00] sm:text-xs">
            Customer Voices
          </span>
          <h2 id="customer-voices-heading" className="mt-3 font-serif text-4xl font-extrabold leading-tight tracking-[-0.025em] text-[#071a32] sm:text-5xl">
            What Our Customers Say
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-base leading-7 text-[#30435a] sm:text-lg">
            Trusted by buyers who value performance, reliability, and support.
          </p>
        </div>

        <div className="relative">
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-x-1/3 -translate-y-1/2 items-center justify-center rounded-full border border-[#eee7dc] bg-[#fffaf2] text-[#071a32] shadow-[0_2px_8px_rgba(15,23,42,0.12)] transition-all hover:scale-105 hover:bg-white disabled:opacity-30 disabled:hover:scale-100"
            disabled={currentIndex === 0}
            aria-label="Previous reviews"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div
            ref={viewportRef}
            className="scrollbar-hide flex cursor-grab snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-1 active:cursor-grabbing"
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
              <article key={review.id} data-review-card className="relative flex min-h-[190px] w-[86vw] shrink-0 snap-start flex-col rounded-2xl border border-[#efd8ab] bg-[#f7f4ec] px-6 py-7 sm:w-[calc((100%_-_1.5rem)/2)] lg:w-[calc((100%_-_3rem)/3)]">
                <div className="relative flex gap-1" aria-label={`${review.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      aria-hidden="true"
                      className={`h-4 w-4 ${index < review.rating ? "fill-[#dca313] text-[#dca313]" : "fill-[#d7d0c7] text-[#d7d0c7]"}`}
                    />
                  ))}
                </div>

                <p className="relative mt-4 line-clamp-3 text-sm leading-6 text-[#5d625f]">
                  &ldquo;{review.content}&rdquo;
                </p>

                <div className="mt-auto pt-4">
                  <p className="text-base font-semibold text-[#171717]">{review.authorName}</p>
                </div>
              </article>
            ))}
          </div>

          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 z-10 flex h-10 w-10 translate-x-1/3 -translate-y-1/2 items-center justify-center rounded-full border border-[#eee7dc] bg-[#fffaf2] text-[#071a32] shadow-[0_2px_8px_rgba(15,23,42,0.12)] transition-all hover:scale-105 hover:bg-white disabled:opacity-30 disabled:hover:scale-100"
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
