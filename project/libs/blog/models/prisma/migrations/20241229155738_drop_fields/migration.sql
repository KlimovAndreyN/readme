/*
  Warnings:

  - You are about to drop the column `updated_at` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `tags` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `tags` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "comments" DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "tags" DROP COLUMN "created_at",
DROP COLUMN "updated_at";