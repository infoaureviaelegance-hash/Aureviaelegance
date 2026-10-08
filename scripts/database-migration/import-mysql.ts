import { readFile } from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

type Delegate = {
  upsert(args: { where: { id: string }; create: Record<string, unknown>; update: Record<string, unknown> }): Promise<unknown>;
};

const prisma = new PrismaClient();
const backupDir = path.join(process.cwd(), "backups", "neon-migration");

const importPlan = [
  ["Product", "product"],
  ["Collection", "collection"],
  ["AdminUser", "adminUser"],
  ["SiteSetting", "siteSetting"],
  ["Customer", "customer"],
  ["Inquiry", "inquiry"],
  ["Category", "category"],
  ["Author", "author"],
  ["Review", "review"],
  ["Certificate", "certificate"],
  ["HeroSlide", "heroSlide"],
  ["HomepageSection", "homepageSection"],
  ["Video", "video"],
  ["NavigationMenu", "navigationMenu"],
  ["MediaAsset", "mediaAsset"],
  ["ProductVariation", "productVariation"],
  ["AdminAccountRequest", "adminAccountRequest"],
  ["PasswordChangeRequest", "passwordChangeRequest"],
  ["Order", "order"],
  ["WishlistItem", "wishlistItem"],
  ["CustomerActivity", "customerActivity"],
  ["BlogPost", "blogPost"],
] as const;

const dateFields = new Set([
  "passwordChangedAt", "expiresAt", "createdAt", "updatedAt", "confirmationEmailSentAt",
  "dateOfBirth", "lastActiveAt", "publishedAt", "scheduledAt", "contentRevisedAt",
  "issueDate", "expiryDate",
]);

function reviveRow(row: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(row).map(([key, value]) => [
      key,
      dateFields.has(key) && typeof value === "string" ? new Date(value) : value,
    ]),
  );
}

async function loadRows(table: string) {
  const contents = await readFile(path.join(backupDir, `${table}.json`), "utf8");
  return (JSON.parse(contents) as Record<string, unknown>[]).map((rawRow) => {
    if (table !== "Certificate") return reviveRow(rawRow);

    const {
      name: title,
      image: certificateImage,
      description: shortDescription,
      order: displayOrder,
      isActive: active,
      isVerifiedBy: featured,
      ...rest
    } = rawRow;

    return reviveRow({
      ...rest,
      title,
      certificateImage,
      shortDescription,
      displayOrder,
      active,
      featured,
    });
  });
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url?.startsWith("mysql://")) throw new Error("Refusing import: DATABASE_URL is not MySQL");

  for (const [table, delegateName] of importPlan) {
    const rows = await loadRows(table);
    const delegate = (prisma as unknown as Record<string, Delegate>)[delegateName];
    if (!delegate) throw new Error(`Missing Prisma delegate: ${delegateName}`);

    for (const row of rows) {
      const id = row.id;
      if (typeof id !== "string") throw new Error(`${table} row is missing a string id`);
      await delegate.upsert({ where: { id }, create: row, update: row });
    }
    console.log(`${table}: ${rows.length}`);
  }
}

main()
  .finally(() => prisma.$disconnect())
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
