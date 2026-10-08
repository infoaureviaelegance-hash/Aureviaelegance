import { randomUUID } from "node:crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const rollbackMarker = "EXPECTED_SMOKE_TEST_ROLLBACK";

async function main() {
  if (!process.env.DATABASE_URL?.startsWith("mysql://")) {
    throw new Error("Refusing smoke test: DATABASE_URL is not MySQL");
  }

  const reads = {
    products: await prisma.product.count(),
    categories: await prisma.category.count(),
    collections: await prisma.collection.count(),
    admins: await prisma.adminUser.count(),
    orders: await prisma.order.count(),
    blogPosts: await prisma.blogPost.count(),
    reviews: await prisma.review.count(),
    settings: await prisma.siteSetting.count(),
  };
  const product = await prisma.product.findFirst({ include: { variations: true } });
  const admin = await prisma.adminUser.findFirst();
  if (!product) throw new Error("Product read test failed");
  if (!admin?.password) throw new Error("Admin authentication record read test failed");

  try {
    await prisma.$transaction(async (tx) => {
      const suffix = randomUUID();
      const setting = await tx.siteSetting.create({
        data: { key: `migration-smoke-${suffix}`, value: { ok: true } },
      });
      const readSetting = await tx.siteSetting.findUniqueOrThrow({ where: { id: setting.id } });
      if ((readSetting.value as { ok?: boolean }).ok !== true) throw new Error("JSON read failed");
      await tx.siteSetting.update({ where: { id: setting.id }, data: { value: { ok: false } } });
      await tx.siteSetting.delete({ where: { id: setting.id } });

      const customer = await tx.customer.create({
        data: { accessTokenHash: `smoke-${suffix}`, name: "Migration smoke test" },
      });
      await tx.wishlistItem.create({ data: { customerId: customer.id, productId: product.id } });
      const related = await tx.customer.findUniqueOrThrow({
        where: { id: customer.id }, include: { wishlistItems: true },
      });
      if (related.wishlistItems.length !== 1) throw new Error("Relationship read failed");
      await tx.customer.delete({ where: { id: customer.id } });
      const cascaded = await tx.wishlistItem.count({ where: { customerId: customer.id } });
      if (cascaded !== 0) throw new Error("Cascade delete failed");

      throw new Error(rollbackMarker);
    }, { maxWait: 15_000, timeout: 60_000 });
  } catch (error) {
    if (!(error instanceof Error) || error.message !== rollbackMarker) throw error;
  }

  console.log(JSON.stringify({ reads, crudTransactionRolledBack: true, relations: true, cascade: true }, null, 2));
}

main().finally(() => prisma.$disconnect()).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
