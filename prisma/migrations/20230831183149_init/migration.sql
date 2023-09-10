-- AlterTable
ALTER TABLE `Product` ADD COLUMN `sellerid` INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_sellerid_fkey` FOREIGN KEY (`sellerid`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
