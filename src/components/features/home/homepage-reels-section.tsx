"use client";

import { useRef, type MouseEvent } from "react";
import { ChevronLeft, ChevronRight, Play } from "@esmate/shadcn/pkgs/lucide-react";
import type { PublicVideo } from "@/lib/video-utils";

function ReelLink({
  video,
  onClick,
}: {
  video: PublicVideo;
  onClick: (event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <a
      href={video.videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Play TikTok video in a new tab"
      className="group flex aspect-[9/16] w-full flex-col items-center justify-center gap-3 rounded-2xl border border-[#EA580C]/15 bg-black text-white shadow-sm transition hover:border-[#EA580C]/50 hover:bg-gray-950"
      onClick={onClick}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black transition group-hover:scale-105">
        <Play aria-hidden="true" className="ml-1 h-6 w-6 fill-current" />
      </span>
      <span className="text-xs font-semibold">Play video</span>
    </a>
  );
}

export function HomepageReelsSection({ reels }: { reels: PublicVideo[] }) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const dragState = useRef({ startX: 0, scrollLeft: 0, dragging: false, moved: false });
  const activeReels = reels.filter((reel) => reel.active && reel.videoUrl);
  if (!activeReels.length) return null;

  function scroll(direction: -1 | 1) {
    const slider = sliderRef.current;
    if (!slider) return;
    const firstCard = slider.querySelector<HTMLElement>("[data-reel-card]");
    const step = firstCard ? firstCard.offsetWidth + 12 : slider.clientWidth * 0.7;
    slider.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  return (
    <section aria-label="TikTok reels" className="bg-white px-6 py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="relative">
          <div
            ref={sliderRef}
            className="scrollbar-hide flex cursor-grab snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden scroll-smooth pb-1 pt-1 active:cursor-grabbing sm:gap-4"
            onPointerDown={(event) => {
              const slider = sliderRef.current;
              if (!slider) return;
              dragState.current = {
                startX: event.clientX,
                scrollLeft: slider.scrollLeft,
                dragging: true,
                moved: false,
              };
            }}
            onPointerMove={(event) => {
              const slider = sliderRef.current;
              if (!slider || !dragState.current.dragging) return;
              const distance = event.clientX - dragState.current.startX;
              if (Math.abs(distance) > 5) {
                dragState.current.moved = true;
                event.preventDefault();
              }
              slider.scrollLeft = dragState.current.scrollLeft - distance;
            }}
            onPointerUp={() => {
              dragState.current.dragging = false;
            }}
            onPointerCancel={() => {
              dragState.current.dragging = false;
            }}
          >
            {activeReels.map((reel) => (
              <div
                key={reel.id}
                data-reel-card
                className="w-[168px] shrink-0 snap-start sm:w-[200px] md:w-[220px]"
              >
                <ReelLink
                  video={reel}
                  onClick={(event) => {
                    if (dragState.current.moved) {
                      event.preventDefault();
                      dragState.current.moved = false;
                    }
                  }}
                />
              </div>
            ))}
          </div>

          {activeReels.length > 2 ? (
            <>
              <button
                type="button"
                onClick={() => scroll(-1)}
                aria-label="Previous reels"
                className="absolute -left-1 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/95 text-black shadow-md transition hover:scale-105 hover:text-[#EA580C] sm:-left-3 sm:h-10 sm:w-10"
              >
                <ChevronLeft aria-hidden="true" className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scroll(1)}
                aria-label="Next reels"
                className="absolute -right-1 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/95 text-black shadow-md transition hover:scale-105 hover:text-[#EA580C] sm:-right-3 sm:h-10 sm:w-10"
              >
                <ChevronRight aria-hidden="true" className="h-5 w-5" />
              </button>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
