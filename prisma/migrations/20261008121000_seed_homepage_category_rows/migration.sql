UPDATE `Category`
SET `homepageRow` = CASE
  WHEN `name` IN ('Fragrances', 'Perfumes', 'Makeup', 'Cosmetics') THEN 1
  WHEN `name` IN ('Jewelry', 'Watches', 'Smart Watches') THEN 2
  WHEN `name` IN ('Hair Care', 'Skincare', 'Beauty Accessories', 'Accessories') THEN 3
  ELSE `homepageRow`
END
WHERE `parentId` IS NULL;
