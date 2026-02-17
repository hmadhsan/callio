-- CreateTable
CREATE TABLE "BetaSignup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "company" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "BetaSignup_email_key" ON "BetaSignup"("email");

-- CreateIndex
CREATE INDEX "BetaSignup_email_idx" ON "BetaSignup"("email");

-- CreateIndex
CREATE INDEX "BetaSignup_createdAt_idx" ON "BetaSignup"("createdAt");
