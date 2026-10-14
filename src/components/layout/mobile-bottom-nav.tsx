"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid3X3, Heart, ShoppingCart, UserRound } from "@esmate/shadcn/pkgs/lucide-react";
import { useCart } from "@/lib/commerce";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { totalQuantity } = useCart();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const openCartDrawer = () => {
    window.dispatchEvent(new Event("close-storefront-overlays"));
    window.dispatchEvent(new CustomEvent("open-cart-drawer"));
  };

  const homeActive = isActive("/");
  const productsActive =
    isActive("/products") || isActive("/category") || isActive("/collections");

  const navItemClass =
    "group relative flex h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 transition-[transform,color,background-color] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#db2777]/40 active:scale-[0.96]";
  const activeItemClass = "bg-[#fdf2f8] text-[#db2777]";
  const inactiveItemClass = "text-[#6b6470] hover:bg-[#fdf2f8]/70 hover:text-[#db2777]";
  const iconClass =
    "h-5 w-5 transition-transform duration-200 ease-out group-hover:-translate-y-0.5";
  const labelClass = "max-w-full truncate text-[9px] font-semibold leading-none tracking-tight";

  const activeDot = (
    <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-[#db2777]" />
  );

  return (
    <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-50 md:hidden">
      <div className="mx-auto max-w-md rounded-t-[1.4rem] border-x border-t border-black/10 bg-white/95 px-1.5 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] shadow-[0_-8px_28px_rgba(28,16,24,0.12)] backdrop-blur-xl">
        <div className="grid h-14 grid-cols-5 items-center gap-1">
          <Link
            href="/"
            aria-label="Home"
            aria-current={homeActive ? "page" : undefined}
            className={`${navItemClass} ${homeActive ? activeItemClass : inactiveItemClass}`}
          >
            <Home className={iconClass} />
            <span className={labelClass}>Home</span>
            {homeActive ? activeDot : null}
          </Link>

          <Link
            href="/products"
            aria-label="Products"
            aria-current={productsActive ? "page" : undefined}
            className={`${navItemClass} ${productsActive ? activeItemClass : inactiveItemClass}`}
          >
            <Grid3X3 className={iconClass} />
            <span className={labelClass}>Shop</span>
            {productsActive ? activeDot : null}
          </Link>

          <button
            type="button"
            aria-label={`Cart${totalQuantity ? `, ${totalQuantity} ${totalQuantity === 1 ? "item" : "items"}` : ""}`}
            onClick={openCartDrawer}
            className={`${navItemClass} ${inactiveItemClass}`}
          >
            <ShoppingCart className={iconClass} />
            <span className={labelClass}>Cart</span>
            {totalQuantity > 0 ? (
              <span className="absolute right-1 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-white bg-[#db2777] px-0.5 text-[8px] font-bold leading-none text-white">
                {totalQuantity > 99 ? "99+" : totalQuantity}
              </span>
            ) : null}
          </button>

          <Link
            href="/wishlist"
            aria-label="Wishlist"
            aria-current={isActive("/wishlist") ? "page" : undefined}
            onClick={() => window.dispatchEvent(new Event("close-storefront-overlays"))}
            className={`${navItemClass} ${isActive("/wishlist") ? activeItemClass : inactiveItemClass}`}
          >
            <Heart className={iconClass} />
            <span className={labelClass}>Saved</span>
            {isActive("/wishlist") ? activeDot : null}
          </Link>

          <Link
            href="/profile"
            aria-label="Profile"
            aria-current={isActive("/profile") ? "page" : undefined}
            onClick={() => window.dispatchEvent(new Event("close-storefront-overlays"))}
            className={`${navItemClass} ${isActive("/profile") ? activeItemClass : inactiveItemClass}`}
          >
            <UserRound className={iconClass} />
            <span className={labelClass}>Profile</span>
            {isActive("/profile") ? activeDot : null}
          </Link>
        </div>
      </div>
    </nav>
  );
}
