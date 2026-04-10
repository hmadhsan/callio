-- CreateEnum
CREATE TYPE "ApiKeyEnvironment" AS ENUM ('production', 'sandbox');

-- AlterTable
ALTER TABLE "ApiKey" ADD COLUMN "environment" "ApiKeyEnvironment" NOT NULL DEFAULT 'production';

-- AlterTable
ALTER TABLE "UsageRecord" ADD COLUMN "environment" "ApiKeyEnvironment" NOT NULL DEFAULT 'production';

-- CreateIndex
CREATE INDEX "ApiKey_workspaceId_environment_idx" ON "ApiKey"("workspaceId", "environment");

-- CreateIndex
CREATE INDEX "UsageRecord_workspaceId_environment_createdAt_idx" ON "UsageRecord"("workspaceId", "environment", "createdAt");
