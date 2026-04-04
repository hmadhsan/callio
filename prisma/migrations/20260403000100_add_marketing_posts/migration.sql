CREATE TABLE "MarketingPost" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "topic" TEXT,
    "content" TEXT NOT NULL,
    "scheduledFor" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "externalId" TEXT,
    "externalUrl" TEXT,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketingPost_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "MarketingPost_platform_status_scheduledFor_idx" ON "MarketingPost"("platform", "status", "scheduledFor");
CREATE INDEX "MarketingPost_scheduledFor_idx" ON "MarketingPost"("scheduledFor");
