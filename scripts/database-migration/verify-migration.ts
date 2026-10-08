import { readFile } from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

type Row = Record<string, unknown>;
type Delegate = { findMany(args: { orderBy: { id: "asc" } }): Promise<Row[]> };

const prisma = new PrismaClient();
const backupDir = path.join(process.cwd(), "backups", "neon-migration");

const delegates = {
  Product: "product", ProductVariation: "productVariation", Collection: "collection",
  AdminUser: "adminUser", AdminAccountRequest: "adminAccountRequest",
  PasswordChangeRequest: "passwordChangeRequest", SiteSetting: "siteSetting",
  Order: "order", Customer: "customer", WishlistItem: "wishlistItem",
  CustomerActivity: "customerActivity", Inquiry: "inquiry", Category: "category",
  BlogPost: "blogPost", Author: "author", Review: "review",
  Certificate: "certificate", HeroSlide: "heroSlide", HomepageSection: "homepageSection",
  Video: "video", NavigationMenu: "navigationMenu", MediaAsset: "mediaAsset",
} as const;

function toPhysicalCertificateFields(row: Row): Row {
  const { title: name, certificateImage: image, shortDescription: description,
    displayOrder: order, active: isActive, featured: isVerifiedBy, ...rest } = row;
  return { ...rest, name, image, description, order, isActive, isVerifiedBy };
}

function normalize(value: unknown): unknown {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "bigint") return value.toString();
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value as Row)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => [key, normalize(item)]));
  }
  return value;
}

const stable = (value: unknown) => JSON.stringify(normalize(value));
const readSourceRows = async (table: string) => JSON.parse(
  await readFile(path.join(backupDir, `${table}.json`), "utf8"),
) as Row[];

async function orphanCount(sql: string): Promise<number> {
  const rows = await prisma.$queryRawUnsafe<Array<{ count: bigint }>>(sql);
  return Number(rows[0]?.count ?? 0);
}

async function main() {
  if (!process.env.DATABASE_URL?.startsWith("mysql://")) {
    throw new Error("Refusing verification: DATABASE_URL is not MySQL");
  }

  const results: Record<string, { source: number; target: number; valuesMatch: boolean }> = {};
  const failures: string[] = [];

  for (const [table, delegateName] of Object.entries(delegates)) {
    const source = (await readSourceRows(table)).sort((a, b) => String(a.id).localeCompare(String(b.id)));
    const delegate = (prisma as unknown as Record<string, Delegate>)[delegateName];
    let target = await delegate.findMany({ orderBy: { id: "asc" } });
    if (table === "Certificate") target = target.map(toPhysicalCertificateFields);

    let valuesMatch = source.length === target.length;
    if (valuesMatch) {
      for (let index = 0; index < source.length; index += 1) {
        if (stable(source[index]) !== stable(target[index])) {
          valuesMatch = false;
          failures.push(`${table}: value mismatch for id ${String(source[index]?.id)}`);
          break;
        }
      }
    }
    if (source.length !== target.length) failures.push(`${table}: row count mismatch`);
    results[table] = { source: source.length, target: target.length, valuesMatch };
  }

  const foreignKeys = {
    ProductVariation_productId: await orphanCount("SELECT COUNT(*) AS count FROM `ProductVariation` c LEFT JOIN `Product` p ON p.id = c.productId WHERE p.id IS NULL"),
    AdminAccountRequest_requestedById: await orphanCount("SELECT COUNT(*) AS count FROM `AdminAccountRequest` c LEFT JOIN `AdminUser` p ON p.id = c.requestedById WHERE p.id IS NULL"),
    PasswordChangeRequest_adminId: await orphanCount("SELECT COUNT(*) AS count FROM `PasswordChangeRequest` c LEFT JOIN `AdminUser` p ON p.id = c.adminId WHERE p.id IS NULL"),
    Order_customerId: await orphanCount("SELECT COUNT(*) AS count FROM `Order` c LEFT JOIN `Customer` p ON p.id = c.customerId WHERE c.customerId IS NOT NULL AND p.id IS NULL"),
    WishlistItem_customerId: await orphanCount("SELECT COUNT(*) AS count FROM `WishlistItem` c LEFT JOIN `Customer` p ON p.id = c.customerId WHERE p.id IS NULL"),
    WishlistItem_productId: await orphanCount("SELECT COUNT(*) AS count FROM `WishlistItem` c LEFT JOIN `Product` p ON p.id = c.productId WHERE p.id IS NULL"),
    CustomerActivity_customerId: await orphanCount("SELECT COUNT(*) AS count FROM `CustomerActivity` c LEFT JOIN `Customer` p ON p.id = c.customerId WHERE p.id IS NULL"),
    BlogPost_authorId: await orphanCount("SELECT COUNT(*) AS count FROM `BlogPost` c LEFT JOIN `Author` p ON p.id = c.authorId WHERE c.authorId IS NOT NULL AND p.id IS NULL"),
  };

  for (const [relation, count] of Object.entries(foreignKeys)) {
    if (count !== 0) failures.push(`${relation}: ${count} orphaned rows`);
  }

  console.log(JSON.stringify({ tables: results, foreignKeys }, null, 2));
  if (failures.length) throw new Error(failures.join("\n"));
}

main().finally(() => prisma.$disconnect()).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
