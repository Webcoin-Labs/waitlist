ALTER TYPE "WebXpReason" ADD VALUE IF NOT EXISTS 'X_SHARE_TASK';
ALTER TYPE "WebXpReason" ADD VALUE IF NOT EXISTS 'THREE_VERIFIED_REFERRALS';
ALTER TYPE "WebXpReason" ADD VALUE IF NOT EXISTS 'FOUNDER_PASS_ELIGIBILITY_CHECK';
ALTER TYPE "FounderPassTrack" ADD VALUE IF NOT EXISTS 'BOTH';

CREATE TYPE "WaitlistTaskType" AS ENUM ('X_SHARE', 'THREE_VERIFIED_REFERRALS', 'FOUNDER_PASS_ELIGIBILITY_CHECK');
CREATE TYPE "WaitlistTaskStatus" AS ENUM ('OPENED', 'PENDING_CONFIRMATION', 'COMPLETED', 'CLAIMED');

CREATE TABLE "WaitlistTaskCompletion" (
  "id" TEXT NOT NULL,
  "waitlistEntryId" TEXT NOT NULL,
  "taskType" "WaitlistTaskType" NOT NULL,
  "status" "WaitlistTaskStatus" NOT NULL,
  "xpAwarded" INTEGER NOT NULL DEFAULT 0,
  "metadata" JSONB,
  "openedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "confirmedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "WaitlistTaskCompletion_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "WaitlistTaskCompletion_waitlistEntryId_taskType_key"
  ON "WaitlistTaskCompletion"("waitlistEntryId", "taskType");

CREATE INDEX "WaitlistTaskCompletion_waitlistEntryId_idx"
  ON "WaitlistTaskCompletion"("waitlistEntryId");

ALTER TABLE "WaitlistTaskCompletion"
  ADD CONSTRAINT "WaitlistTaskCompletion_waitlistEntryId_fkey"
  FOREIGN KEY ("waitlistEntryId") REFERENCES "WaitlistEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
