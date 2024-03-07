/*
  Warnings:

  - The `assigned_to_id` column on the `Task` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "assigned_to_id",
ADD COLUMN     "assigned_to_id" TEXT[];

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "name" SET DEFAULT '',
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "image" SET DEFAULT '';
