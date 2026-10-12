"use client";

import { useEffect, useRef, useState, type ComponentPropsWithoutRef } from "react";

export function LazyIframe({
  fallback,
  rootMargin = "200px 0px",
  ...props
}: ComponentPropsWithoutRef<"iframe"> & {
  fallback?: React.ReactNode;
  rootMargin?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (shouldLoad || !containerRef.current) return;

    const container = containerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.05 },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [rootMargin, shouldLoad]);

  return (
    <div ref={containerRef} className="h-full w-full">
      {shouldLoad ? (
        <iframe {...props} />
      ) : (
        fallback ?? <div className="h-full w-full animate-pulse bg-black/10" />
      )}
    </div>
  );
}
