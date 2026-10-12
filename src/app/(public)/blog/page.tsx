import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { publishedBlogWhere, BLOG_PAGE_SIZE } from "@/lib/blog";
import { createSeoMetadata } from "@/lib/seo";
import { BlogPageContent } from "../blogs/_components/blog-page-content";

export const revalidate = 900;

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ page?: string }> }): Promise<Metadata> {
  const page = Math.max(1, Number((await searchParams).page) || 1);
  return createSeoMetadata({
    title: page > 1 ? `Beauty & Lifestyle Guides – Page ${page}` : "Beauty, Skincare & Lifestyle Guides",
    description: "Read practical skincare, makeup, fragrance, hair care, jewelry and beauty buying guides from Aurevia Elegance Pakistan.",
    path: page > 1 ? `/blog?page=${page}` : "/blog",
    keywords: ["beauty blog Pakistan", "skincare guides Pakistan", "makeup tips Pakistan", "fragrance guide", "beauty buying guides"],
  });
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = Math.max(1, Number((await searchParams).page) || 1);
  const [articles, count] = await Promise.all([
    prisma.blogPost.findMany({
      where: publishedBlogWhere(),
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * BLOG_PAGE_SIZE,
      take: BLOG_PAGE_SIZE,
      select: { id: true, title: true, slug: true, excerpt: true, featuredImage: true, featuredImageAlt: true, publishedAt: true },
    }),
    prisma.blogPost.count({ where: publishedBlogWhere() }),
  ]);
  return <BlogPageContent articles={articles} page={page} pages={Math.max(1, Math.ceil(count / BLOG_PAGE_SIZE))} />;
}
