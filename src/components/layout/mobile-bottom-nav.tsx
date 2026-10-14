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
    window.dispatchEvent(new CustomEvent("open-cart-drawer"));
  };

  const homeActive = isActive("/");
  const productsActive = isActive("/products") || isActive("/category") || isActive("/collections");

  const navItemClass =
    "group relative flex h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-1 transition-[transform,color,background-color] duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#db2777]/40 active:scale-95";
  const activeItemClass = "-translate-y-1 bg-[#fdf2f8] text-[#db2777]";
  const inactiveItemClass = "text-[#6b6470] hover:bg-[#fdf2f8]/70 hover:text-[#db2777]";
  const iconClass = "h-5 w-5 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-110";
  const labelClass = "max-w-full truncate text-[9px] font-semibold leading-none tracking-tight";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden">
      <div className="mx-auto max-w-md rounded-[1.4rem] border border-black/10 bg-white/95 p-1.5 shadow-[0_10px_35px_rgba(28,16,24,0.18)] backdrop-blur-xl">
        <div className="grid h-14 grid-cols-5 items-center gap-1">
          {/* Home */}
          <Link
            href="/"
            aria-label="Home"
            aria-current={homeActive ? "page" : undefined}
            className={`${navItemClass} ${homeActive ? activeItemClass : inactiveItemClass}`}
          >
            <Home className={iconClass} />
            <span className={labelClass}>Home</span>
            {homeActive ? <span className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-[#db2777]" /> : null}
          </Link>

          {/* Products */}
          <Link
            href="/products"
            aria-label="Products"
            aria-current={productsActive ? "page" : undefined}
            className={`${navItemClass} ${
              productsActive ? activeItemClass : inactiveItemClass
            }`}
          >
            <Grid3X3 className={iconClass} />
            <span className={labelClass}>Shop</span>
            {productsActive ? <span className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-[#db2777]" /> : null}
          </Link>

          {/* Cart */}
          <button
            type="button"
            aria-label={`Cart${totalQuantity ? `, ${totalQuantity} ${totalQuantity === 1 ? "item" : "items"}` : ""}`}
            onClick={openCartDrawer}
            className="group relative -translate-y-2 flex h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-2xl bg-[#db2777] px-1 text-white shadow-[0_8px_20px_rgba(219,39,119,0.3)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-2.5 hover:shadow-[0_10px_24px_rgba(219,39,119,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#db2777]/40 active:scale-95"
          >
            <ShoppingCart className={iconClass} />
            <span className={labelClass}>Cart</span>
            {totalQuantity > 0 ? (
              <span className="absolute right-1 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-white bg-[#1a1308] px-0.5 text-[8px] font-bold leading-none text-white">
                {totalQuantity > 99 ? "99+" : totalQuantity}
              </span>
            ) : null}
          </button>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            aria-current={isActive("/wishlist") ? "page" : undefined}
            onClick={() => window.dispatchEvent(new Event("close-storefront-overlays"))}
            className={`${navItemClass} ${isActive("/wishlist") ? activeItemClass : inactiveItemClass}`}
          >
            <Heart className={iconClass} />
            <span className={labelClass}>Saved</span>
            {isActive("/wishlist") ? <span className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-[#db2777]" /> : null}
          </Link>

          {/* Profile */}
          <Link
            href="/profile"
            aria-label="Profile"
            aria-current={isActive("/profile") ? "page" : undefined}
            onClick={() => window.dispatchEvent(new Event("close-storefront-overlays"))}
            className={`${navItemClass} ${isActive("/profile") ? activeItemClass : inactiveItemClass}`}
          >
            <UserRound className={iconClass} />
            <span className={labelClass}>Profile</span>
            {isActive("/profile") ? <span className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-[#db2777]" /> : null}
          </Link>
        </div>
      </div>
    </nav>
  );
}
