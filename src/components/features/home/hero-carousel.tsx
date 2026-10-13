"use client";

import { useCallback, useEffect, useState } from "react";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "@esmate/shadcn/pkgs/lucide-react";
import { HeroSlide } from "@/types/hero";

interface HeroCarouselProps {
  slides: HeroSlide[];
}

const AUTOPLAY_MS = 6000;

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentActive = active < slides.length ? active : 0;

  const goTo = useCallback(
    (index: number) => {
      if (slides.length === 0) return;

      setActive(((index % slides.length) + slides.length) % slides.length);
    },
    [slides.length],
  );

  const next = useCallback(() => {
    if (slides.length <= 1) return;

    setActive((current) => (current + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    if (slides.length <= 1) return;

    setActive((current) => (current - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;

    const timer = window.setTimeout(next, AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [active, isPaused, next, slides.length]);

  if (slides.length === 0) return null;

  return (
    <section
      aria-label="Featured collections"
      aria-roledescription="carousel"
      className="relative aspect-video h-auto min-h-0 w-full overflow-hidden bg-[#fffdf8] md:aspect-auto md:h-[calc(100svh-4rem)] md:min-h-[30rem] lg:h-[calc(100svh-7.5rem)]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      {slides.map((slide, index) => {
        const isActive = index === currentActive;
        const responsiveImage = slide.mobileImageUrl
          ? {
              desktop: getImageProps({ src: slide.imageUrl, alt: slide.imageAlt, fill: true, priority: index === 0, sizes: "100vw" }).props,
              mobile: getImageProps({ src: slide.mobileImageUrl, alt: slide.imageAlt, fill: true, priority: index === 0, sizes: "100vw" }).props,
            }
          : null;

        return (
          <div
            key={slide.id}
            aria-hidden={!isActive}
            className={`absolute inset-x-0 top-0 aspect-video overflow-hidden transition-opacity duration-1000 ease-in-out md:inset-0 md:aspect-auto ${
              isActive ? "z-0 opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            {responsiveImage ? (
              <picture>
                <source media="(max-width: 767px)" srcSet={responsiveImage.mobile.srcSet} />
                <img {...responsiveImage.desktop} alt={slide.imageAlt} className="object-cover" />
              </picture>
            ) : (
              <Image
                src={slide.imageUrl}
                alt={slide.imageAlt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
            )}
          </div>
        );
      })}

      <div aria-hidden="true" className="hero-copy-scrim absolute inset-0 z-1" />

      <div className="absolute inset-0 z-10">
        {slides.map((slide, index) => {
          const isActive = index === currentActive;

          return (
            <div
              key={slide.id}
              aria-hidden={!isActive}
              className={`absolute inset-x-0 top-0 flex aspect-video items-center px-5 py-0 transition-all duration-700 ease-out sm:px-8 md:inset-0 md:aspect-auto md:px-12 md:py-8 lg:px-16 xl:px-20 ${
                isActive
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-5 opacity-0"
              }`}
            >
              <div className="w-[64%] min-w-0 max-w-162.5 text-left md:w-full md:-translate-y-1">
                {slide.eyebrow && (
                  <div className="mb-2 flex items-center gap-1.5 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#34343a] sm:mb-3 sm:text-[10px] md:mb-5 md:gap-3 md:text-[11px] md:tracking-[0.24em]">
                    <span aria-hidden="true" className="h-px w-4 shrink-0 bg-[#c97a42] sm:w-6 md:w-9" />
                    <span>{slide.eyebrow}</span>
                    <span aria-hidden="true" className="h-px w-4 shrink-0 bg-[#c97a42] sm:w-6 md:w-9" />
                  </div>
                )}

                <h1 className="max-w-162.5 break-words font-serif text-[clamp(1.3rem,6vw,2.1rem)] font-semibold leading-[1.02] text-[#101014] max-md:[text-shadow:0_1px_8px_rgba(255,255,255,0.55)] md:text-6xl md:leading-[0.98] lg:text-7xl">
                  <span>{slide.title}</span>
                  {slide.titleHighlight && (
                    <span
                      className="block bg-clip-text text-transparent"
                      style={{
                        backgroundImage: "linear-gradient(100deg, #c94560 0%, #d85852 55%, #cf812f 100%)",
                      }}
                    >
                      {slide.titleHighlight}
                    </span>
                  )}
                </h1>

                {slide.description && (
                  <p className="mt-2 max-w-127.5 text-[10px] font-normal leading-[1.35] text-[#414047] max-md:-ml-1 sm:text-xs md:mt-4 md:text-lg md:leading-[1.55]">
                    {slide.description}
                  </p>
                )}

                {(slide.ctaPrimaryLabel || slide.ctaSecondaryLabel) && (
                  <div className="mt-2 flex flex-col items-start gap-1.5 md:mt-7 md:flex-row md:items-center md:gap-3">
                    {slide.ctaPrimaryLabel && (
                      <Link
                        href={slide.ctaPrimaryHref || "#"}
                        tabIndex={isActive ? 0 : -1}
                        className="group inline-flex min-h-7 w-fit max-w-full items-center justify-center gap-1 whitespace-normal rounded-full bg-[#d34c65] px-2.5 text-left text-[9px] font-semibold text-white transition-colors duration-200 hover:bg-[#bd3f58] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#d34c65]/30 md:min-h-13 md:min-w-52 md:gap-2 md:px-8 md:text-center md:text-base"
                      >
                        {slide.ctaPrimaryLabel}
                        <ArrowRight aria-hidden="true" className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1 md:h-4 md:w-4" />
                      </Link>
                    )}

                    {slide.ctaSecondaryLabel && (
                      <Link
                        href={slide.ctaSecondaryHref || "#"}
                        tabIndex={isActive ? 0 : -1}
                        className="inline-flex min-h-7 w-fit max-w-full items-center justify-center whitespace-normal rounded-full border border-[#c85868]/50 bg-white/80 px-2.5 text-left text-[9px] font-semibold text-[#a83f55] transition-colors duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#d34c65]/25 md:min-h-13 md:px-7 md:text-center md:text-base"
                      >
                        {slide.ctaSecondaryLabel}
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="group absolute top-[calc(56.25vw-2.5rem)] left-3 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/85 text-[#a83f55] transition-colors duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#d34c65]/25 md:top-1/2 md:left-6 md:h-10 md:w-10 md:-translate-y-1/2"
          >
            <ChevronLeft className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-0.5" />
          </button>

          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="group absolute top-[calc(56.25vw-2.5rem)] right-3 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/85 text-[#a83f55] transition-colors duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#d34c65]/25 md:top-1/2 md:right-6 md:h-10 md:w-10 md:-translate-y-1/2"
          >
            <ChevronRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </>
      )}

      {slides.length > 1 && (
        <div
          role="tablist"
          aria-label="Hero slides"
          className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 sm:bottom-6 sm:gap-2.5"
        >
          {slides.map((slide, index) => {
            const isActive = index === currentActive;

            return (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-label={`Go to slide ${index + 1}`}
                aria-selected={isActive}
                onClick={() => goTo(index)}
                className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#d34c65]/25 ${
                  isActive
                    ? "w-8 bg-[#d34c65]"
                    : "w-2 bg-white/80 hover:bg-white"
                }`}
              />
            );
          })}
        </div>
      )}

      <style jsx global>{`
        .hero-copy-scrim {
          background: linear-gradient(90deg, rgba(255, 250, 248, 0.97) 0%, rgba(255, 250, 248, 0.88) 34%, rgba(255, 250, 248, 0.48) 52%, rgba(255, 250, 248, 0) 72%);
        }

        @media (max-width: 767px) {
          .hero-copy-scrim {
            background: linear-gradient(90deg, rgba(255, 250, 248, 0.9) 0%, rgba(255, 250, 248, 0.76) 34%, rgba(255, 250, 248, 0.34) 56%, rgba(255, 250, 248, 0) 76%);
          }
        }
      `}</style>
    </section>
  );
}
