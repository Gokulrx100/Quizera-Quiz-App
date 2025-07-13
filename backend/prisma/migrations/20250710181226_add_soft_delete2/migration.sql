/*
  Warnings:

  - You are about to drop the column `deleted` on the `Option` table. All the data in the column will be lost.
  - You are about to drop the column `deleted` on the `Question` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Option" DROP COLUMN "deleted";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "deleted";
