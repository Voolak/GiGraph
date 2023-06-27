/*
  Warnings:

  - You are about to drop the column `data` on the `document` table. All the data in the column will be lost.
  - Added the required column `directory` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `directory` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `document` DROP COLUMN `data`,
    ADD COLUMN `directory` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `group` ADD COLUMN `directory` VARCHAR(191) NOT NULL;
