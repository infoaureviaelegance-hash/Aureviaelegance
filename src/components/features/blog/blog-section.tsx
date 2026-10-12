"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ChevronLeft, ChevronRight } from "@esmate/shadcn/pkgs/lucide-react"

interface BlogImage {
  url: string
  altText?: string | null
}

interface Article {
  id: string
  title: string
  handle: string
  publishedAt: string
  content: string
  image?: BlogImage | null
  blogHandle: string
}

interface BlogSectionProps {
  articles?: Article[]
}

const AUTOPLAY_MS = 5000

export default function BlogSection({ articles: initialArticles }: BlogSectionProps) {
  const articles = initialArticles || []
  const scrollRef = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, moved: false, startX: 0, startLeft: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const checkScrollPosition = useCallback(() => {
    const scrollEl = scrollRef.current
    if (!scrollEl) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollEl
    setShowLeftArrow(scrollLeft > 10)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
  }, [])

  useEffect(() => {
    checkScrollPosition()
    window.addEventListener("resize", checkScrollPosition)
    return () => window.removeEventListener("resize", checkScrollPosition)
  }, [checkScrollPosition, articles.length])

  const getStep = (row: HTMLDivElement) => {
    const card = row.firstElementChild as HTMLElement | null
    return (card?.offsetWidth || row.clientWidth / 2) + parseFloat(getComputedStyle(row).columnGap || "0")
  }

  const scrollLeft = useCallback(() => {
    const scrollEl = scrollRef.current
    if (!scrollEl) return

    const cardWidth = getStep(scrollEl)
    scrollEl.scrollBy({ left: -cardWidth, behavior: "smooth" })
  }, [])

  const scrollRight = useCallback(() => {
    const scrollEl = scrollRef.current
    if (!scrollEl) return

    const cardWidth = getStep(scrollEl)
    scrollEl.scrollBy({ left: cardWidth, behavior: "smooth" })
  }, [])

  /**
   * Auto-advance: scroll to show next set of articles every 5 seconds
   */
  useEffect(() => {
    if (articles.length <= 2 || isPaused || isDragging) return

    const timer = window.setInterval(() => {
      const scrollEl = scrollRef.current
      if (!scrollEl) return

      const { scrollLeft, scrollWidth, clientWidth } = scrollEl
      const maxScroll = scrollWidth - clientWidth

      if (scrollLeft >= maxScroll - 10) {
        // Reset to beginning
        scrollEl.scrollTo({ left: 0, behavior: "smooth" })
      } else {
        const cardWidth = getStep(scrollEl)
        scrollEl.scrollBy({ left: cardWidth, behavior: "smooth" })
      }
    }, AUTOPLAY_MS)

    return () => window.clearInterval(timer)
  }, [isPaused, isDragging, articles.length])

  if (!articles.length) return null

  return (
    <section aria-labelledby="featured-journal-heading" className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-9 flex flex-col gap-5 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#a85460]">The Aurevia journal</p>
            <h2 id="featured-journal-heading" className="mt-3 font-serif text-3xl font-semibold tracking-tight text-[#241b18] sm:text-4xl lg:text-5xl">
              Ideas for elevated living
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#6f625d] sm:text-base">
              Curated stories, practical guidance, and considered inspiration for beauty and everyday rituals.
            </p>
          </div>
          <Link href="/blog" className="inline-flex w-fit items-center gap-2 border-b border-[#a85460]/40 pb-1 text-sm font-semibold text-[#8f4350] transition hover:border-[#a85460] hover:text-[#a85460]">
            Explore the journal <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="relative">
          <div
            ref={scrollRef}
            className={`flex gap-5 overflow-x-auto pb-5 scrollbar-hide sm:gap-7 ${isDragging ? "cursor-grabbing select-none" : "cursor-grab snap-x snap-mandatory"}`}
            onDragStart={(event) => event.preventDefault()}
            onPointerDown={(event) => {
              drag.current.moved = false
              if (event.pointerType !== "mouse" || event.button !== 0) return
              drag.current = { active: true, moved: false, startX: event.clientX, startLeft: event.currentTarget.scrollLeft }
            }}
            onPointerMove={(event) => {
              if (!drag.current.active) return
              const distance = event.clientX - drag.current.startX
              if (Math.abs(distance) > 5 && !drag.current.moved) {
                drag.current.moved = true
                event.currentTarget.setPointerCapture(event.pointerId)
                setIsDragging(true)
              }
              if (drag.current.moved) event.currentTarget.scrollLeft = drag.current.startLeft - distance
            }}
            onPointerUp={(event) => {
              drag.current.active = false
              setIsDragging(false)
              if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
            }}
            onPointerCancel={() => { drag.current.active = false; setIsDragging(false) }}
            onClickCapture={(event) => {
              if (drag.current.moved) { event.preventDefault(); event.stopPropagation(); drag.current.moved = false }
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => { setIsPaused(false); if (!drag.current.moved) drag.current.active = false }}
            onFocusCapture={() => setIsPaused(true)}
            onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false) }}
            onScroll={checkScrollPosition}
          >
            {articles.map((article) => {
              const text = article.content?.replace(/<[^>]+>/g, "").trim() ?? ""

              return (
                <div
                  key={article.id}
                  className="flex w-[88%] shrink-0 snap-start items-stretch sm:w-[calc((100%_-_1.75rem)/2)]"
                >
                  <article className="group relative flex w-full flex-col overflow-hidden rounded-[1.75rem] border border-[#eee6e1] bg-[#fcfaf8] shadow-[0_16px_45px_rgba(73,47,38,0.06)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(73,47,38,0.10)]">
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#f5efeb]">
                      {article.image?.url ? (
                        <Image
                          src={article.image.url}
                          alt={article.image.altText || article.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 640px) 88vw, 48vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col p-5 sm:px-7 sm:py-6">
                      <h3 className="line-clamp-2 font-serif text-lg font-semibold leading-snug text-[#241b18] sm:text-2xl">
                        <Link
                          href={`/blog/${article.handle}`}
                          className="transition-colors hover:text-[#a85460]"
                        >
                          {article.title}
                        </Link>
                      </h3>

                      <div className="mt-4 flex min-w-0 flex-1 flex-col items-start gap-5">
                        <p className="line-clamp-2 text-sm leading-6 text-[#71635e] sm:text-[15px]">{text}</p>
                        <Link
                          href={`/blog/${article.handle}`}
                          className="mt-auto inline-flex shrink-0 items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#9f4050] transition hover:gap-2.5 sm:text-sm"
                        >
                          Learn more <ArrowRight className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                        </Link>
                      </div>
                    </div>
                  </article>
                </div>
              )
            })}
          </div>

          {/* Navigation arrows */}
          {articles.length > 2 && (
            <>
              {showLeftArrow && (
                <button
                  type="button"
                  onClick={scrollLeft}
                  aria-label="Scroll left"
                  className="group absolute -left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-[#513a32] shadow-sm transition-all duration-300 hover:scale-105 hover:text-[#a85460] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#a85460]/20 sm:-left-3"
                >
                  <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-slate-800 transition-transform duration-300 group-hover:-translate-x-0.5" />
                </button>
              )}

              {showRightArrow && (
                <button
                  type="button"
                  onClick={scrollRight}
                  aria-label="Scroll right"
                  className="group absolute -right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-[#513a32] shadow-sm transition-all duration-300 hover:scale-105 hover:text-[#a85460] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#a85460]/20 sm:-right-3"
                >
                  <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-slate-800 transition-transform duration-300 group-hover:translate-x-0.5" />
                </button>
              )}
            </>
          )}
        </div>

      </div>
    </section>
  )
}
