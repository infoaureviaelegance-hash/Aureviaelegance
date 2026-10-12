"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight } from "@esmate/shadcn/pkgs/lucide-react"

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
      <div className="mx-auto max-w-[96rem] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <p className="inline-flex rounded-full bg-[#fff0df] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#f27435]">Latest Articles</p>
          <h2 id="featured-journal-heading" className="mt-4 font-serif text-4xl font-semibold tracking-tight text-[#101827] sm:text-5xl lg:text-6xl">
            Latest Articles
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#4f5663] sm:text-base">
            Helpful beauty reads, product guidance, and inspiration for more confident everyday routines.
          </p>
        </div>

        <div className="relative">
          <div
            ref={scrollRef}
            className={`flex gap-4 overflow-x-auto pb-3 scrollbar-hide sm:gap-5 ${isDragging ? "cursor-grabbing select-none" : "cursor-grab snap-x snap-mandatory"}`}
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
              const publishedDate = article.publishedAt
                ? new Date(article.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                : "Recently"

              return (
                <div
                  key={article.id}
                  className="flex w-[86%] shrink-0 snap-start items-stretch sm:w-[calc((100%_-_1.25rem)/2)] lg:w-[calc((100%_-_3.75rem)/4)]"
                >
                  <article className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-[#eee9df] bg-[#fffaf0] shadow-[0_2px_8px_rgba(28,25,23,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(28,25,23,0.12)]">
                    <Link href={`/blog/${article.handle}`} className="relative block aspect-[4/3] w-full overflow-hidden bg-[#f7f8fa]">
                      {article.image?.url ? (
                        <Image
                          src={article.image.url}
                          alt={article.image.altText || article.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 640px) 86vw, (max-width: 1024px) 48vw, 24vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                          No image
                        </div>
                      )}
                    </Link>

                    <div className="flex min-h-[205px] min-w-0 flex-1 flex-col p-4 sm:p-5">
                      <div className="mb-3 flex items-center gap-2 text-xs text-[#4f5663]">
                        <CalendarDays aria-hidden="true" className="h-4 w-4" />
                        <time dateTime={article.publishedAt || undefined}>{publishedDate}</time>
                      </div>
                      <h3 className="line-clamp-2 text-base font-semibold leading-snug text-[#111827]">
                        <Link
                          href={`/blog/${article.handle}`}
                          className="transition-colors hover:text-[#f27435]"
                        >
                          {article.title}
                        </Link>
                      </h3>

                      <div className="mt-2 flex min-w-0 flex-1 flex-col items-start gap-4">
                        <p className="line-clamp-2 text-sm leading-6 text-[#625a55]">{text}</p>
                        <Link
                          href={`/blog/${article.handle}`}
                          className="mt-auto inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[#ff7b3d] transition hover:gap-2.5 hover:text-[#e96528]"
                        >
                          Read Article <ArrowRight className="h-4 w-4 shrink-0" />
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
