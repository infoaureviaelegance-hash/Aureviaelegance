import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "@esmate/shadcn/pkgs/lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTiktok, FaWhatsapp } from "react-icons/fa6";

const footerLinks = {
  shop: [
    ["All Products", "/products"], ["Best Sellers", "/collections/best-sellers"], ["Skincare", "/category/skincare"],
    ["Makeup", "/category/makeup"], ["Fragrances", "/category/fragrances"], ["Hot Deals", "/collections/hot-deals"],
  ],
  care: [
    ["Contact Us", "/contact"], ["About Us", "/about-us"], ["FAQs", "/faq"], ["Privacy Policy", "/privacy"],
    ["Terms & Conditions", "/terms"], ["Returns", "/refund-policy"], ["Shipping", "/shipping-policy"],
  ],
} as const;

const socialLinks = [
  { label: "WhatsApp", href: "https://wa.me/923179517939", icon: FaWhatsapp },
  { label: "Facebook", href: "https://www.facebook.com/auerviamaison", icon: FaFacebookF },
  { label: "Instagram", href: "https://www.instagram.com/auerviamaison", icon: FaInstagram },
  { label: "TikTok", href: "https://www.tiktok.com/@aureviamaison1", icon: FaTiktok },
  { label: "LinkedIn", href: "https://www.linkedin.com/", icon: FaLinkedinIn },
];

export function Footer() {
  return (
    <footer className="bg-[#f8f3ef] text-[#352821]">
      <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-11 lg:px-8 lg:py-14">
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 lg:grid-cols-[1.35fr_0.75fr_0.9fr_1.1fr] lg:gap-10">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2" aria-label="Aurevia Elegance home">
              <span className="relative h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16"><Image src="/logo/icon.png" alt="" fill sizes="64px" className="object-contain" /></span>
              <span className="relative h-12 w-[166px] sm:h-14 sm:w-[190px] lg:h-16 lg:w-[215px]"><Image src="/logo/logotext.png" alt="Aurevia Elegance" fill sizes="215px" className="object-contain object-left" /></span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-[#6a5b53]">Aurevia Elegance brings together premium beauty, skincare, fragrance, accessories, and modern lifestyle essentials for confident everyday living.</p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#7b5545] transition hover:bg-[#EA580C] hover:text-white"><Icon className="h-4 w-4" /></a>
              ))}
            </div>
          </div>

          <FooterLinkColumn title="Customer Care" links={footerLinks.care} />
          <FooterLinkColumn title="Shop" links={footerLinks.shop} />

          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-sm font-extrabold uppercase tracking-[0.12em] text-[#3e3029]">Contact</h3>
            <div className="mt-4 space-y-3.5 text-sm text-[#6a5b53]">
              <p className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#EA580C]" /><span>Lahore, Pakistan<br />Nationwide delivery available</span></p>
              <a href="tel:+923179517939" className="flex items-center gap-3 transition hover:text-[#EA580C]"><Phone className="h-4 w-4 shrink-0 text-[#EA580C]" />+92 317 9517939</a>
              <a href="mailto:info.aureviaelegance@gmail.com" className="flex items-center gap-3 break-all transition hover:text-[#EA580C]"><Mail className="h-4 w-4 shrink-0 text-[#EA580C]" />info.aureviaelegance@gmail.com</a>
              <a href="https://wa.me/923179517939" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#1f9d55] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#168447]"><FaWhatsapp className="h-4 w-4" />Chat on WhatsApp</a>
            </div>
          </div>
        </div>

        <div className="mt-9 border-t border-[#dfd3cb] pt-5 text-center text-xs text-[#786a62] lg:mt-12">
          &copy; {new Date().getFullYear()} Aurevia Elegance. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function FooterLinkColumn({ title, links }: { title: string; links: ReadonlyArray<readonly [string, string]> }) {
  return (
    <div>
      <h3 className="text-sm font-extrabold uppercase tracking-[0.12em] text-[#3e3029]">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {links.map(([label, href]) => <li key={href}><Link href={href} className="text-sm text-[#6a5b53] transition hover:text-[#EA580C]">{label}</Link></li>)}
      </ul>
    </div>
  );
}
