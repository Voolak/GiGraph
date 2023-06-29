/*
  Warnings:

  - You are about to drop the column `groupId` on the `document` table. All the data in the column will be lost.
  - You are about to drop the `group` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `document` DROP FOREIGN KEY `Document_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `group` DROP FOREIGN KEY `Group_userId_fkey`;

-- AlterTable
ALTER TABLE `document` DROP COLUMN `groupId`,
    ADD COLUMN `userId` INTEGER NULL;

-- DropTable
DROP TABLE `group`;

-- CreateTable
CREATE TABLE `exchange_document` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `exchangeId` INTEGER NOT NULL,
    `documentId` INTEGER NOT NULL,
    `processed` ENUM('PROCESSED', 'NOT_PROCESSED') NOT NULL DEFAULT 'NOT_PROCESSED',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ExchangeDocument` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ExchangeDocument_AB_unique`(`A`, `B`),
    INDEX `_ExchangeDocument_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exchange_document` ADD CONSTRAINT `exchange_document_exchangeId_fkey` FOREIGN KEY (`exchangeId`) REFERENCES `Exchange`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exchange_document` ADD CONSTRAINT `exchange_document_documentId_fkey` FOREIGN KEY (`documentId`) REFERENCES `Document`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ExchangeDocument` ADD CONSTRAINT `_ExchangeDocument_A_fkey` FOREIGN KEY (`A`) REFERENCES `Document`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ExchangeDocument` ADD CONSTRAINT `_ExchangeDocument_B_fkey` FOREIGN KEY (`B`) REFERENCES `Exchange`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
