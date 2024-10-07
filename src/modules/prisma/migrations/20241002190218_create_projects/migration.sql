-- AlterTable
ALTER TABLE "users" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "projects" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
