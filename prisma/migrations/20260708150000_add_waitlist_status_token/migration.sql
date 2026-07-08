-- Separate private status-page access from the publicly-shared referralCode.
-- referralCode stays public (used in /?ref= links); statusToken is private
-- and gates /status + task-completion actions.
ALTER TABLE "WaitlistEntry" ADD COLUMN "statusToken" TEXT;

CREATE UNIQUE INDEX "WaitlistEntry_statusToken_key" ON "WaitlistEntry"("statusToken");
