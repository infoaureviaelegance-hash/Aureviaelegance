ALTER TABLE `Product` ALTER COLUMN `vendor` SET DEFAULT 'Aurevia Elegance';

UPDATE `Product`
SET `vendor` = 'Aurevia Elegance'
WHERE `vendor` IN ('Auerviamaison', 'Aurevia Maison');
