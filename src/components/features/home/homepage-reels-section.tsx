"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play } from "@esmate/shadcn/pkgs/lucide-react";
import type { PublicVideo } from "@/lib/video-utils";

function reelPlayerUrl(embedUrl: string) {
  const url = new URL(embedUrl);
  url.searchParams.set("autoplay", "1");
  url.searchParams.set("controls", "1");
  url.searchParams.set("description", "0");
  url.searchParams.set("music_info", "0");
  url.searchParams.set("rel", "0");
  url.searchParams.set("loop", "1");
  return url.toString();
}

function ReelPlayer({
  video,
  onClick,
}: {
  video: PublicVideo;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  const [playing, setPlaying] = useState(false);
  const [thumbnail, setThumbnail] = useState(video.thumbnail);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (thumbnail || playing || !cardRef.current) return;

    const controller = new AbortController();
    const loadThumbnail = () => {
      void fetch(`/api/videos/tiktok-thumbnail?url=${encodeURIComponent(video.videoUrl)}`, {
        signal: controller.signal,
      })
        .then(async (response) => {
          if (!response.ok) throw new Error(`Unable to load reel thumbnail (${response.status})`);
          const data: unknown = await response.json();
          if (!data || typeof data !== "object" || !("thumbnailUrl" in data) || typeof data.thumbnailUrl !== "string") {
            throw new Error("TikTok returned an invalid thumbnail response");
          }
          setThumbnail(data.thumbnailUrl);
        })
        .catch((error: unknown) => {
          if (!controller.signal.aborted) console.error("Unable to load TikTok reel thumbnail", error);
        });
    };

    if (typeof IntersectionObserver === "undefined") {
      loadThumbnail();
      return () => controller.abort();
    }

    const card = cardRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        loadThumbnail();
      },
      { rootMargin: "300px" },
    );
    observer.observe(card);

    return () => {
      observer.disconnect();
      controller.abort();
    };
  }, [playing, thumbnail, video.videoUrl]);

  return (
    <div ref={cardRef} className="aspect-[9/16] w-full overflow-hidden rounded-2xl border border-[#EA580C]/15 bg-black shadow-sm">
      {playing && video.embedUrl ? (
        <iframe
          src={reelPlayerUrl(video.embedUrl)}
          title="TikTok video"
          className="h-full w-full border-0"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          aria-label="Play TikTok video"
          className="group relative flex h-full w-full items-center justify-center bg-gray-950 text-white"
          onClick={(event) => {
            onClick(event);
            if (!event.defaultPrevented) setPlaying(true);
          }}
        >
          {thumbnail ? (
            <Image src={thumbnail} alt="" fill unoptimized sizes="220px" className="object-cover" />
          ) : null}
          <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-md transition group-hover:scale-105">
            <Play aria-hidden="true" className="ml-1 h-6 w-6 fill-current" />
          </span>
        </button>
      )}
    </div>
  );
}

export function HomepageReelsSection({ reels }: { reels: PublicVideo[] }) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const dragState = useRef({ startX: 0, scrollLeft: 0, dragging: false, moved: false });
  const activeReels = reels.filter((reel) => reel.active && reel.videoUrl && reel.embedUrl);
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
                <ReelPlayer
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
