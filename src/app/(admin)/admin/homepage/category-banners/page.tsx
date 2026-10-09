"use client";

import { useEffect, useState } from "react";
import { AdminImageUpload } from "@/components/admin/image-upload";
import { parsePromotionalCategoryBanners, type PromotionalCategoryBanner } from "@/components/features/home/promotional-category-banner-types";

const inputClass = "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20";

export default function PromotionalCategoryBannersAdminPage() {
  const [banners, setBanners] = useState<PromotionalCategoryBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    void fetch("/api/admin/homepage-sections?key=category-promo-carousel")
      .then((response) => response.json())
      .then((data) => setBanners(parsePromotionalCategoryBanners(data.sections?.[0]?.content)))
      .finally(() => setLoading(false));
  }, []);

  const update = (id: string, changes: Partial<PromotionalCategoryBanner>) => setBanners((current) => current.map((banner) => banner.id === id ? { ...banner, ...changes } : banner));
  const addBanner = () => setBanners((current) => [...current, { id: crypto.randomUUID(), image: "", heading: "New promotional banner", description: "Add a short description.", ctaLabel: "Shop Now", href: "/products", order: current.length, isActive: true }]);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/homepage-sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionKey: "category-promo-carousel", title: "Promotional category carousel", content: banners, isActive: true, order: 7 }),
      });
      if (!response.ok) throw new Error("Unable to save promotional banners");
      setMessage("Promotional carousel saved successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save promotional banners");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-8 text-sm text-gray-500">Loading promotional banners...</div>;

  return (
    <div className="max-w-6xl p-4 md:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-[#0a0a0a]">Category Promotional Carousel</h1><p className="mt-1 text-sm text-gray-500">Manage the manual two-up desktop and one-up mobile carousel shown below homepage products.</p></div>
        <button type="button" onClick={addBanner} className="rounded-lg border border-[#EA580C] px-4 py-2 text-sm font-bold text-[#EA580C] hover:bg-orange-50">+ Add banner</button>
      </div>
      {message ? <div className="mb-5 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800">{message}</div> : null}
      <form onSubmit={save} className="space-y-5">
        {banners.length ? banners.map((banner, index) => (
          <section key={banner.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-bold text-gray-950">Banner {index + 1}: {banner.heading}</h2>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={banner.isActive} onChange={(event) => update(banner.id, { isActive: event.target.checked })} /> Enabled</label>
                <button type="button" onClick={() => setBanners((current) => current.filter((item) => item.id !== banner.id))} className="text-sm font-semibold text-red-600 hover:underline">Delete</button>
              </div>
            </div>
            <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Heading" value={banner.heading} onChange={(heading) => update(banner.id, { heading })} />
                <Field label="CTA button" value={banner.ctaLabel} onChange={(ctaLabel) => update(banner.id, { ctaLabel })} />
                <label className="block text-sm font-medium text-gray-900 sm:col-span-2">Short description<textarea rows={3} value={banner.description} onChange={(event) => update(banner.id, { description: event.target.value })} className={inputClass} /></label>
                <Field label="Destination link" value={banner.href} onChange={(href) => update(banner.id, { href })} />
                <Field label="Display order" type="number" value={String(banner.order)} onChange={(value) => update(banner.id, { order: Number(value) || 0 })} />
              </div>
              <AdminImageUpload label="Background image" folder="auerviamaison/homepage/category-banners" usedIn="homepage category promotional carousel" value={banner.image} onChange={(image) => update(banner.id, { image })} />
            </div>
          </section>
        )) : <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500">No promotional banners yet. Add one to begin.</div>}
        <div className="sticky bottom-4 flex justify-end"><button type="submit" disabled={saving} className="rounded-xl bg-[#EA580C] px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-[#c2410c] disabled:opacity-50">{saving ? "Saving..." : "Save banners"}</button></div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return <label className="block text-sm font-medium text-gray-900">{label}<input type={type} value={value} onChange={(event) => onChange(event.target.value)} required={type !== "number"} className={inputClass} /></label>;
}
