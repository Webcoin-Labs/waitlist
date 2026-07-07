DO $$ BEGIN
  CREATE TYPE "WaitlistRole" AS ENUM ('FOUNDER', 'BUILDER', 'INVESTOR', 'ADVISOR');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "WaitlistStatus" AS ENUM ('PENDING_VERIFICATION', 'VERIFIED', 'INVITED', 'APPROVED', 'BLOCKED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "ArcCardStatus" AS ENUM ('LOCKED', 'ELIGIBLE_SOON', 'ELIGIBLE', 'INVITED', 'CLAIMED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "FounderPassStatus" AS ENUM ('LOCKED', 'ELIGIBLE_SOON', 'ELIGIBLE', 'INVITED', 'CLAIMED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "FounderPassTier" AS ENUM ('BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "FounderPassTrack" AS ENUM ('ARC', 'BASE', 'FARCASTER', 'SOLANA', 'POLYGON', 'OPTIMISM', 'OTHER');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "WebXpReason" AS ENUM ('SIGNUP', 'REFERRAL', 'ADMIN_ADJUSTMENT');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "WaitlistEntry" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "name" TEXT,
  "role" "WaitlistRole" NOT NULL DEFAULT 'FOUNDER',
  "status" "WaitlistStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
  "referralCode" TEXT NOT NULL,
  "referredById" TEXT,
  "webXp" INTEGER NOT NULL DEFAULT 0,
  "verifiedReferralCount" INTEGER NOT NULL DEFAULT 0,
  "emailVerifiedAt" TIMESTAMP(3),
  "verificationToken" TEXT,
  "verificationExpiresAt" TIMESTAMP(3),
  "arcCardStatus" "ArcCardStatus" NOT NULL DEFAULT 'LOCKED',
  "founderPassStatus" "FounderPassStatus" NOT NULL DEFAULT 'LOCKED',
  "founderPassTier" "FounderPassTier",
  "founderPassTrack" "FounderPassTrack",
  "source" TEXT,
  "utmSource" TEXT,
  "utmMedium" TEXT,
  "utmCampaign" TEXT,
  "ipHash" TEXT,
  "userAgentHash" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "WaitlistEntry_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "WebXpLedger" (
  "id" TEXT NOT NULL,
  "waitlistEntryId" TEXT NOT NULL,
  "amount" INTEGER NOT NULL,
  "reason" "WebXpReason" NOT NULL,
  "sourceEntryId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "WebXpLedger_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "WaitlistEntry"
  ADD COLUMN IF NOT EXISTS "founderPassStatus" "FounderPassStatus" NOT NULL DEFAULT 'LOCKED',
  ADD COLUMN IF NOT EXISTS "founderPassTier" "FounderPassTier",
  ADD COLUMN IF NOT EXISTS "founderPassTrack" "FounderPassTrack";

CREATE UNIQUE INDEX IF NOT EXISTS "WaitlistEntry_email_key" ON "WaitlistEntry"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "WaitlistEntry_referralCode_key" ON "WaitlistEntry"("referralCode");
CREATE UNIQUE INDEX IF NOT EXISTS "WaitlistEntry_verificationToken_key" ON "WaitlistEntry"("verificationToken");
CREATE INDEX IF NOT EXISTS "WaitlistEntry_status_webXp_idx" ON "WaitlistEntry"("status", "webXp");
CREATE INDEX IF NOT EXISTS "WaitlistEntry_referredById_idx" ON "WaitlistEntry"("referredById");
CREATE UNIQUE INDEX IF NOT EXISTS "WebXpLedger_waitlistEntryId_reason_sourceEntryId_key" ON "WebXpLedger"("waitlistEntryId", "reason", "sourceEntryId");
CREATE INDEX IF NOT EXISTS "WebXpLedger_waitlistEntryId_idx" ON "WebXpLedger"("waitlistEntryId");

DO $$ BEGIN
  ALTER TABLE "WaitlistEntry"
    ADD CONSTRAINT "WaitlistEntry_referredById_fkey"
    FOREIGN KEY ("referredById") REFERENCES "WaitlistEntry"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "WebXpLedger"
    ADD CONSTRAINT "WebXpLedger_waitlistEntryId_fkey"
    FOREIGN KEY ("waitlistEntryId") REFERENCES "WaitlistEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "WebXpLedger"
    ADD CONSTRAINT "WebXpLedger_sourceEntryId_fkey"
    FOREIGN KEY ("sourceEntryId") REFERENCES "WaitlistEntry"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

UPDATE "WaitlistEntry"
SET "founderPassStatus" = ("arcCardStatus"::text)::"FounderPassStatus"
WHERE "arcCardStatus" IS NOT NULL
  AND "founderPassStatus" = 'LOCKED';
