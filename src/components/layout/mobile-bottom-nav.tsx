"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid3X3, MessageCircle, ShoppingBag, ShoppingCart } from "@esmate/shadcn/pkgs/lucide-react";
import { useCart } from "@/lib/commerce";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { totalQuantity } = useCart();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const openChatAgent = () => {
    window.dispatchEvent(new Event("close-storefront-overlays"));
    window.dispatchEvent(new CustomEvent("open-mobile-chat"));
  };

  const openCartDrawer = () => {
    window.dispatchEvent(new CustomEvent("open-cart-drawer"));
  };

  const homeActive = isActive("/");
  const productsActive = isActive("/products") || isActive("/category") || isActive("/collections");

  const navItemClass =
    "relative flex h-11 w-11 items-center justify-center rounded-full text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white";
  const activeItemClass =
    "-translate-y-3.5 bg-[#db2777] text-white ring-[5px] ring-white shadow-[0_6px_16px_rgba(219,39,119,0.35)]";
  const inactiveItemClass = "bg-white/10 text-white hover:bg-white/20";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-1 md:hidden safe-area-bottom">
      <div className="rounded-t-[1.5rem] border border-b-0 border-white/10 bg-[#1a1308] shadow-[0_-8px_24px_rgba(0,0,0,0.18)] pb-[env(safe-area-inset-bottom)]">
        <div className="grid h-14 grid-cols-5 place-items-center px-1 pt-0.5">
          {/* AI chat agent */}
          <button type="button" aria-label="Open chat agent" onClick={openChatAgent} className={`${navItemClass} ${inactiveItemClass}`}>
            <MessageCircle className="h-5 w-5" />
          </button>

          {/* Products */}
          <Link
            href="/products"
            aria-label="Products"
            aria-current={productsActive ? "page" : undefined}
            className={`${navItemClass} ${
              productsActive ? activeItemClass : inactiveItemClass
            }`}
          >
            <Grid3X3 className="h-5 w-5" />
          </Link>

          {/* Home — centered in the five-item navigation */}
          <Link
            href="/"
            aria-label="Home"
            aria-current={homeActive ? "page" : undefined}
            className={`${navItemClass} ${homeActive ? activeItemClass : inactiveItemClass}`}
          >
            <Home className="h-5 w-5" />
          </Link>

          {/* Cart */}
          <button
            type="button"
            aria-label={`Cart${totalQuantity ? `, ${totalQuantity} ${totalQuantity === 1 ? "item" : "items"}` : ""}`}
            onClick={openCartDrawer}
            className={`${navItemClass} ${inactiveItemClass}`}
          >
            <ShoppingCart className="h-5 w-5" />
            {totalQuantity > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full border border-[#1a1308] bg-[#db2777] px-1 text-[9px] font-bold leading-none text-white">
                {totalQuantity > 99 ? "99+" : totalQuantity}
              </span>
            ) : null}
          </button>

          {/* Orders */}
          <Link
            href="/profile"
            aria-label="Orders"
            aria-current={isActive("/profile") ? "page" : undefined}
            onClick={() => window.dispatchEvent(new Event("close-storefront-overlays"))}
            className={`${navItemClass} ${isActive("/profile") ? activeItemClass : inactiveItemClass}`}
          >
            <ShoppingBag className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
