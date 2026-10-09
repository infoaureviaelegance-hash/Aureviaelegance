ALTER TABLE `Category`
  ADD COLUMN `homepageRow` INTEGER NULL,
  ADD COLUMN `promoEnabled` BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN `promoTitle` VARCHAR(191) NULL,
  ADD COLUMN `promoDescription` TEXT NULL,
  ADD COLUMN `promoImage` VARCHAR(2048) NULL,
  ADD COLUMN `promoButtonText` VARCHAR(191) NULL DEFAULT 'Shop Now',
  ADD COLUMN `promoOrder` INTEGER NOT NULL DEFAULT 0;

CREATE INDEX `Category_homepageRow_idx` ON `Category`(`homepageRow`);
CREATE INDEX `Category_promoEnabled_promoOrder_idx` ON `Category`(`promoEnabled`, `promoOrder`);
