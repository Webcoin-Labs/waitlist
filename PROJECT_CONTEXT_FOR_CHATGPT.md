# Webcoin Labs Waitlist Page - Project Context

This file is a handoff snapshot of what exists in this repository right now. It is written so it can be sent to another ChatGPT session and that session can understand the frontend, backend, database, routes, flows, files, and current state without needing the original conversation.

Generated from workspace: `E:\webcoinlabs\waitlist-page`

Important: do not paste real `.env` values into ChatGPT. This document only lists required environment variable names and app behavior.

## 1. High-Level Summary

This is a production-oriented Next.js waitlist microsite for Webcoin Labs.

It includes:

- Public landing page for Webcoin Labs private early access.
- Multi-step waitlist signup form.
- Role selection for Founder, Builder, Investor, and Advisor.
- Referral code/link support.
- Email verification flow.
- WebXP points system.
- Private status dashboard after verification.
- Leaderboard/ranking.
- Launch tasks, including X sharing and verified-referral rewards.
- Founder Pass / Builder Pass positioning and eligibility surfaces.
- Admin dashboard for managing waitlist entries.
- Public Vercel-style documentation with search, responsive navigation, Help, Terms, and Privacy.
- Prisma schema and migrations for PostgreSQL.
- Email delivery through Resend or webhook fallback.
- Vitest tests for XP, ranking, tasks, Founder Pass direction, and display-name parsing.

## 2. Tech Stack

- Framework: Next.js 15 App Router
- UI: React 18, TypeScript, Tailwind CSS
- Animations/icons: Framer Motion, lucide-react
- Database: Prisma Client with PostgreSQL
- Validation: Zod
- Testing: Vitest
- Package manager: pnpm

Package name: `webcoin-labs-waitlist`

## 3. Main Scripts

From `package.json`:

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm typecheck
pnpm test
pnpm db:generate
pnpm db:push
```

Setup flow from `README.md`:

```bash
pnpm install
cp .env.example .env
pnpm db:generate
pnpm dev
```

Then open:

```text
http://localhost:3000
```

## 4. Environment Variables

Required / used env vars:

- `DATABASE_URL`
- `NEXT_PUBLIC_APP_URL`
- `WAITLIST_BASE_URL` optional alternative used for links
- `APP_ENCRYPTION_SECRET`
- `WAITLIST_ADMIN_TOKEN`
- `WAITLIST_LAUNCH_AT`
- `RESEND_API_KEY`
- `WAITLIST_FROM_EMAIL`
- `SIGNUP_FROM_EMAIL`
- `WAITLIST_EMAIL_REPLY_TO`
- `WAITLIST_EMAIL_WEBHOOK_URL`
- `WAITLIST_EMAIL_WEBHOOK_TOKEN`
- `NEXT_PUBLIC_ARC_X_HANDLE`
- `NEXT_PUBLIC_BASE_X_HANDLE`
- `FOUNDER_PASS_ELIGIBILITY_TASK_OPEN`

Do not share actual `.env` values. A local `.env` exists in the workspace and may contain secrets.

## 5. Routes and Pages

### `/`

File: `app/page.tsx`

Landing page. It reads an optional `?ref=` query parameter and passes it to the waitlist form.

Sections rendered on the page:

- Navigation with Webcoin Labs wordmark.
- `WaitlistHero`
- `FounderPassEligibilityStrip`
- `PartnerStrip`
- `PerksGrid`
- `FounderPassSection`
- `FounderPassInviteSection`
- `DashboardPreview`
- `WhoFor`
- `BeforeAfter`
- `WebXpSystem`
- `Faq`
- `FinalCta`
- `SiteFooter`

### `/verify`

File: `app/verify/page.tsx`

Email verification route.

Behavior:

- If `?token=` exists, calls `verifyWaitlistEmail(token)`.
- On success, redirects to `/status?c=<statusToken>`.
- On invalid/expired token, shows an error and optionally a resend panel.
- If no token exists, shows `VerifyEmailPanel`, optionally with email from `?e=`.

### `/docs` and `/docs/[[...slug]]`

Public product documentation rendered from `lib/docs/content.ts` through
`components/docs/DocsShell.tsx`. It includes 15 pages across Start, Platform,
Access, Trust, Support, and Legal. `/terms`, `/privacy`, and `/help` redirect to
their canonical docs pages.

### `/status`

File: `app/status/page.tsx`

Private waitlist dashboard.

Behavior:

- Reads `?c=<statusToken>`.
- Calls `getWaitlistStatus(statusToken)`.
- If missing/invalid, shows "Status not found".
- If found but not verified, shows `VerifyEmailPanel`.
- If verified, shows full dashboard through `WaitlistStatusPanel`.

Dashboard includes:

- Rank.
- WebXP.
- verified referral count.
- access tier.
- status.
- referral link copy/share.
- leaderboard.
- global/network stats.
- role-specific perks.
- Founder Pass card.
- launch tasks.

### `/admin`

File: `app/admin/page.tsx`

Admin dashboard.

Behavior:

- Uses `isAdminSession()`.
- If not authenticated, shows a passphrase form.
- Login uses `WAITLIST_ADMIN_TOKEN`.
- If authenticated, loads latest 500 waitlist entries.
- Calculates ranks for verified/invited/approved members.
- Renders `AdminWaitlistTable`.

Admin actions include:

- Set waitlist status.
- Set Founder Pass status.
- Set Founder Pass tier.
- Set Founder Pass track.
- Adjust WebXP by +50 or -50.
- Quick invite/approve/block/pass actions.
- Logout.

### `/enter`

File: `app/enter/page.tsx`

Legacy private-preview URL. It now redirects to the public landing page.

## 6. Middleware and Access Control

File: `middleware.ts`

The landing page is public. Middleware only assigns the anonymous, HttpOnly
device cookie used by signup fraud controls. Admin keeps its separate
`WAITLIST_ADMIN_TOKEN` authentication gate.

## 7. Server Actions

### `app/actions/waitlist.ts`

This is the main backend action file.

Core constants/helpers:

- Verification token TTL: 24 hours.
- `baseUrl()` builds absolute links using `WAITLIST_BASE_URL`, `NEXT_PUBLIC_APP_URL`, or local fallback.
- `hashValue()` hashes IP/user-agent with `APP_ENCRYPTION_SECRET`.
- `newToken()` creates email verification tokens.
- `newStatusToken()` creates private status dashboard tokens.
- `newReferralCode()` creates public referral codes.
- `normalizeReferralCodeInput()` accepts a raw code or a pasted referral URL.
- `referralLinkFor(code)` builds `/?ref=<code>`.
- `backfillStatusToken(id)` lazily fills status tokens for old entries.

Main user actions:

- `joinWaitlist(formData)`
- `resendWaitlistVerification(email)`
- `verifyWaitlistEmail(token)`
- `getWaitlistStatus(statusToken)`
- `getPublicWaitlistStat()`
- `recordXShareOpened(statusToken)`
- `confirmXSharePosted(statusToken)`
- `submitFounderPassEligibility(input)`

Admin actions:

- `adminSetWaitlistStatus(id, status)`
- `adminSetFounderPassStatus(id, founderPassStatus)`
- `adminSetFounderPassTier(id, founderPassTier)`
- `adminSetFounderPassTrack(id, founderPassTrack)`
- `adminAdjustWebXp(id, amount)`

Important security behavior:

- `referralCode` is public and shareable.
- `statusToken` is private and gates `/status` plus task completion actions.
- VC/Investor role requires a work/firm email and rejects common free inbox domains.
- IP and user-agent are hashed, not stored raw.
- Rate limits are applied to join, resend, status, and task actions.
- Admin errors are sanitized before returning to client.
- Server logs redact keys containing password, secret, token, authorization, cookie, or apikey.

### `app/actions/adminAuth.ts`

Actions:

- `adminLogin(formData)`
- `adminLogout()`

Behavior:

- Checks passphrase against `WAITLIST_ADMIN_TOKEN`.
- Sets or clears admin cookie.
- Logout redirects to `/admin`.

## 8. Waitlist Signup Flow

Frontend entry point: `components/waitlist/WaitlistForm.tsx`

Steps:

1. User enters email.
2. User selects role: Founder, Builder, Investor, Advisor.
3. User optionally provides referral code or referral URL.
4. Form includes UTM query params from the current URL if present.
5. Calls `joinWaitlist`.
6. If already verified, redirects to `/status?c=<statusToken>`.
7. Otherwise redirects to `/verify?e=<email>`.

Backend behavior:

1. Validates email, name, role, referral, UTM data with Zod.
2. Blocks free personal inboxes for Investor role.
3. Rate limits the request.
4. Hashes request IP and user agent.
5. Resolves referrer by referral code if provided.
6. Handles existing entries:
   - blocked: returns success without exposing details.
   - already verified: returns status token.
   - pending: regenerates verification token and resends email.
7. Creates new entry with:
   - email
   - name
   - role
   - referral code
   - private status token
   - optional referrer
   - verification token
   - UTM/source metadata
   - hashed IP/user-agent
8. Sends verification email.

## 9. Email Verification Flow

Verification email dispatch: `lib/notifications/waitlistVerification.ts`

Providers:

- Resend, if `RESEND_API_KEY` and from email are configured.
- Custom webhook, if `WAITLIST_EMAIL_WEBHOOK_URL` is configured.
- Console fallback in non-production.
- In production, if both real delivery methods fail, logs an error and returns failure.

Email is role-specific:

- Founder: Founder Pass messaging.
- Builder: Builder Pass messaging.
- Investor: investor access/deal-flow messaging.
- Advisor: advisor access/matching messaging.

Verification behavior in `verifyWaitlistEmail(token)`:

1. Rejects missing/short token.
2. Finds entry by `verificationToken`.
3. Rejects blocked entries.
4. If already verified, returns/backfills status token.
5. Rejects expired token.
6. Calculates signup WebXP based on launch window.
7. Transaction:
   - sets status to `VERIFIED`.
   - sets `emailVerifiedAt`.
   - clears verification token and expiry.
   - increments `webXp`.
   - sets Founder/Builder entries to `founderPassStatus = ELIGIBLE_SOON`.
   - creates `WebXpLedger` entry with reason `SIGNUP`.
   - if referred by a valid referrer, awards referral XP to referrer and increments verified referral count.
8. Returns private status token.

## 10. WebXP Rules

File: `lib/waitlist/xp.ts`

Launch-window rules:

- First 7 days from launch:
  - Signup verification: +100 WebXP.
  - Verified referral: +20 WebXP.
- After first 7 days:
  - Signup verification: +50 WebXP.
  - Verified referral: +10 WebXP.

Default launch fallback in code:

- `2026-07-05T00:00:00.000Z`

Production should use:

- `WAITLIST_LAUNCH_AT`

Ranking:

Only these statuses rank:

- `VERIFIED`
- `INVITED`
- `APPROVED`

Ranking comparator:

1. WebXP descending.
2. Verified referral count descending.
3. Earliest verification time ascending.

Access tier:

- Founder Pass status `ELIGIBLE`, `INVITED`, or `CLAIMED` -> `Founder Pass Candidate`.
- WebXP >= 200 -> `Priority Access`.
- Founder below threshold -> `Early Founder`.
- Others -> `Waitlist Member`.

## 11. Launch Tasks

File: `lib/waitlist/share.ts`

Task rewards:

- `X_SHARE`: +200 WebXP.
- `THREE_VERIFIED_REFERRALS`: +150 WebXP.
- `FOUNDER_PASS_ELIGIBILITY_CHECK`: +5000 WebXP.

X share:

- Builds share copy with referral URL.
- Supports optional Arc/Base X handles through env vars.
- Builds an X intent URL.

Task state is shown in `WaitlistStatusPanel`.

Backend task behavior:

- `recordXShareOpened(statusToken)` marks X-share task as pending confirmation/opened.
- `confirmXSharePosted(statusToken)` awards X-share WebXP once.
- `syncAutomaticTaskAwards()` automatically awards the 3 verified referrals task when eligible.
- `submitFounderPassEligibility()` is currently gated behind `FOUNDER_PASS_ELIGIBILITY_TASK_OPEN === "true"`.

Missing task table fallback:

- Some code catches missing `WaitlistTaskCompletion` table errors and returns empty task completion state, so older databases do not crash immediately.

## 12. Database Schema

File: `prisma/schema.prisma`

Datasource:

- PostgreSQL through `DATABASE_URL`.

Enums:

- `WaitlistRole`: `FOUNDER`, `BUILDER`, `INVESTOR`, `ADVISOR`
- `WaitlistStatus`: `PENDING_VERIFICATION`, `VERIFIED`, `INVITED`, `APPROVED`, `BLOCKED`
- `ArcCardStatus`: legacy-style card status values
- `FounderPassStatus`: `LOCKED`, `ELIGIBLE_SOON`, `ELIGIBLE`, `INVITED`, `CLAIMED`
- `FounderPassTier`: `BRONZE`, `SILVER`, `GOLD`, `PLATINUM`, `DIAMOND`
- `FounderPassTrack`: `ARC`, `BASE`, `BOTH`, `FARCASTER`, `SOLANA`, `POLYGON`, `OPTIMISM`, `OTHER`
- `WebXpReason`: `SIGNUP`, `REFERRAL`, `X_SHARE_TASK`, `THREE_VERIFIED_REFERRALS`, `FOUNDER_PASS_ELIGIBILITY_CHECK`, `ADMIN_ADJUSTMENT`
- `WaitlistTaskType`: `X_SHARE`, `THREE_VERIFIED_REFERRALS`, `FOUNDER_PASS_ELIGIBILITY_CHECK`
- `WaitlistTaskStatus`: `OPENED`, `PENDING_CONFIRMATION`, `COMPLETED`, `CLAIMED`

### `WaitlistEntry`

Fields:

- `id`
- `email`, unique
- `name`
- `role`
- `status`
- `referralCode`, unique public referral code
- `statusToken`, unique private dashboard/task token
- `referredById`
- `referredBy`
- `referrals`
- `webXp`
- `verifiedReferralCount`
- `emailVerifiedAt`
- `verificationToken`, unique
- `verificationExpiresAt`
- `arcCardStatus`
- `founderPassStatus`
- `founderPassTier`
- `founderPassTrack`
- `source`
- `utmSource`
- `utmMedium`
- `utmCampaign`
- `ipHash`
- `userAgentHash`
- `ledgerEntries`
- `referralLedger`
- `taskCompletions`
- `createdAt`
- `updatedAt`

Indexes:

- `[status, webXp]`
- `[referredById]`

### `WebXpLedger`

Tracks XP events.

Fields:

- `id`
- `waitlistEntryId`
- `entry`
- `amount`
- `reason`
- `sourceEntryId`
- `source`
- `createdAt`

Constraints:

- Unique `[waitlistEntryId, reason, sourceEntryId]` to prevent duplicate XP for the same reason/source.
- Index `[waitlistEntryId]`.

### `WaitlistTaskCompletion`

Tracks one-time launch tasks.

Fields:

- `id`
- `waitlistEntryId`
- `entry`
- `taskType`
- `status`
- `xpAwarded`
- `metadata`
- `openedAt`
- `completedAt`
- `confirmedAt`
- `createdAt`
- `updatedAt`

Constraints:

- Unique `[waitlistEntryId, taskType]`.
- Index `[waitlistEntryId]`.

## 13. Migrations

Existing migrations:

- `prisma/migrations/20260707000000_add_founder_pass_fields/migration.sql`
  - Creates waitlist-related enums/tables if missing.
  - Adds Founder Pass status/tier/track fields.
  - Creates indexes.
  - Creates foreign keys.
  - Copies old `arcCardStatus` into `founderPassStatus` where applicable.

- `prisma/migrations/20260708143000_add_waitlist_task_completions/migration.sql`
  - Adds new `WebXpReason` enum values for tasks.
  - Adds `BOTH` to `FounderPassTrack`.
  - Creates `WaitlistTaskType` and `WaitlistTaskStatus`.
  - Creates `WaitlistTaskCompletion`.
  - Adds unique/index and foreign key.

- `prisma/migrations/20260708150000_add_waitlist_status_token/migration.sql`
  - Adds `statusToken` to `WaitlistEntry`.
  - Creates unique index on `statusToken`.

## 14. Important Library Files

### `lib/prisma.ts`

Creates a Prisma client and stores it on `global.prisma` in non-production to avoid duplicate clients during dev reloads.

### `lib/rateLimit.ts`

Simple in-memory per-process rate limiter.

Limits are used by:

- waitlist joins
- resending verification emails
- status lookups
- task actions

Comment notes this should be swapped for something like Upstash if app runs multi-instance.

### `lib/adminAuth.ts`

Admin authentication helpers:

- `checkAdminPassphrase(input)`
- `setAdminCookie()`
- `clearAdminCookie()`
- `isAdminSession()`

Uses HMAC signed cookie `wcl_waitlist_admin`.

Admin cookie:

- httpOnly
- secure in production
- sameSite lax
- max age 8 hours

### `lib/logger.ts`

JSON logger with levels:

- info
- warn
- error

Redacts sensitive key names before logging.

### `lib/notifications/displayName.ts`

Derives a display name from an email local-part.

Supports:

- separator split, for example `anshit.raj`
- underscores/hyphens
- camelCase
- known-first-name split, for example `anshitraj4`
- generic mailbox rejection, for example `info`, `admin`, `noreply`

### `lib/waitlist/tokens.ts`

Central design tokens:

- `COLORS`
- `EASE`
- `GRAD`

Visual direction:

- light-first page
- off-white surfaces
- violet accent
- dark "island" panels for contrast

### `lib/waitlist/share.ts`

Defines task rewards and X share text/URL builders.

### `lib/waitlist/xp.ts`

Pure WebXP, launch window, ranking, and access-tier logic.

## 15. Frontend Components

All main UI is under `components/waitlist`.

### `WaitlistHero.tsx`

Landing hero.

Includes:

- private early access badge
- headline
- benefit list
- `WaitlistForm`
- hero mockup on desktop

### `WaitlistForm.tsx`

Client component for signup.

Features:

- two-step flow: email then role
- role cards with icons
- Founder/Builder pass previews
- Investor preview
- Advisor preview
- optional referral code/link input
- skip referral code button
- UTM capture
- calls `joinWaitlist`
- redirects to `/verify` or `/status`

### `VerifyEmailPanel.tsx`

Client panel after signup.

Features:

- progress steps
- shows email
- copy email button
- opens Gmail/Outlook/Yahoo webmail when detected
- resend verification email
- link back to restart

### `WaitlistStatusPanel.tsx`

Client dashboard for verified users.

Features:

- rank and WebXP summary
- referral link copy
- X share task
- task confirmation modal
- role-specific perks
- Founder Pass panel
- leaderboard
- global map/stats
- launch task cards

### `AdminWaitlistTable.tsx`

Client admin table.

Features:

- role filter
- status filter
- Founder Pass eligible filter
- sort by XP/referrals/date
- status dropdown
- Founder Pass status/tier/track dropdowns
- WebXP adjustment buttons
- quick invite/approve/pass/block actions

### `Brand.tsx`

Brand helpers:

- `Wordmark`
- `ArcMark`
- `GradientText`

Uses image assets from `public/logo`.

### `PartnerStrip.tsx`

Animated partner logo strip.

Partner names/assets currently include:

- MoonLift Capital
- HashVerse Capital
- Altava
- Bitbrawl
- Corite
- NUNU Spirits
- Startfi
- Drunk Robots
- Dreamboat Capital
- LaunchZone InnoX
- Bitrue
- HG
- Solv
- BitMart
- YZiLabs

### Other landing/status components

- `BeforeAfter.tsx`: before/after positioning section.
- `DashboardPreview.tsx`: rich product dashboard preview.
- `Faq.tsx`: FAQ section.
- `FinalCta.tsx`: final waitlist call-to-action.
- `FounderPassEligibilityStrip.tsx`: eligibility messaging strip.
- `FounderPassInviteSection.tsx`: Founder Pass invite/benefits section.
- `FounderPassSection.tsx`: Founder Pass explainer section.
- `GlobalMap.tsx`: status dashboard map/stat component.
- `HeroMockup.tsx`: landing hero product mockup.
- `PerksGrid.tsx`: benefits/perks grid.
- `SiteFooter.tsx`: footer.
- `TiltCard.tsx`: reusable tilt card interaction.
- `WebXpSystem.tsx`: WebXP explainer section.
- `WhoFor.tsx`: audience/role section.

## 16. Public Assets

Asset folders:

- `public/logo`
- `public/partners`
- `public/role-icons`
- `public/maps`

Logo assets include Webcoin wordmarks/marks, Arc, Base, Circle, Bitcoin, Solana, Zama, and tier/rank images.

Partner logo assets are used by `PartnerStrip`.

Role icons:

- advisor handshake
- builder hammer
- founder badge
- founder rocket
- investor chart

Map asset:

- `public/maps/simplemaps-world.svg`

## 17. Styling

Global CSS: `app/globals.css`

Includes:

- Tailwind base/components/utilities.
- light color scheme.
- system font stack.
- body background `#f8f7fb`.
- selection color.
- `wl-shine` keyframes.
- `wl-marquee` keyframes.
- reduced-motion support for marquee.

Tailwind config:

- Scans `app`, `components`, and `lib`.
- No custom theme extensions currently.

Next config:

- Allows remote images over HTTPS from any hostname through `images.remotePatterns`.

## 18. Tests

Test config: `vitest.config.ts`

- Alias `@` to project root.
- Includes `tests/**/*.test.ts`.
- Environment: node.

Test files:

### `tests/waitlist-xp.test.ts`

Covers:

- launch window boundary
- signup XP
- referral XP
- ranking comparator
- access tier
- ranked statuses

### `tests/waitlist-tasks.test.ts`

Covers:

- task reward constants
- X intent URL encoding
- network handle fallback behavior
- schema includes task completion model/enums and one-time task key

### `tests/waitlist-founder-pass.test.ts`

Covers:

- Founder Pass schema fields
- old product labels removed from UI source
- role is collected after email, not as old upfront tabs
- Founder Pass appears in status and admin surfaces

### `tests/waitlist-display-name.test.ts`

Covers:

- email local-part display-name derivation
- separators
- camelCase
- generic mailbox fallback to null
- single-token fallback

## 19. Current Git Working Tree Snapshot

At the time this document was created, the working tree had uncommitted modifications in:

- `app/actions/waitlist.ts`
- `app/page.tsx`
- `components/waitlist/BeforeAfter.tsx`
- `components/waitlist/HeroMockup.tsx`
- `components/waitlist/PerksGrid.tsx`
- `components/waitlist/WaitlistForm.tsx`
- `components/waitlist/WaitlistHero.tsx`
- `components/waitlist/WhoFor.tsx`
- `lib/notifications/waitlistVerification.ts`
- `middleware.ts`

There was also an untracked local file:

- `.env.development`

The new file you are reading is also a documentation artifact and may be untracked until committed.

## 20. Important Product Copy / Positioning

The product is positioned as:

- Webcoin Labs waitlist.
- The OS / operating layer for founders and serious builders.
- Private early access.
- Founder Pass and Builder Pass eligibility.
- WebXP as promotional in-app points.
- Referral-driven access and leaderboard.
- Founder/builder/investor/advisor network.

Important legal/product disclaimer repeated in README, UI, and emails:

WebXP and Founder Pass are promotional access/reward signals only. They have no monetary value, token value, airdrop value, ownership rights, investment rights, or financial rights.

## 21. Main Data Flow Summary

### Signup to verification

```text
Landing page
  -> WaitlistForm
  -> joinWaitlist server action
  -> WaitlistEntry created or updated
  -> verification email dispatched
  -> user lands on /verify?e=<email>
```

### Verification to status dashboard

```text
User clicks email link /verify?token=<token>
  -> verifyWaitlistEmail
  -> marks entry VERIFIED
  -> awards signup WebXP
  -> awards referrer XP if applicable
  -> redirects to /status?c=<private statusToken>
  -> WaitlistStatusPanel renders dashboard
```

### Referral flow

```text
Verified user copies /?ref=<referralCode>
  -> new user joins with ref
  -> referred user verifies email
  -> referrer gets referral WebXP
  -> referrer's verifiedReferralCount increments
  -> leaderboard updates
```

### Task flow

```text
Verified user opens X share
  -> recordXShareOpened
  -> user confirms posted
  -> confirmXSharePosted
  -> one-time task XP awarded
```

### Admin flow

```text
/admin
  -> passphrase form
  -> adminLogin
  -> signed admin cookie
  -> admin table
  -> admin server actions mutate waitlist entries
```

## 22. Known Operational Notes

- Run migrations before production traffic:

```bash
pnpm prisma migrate deploy
```

- Generate Prisma client after dependency install:

```bash
pnpm db:generate
```

- In-memory rate limiting is not durable across server instances.
- The local `.env` and `.env.development` files should not be sent to public chats.
- `statusToken` is intentionally separate from `referralCode`; never use referral code to authorize private status or task actions.
- Investor signup currently blocks common free email domains and asks for a firm/work email.
- Founder Pass eligibility task is present in backend but disabled unless `FOUNDER_PASS_ELIGIBILITY_TASK_OPEN` is true.

## 23. File Inventory

Root/config files:

- `.env.example`: example env names and placeholders.
- `.gitignore`: ignored files.
- `README.md`: setup, stack, env, verification, database notes.
- `middleware.ts`: anonymous fraud-control device cookie.
- `app/sitemap.ts`: landing and documentation sitemap entries.
- `next-env.d.ts`: Next TypeScript env declarations.
- `next.config.mjs`: Next config.
- `package.json`: scripts and dependencies.
- `pnpm-lock.yaml`: dependency lockfile.
- `postcss.config.mjs`: PostCSS config.
- `tailwind.config.ts`: Tailwind scan config.
- `tsconfig.json`: TypeScript config.
- `vitest.config.ts`: Vitest config.

App files:

- `app/globals.css`: global CSS.
- `app/layout.tsx`: root HTML/body and metadata.
- `app/page.tsx`: landing page.
- `app/actions/adminAuth.ts`: admin login/logout actions.
- `app/actions/waitlist.ts`: main waitlist backend actions.
- `app/admin/page.tsx`: admin page.
- `app/enter/page.tsx`: redirects legacy access-gate links to `/`.
- `app/status/page.tsx`: status dashboard page.
- `app/verify/page.tsx`: email verification page.
- `app/docs/[[...slug]]/page.tsx`: searchable documentation routes.
- `app/terms/page.tsx`, `app/privacy/page.tsx`, `app/help/page.tsx`: canonical docs redirects.

Component files:

- `components/docs/DocsShell.tsx`
- `components/waitlist/AdminWaitlistTable.tsx`
- `components/waitlist/BeforeAfter.tsx`
- `components/waitlist/Brand.tsx`
- `components/waitlist/DashboardPreview.tsx`
- `components/waitlist/Faq.tsx`
- `components/waitlist/FinalCta.tsx`
- `components/waitlist/FounderPassEligibilityStrip.tsx`
- `components/waitlist/FounderPassInviteSection.tsx`
- `components/waitlist/FounderPassSection.tsx`
- `components/waitlist/GlobalMap.tsx`
- `components/waitlist/HeroMockup.tsx`
- `components/waitlist/PartnerStrip.tsx`
- `components/waitlist/PerksGrid.tsx`
- `components/waitlist/SiteFooter.tsx`
- `components/waitlist/TiltCard.tsx`
- `components/waitlist/VerifyEmailPanel.tsx`
- `components/waitlist/WaitlistForm.tsx`
- `components/waitlist/WaitlistHero.tsx`
- `components/waitlist/WaitlistStatusPanel.tsx`
- `components/waitlist/WebXpSystem.tsx`
- `components/waitlist/WhoFor.tsx`

Library files:

- `lib/docs/content.ts`
- `lib/adminAuth.ts`
- `lib/logger.ts`
- `lib/prisma.ts`
- `lib/rateLimit.ts`
- `lib/utils.ts`
- `lib/notifications/displayName.ts`
- `lib/notifications/waitlistVerification.ts`
- `lib/waitlist/share.ts`
- `lib/waitlist/tokens.ts`
- `lib/waitlist/xp.ts`

Prisma files:

- `prisma/schema.prisma`
- `prisma/migrations/20260707000000_add_founder_pass_fields/migration.sql`
- `prisma/migrations/20260708143000_add_waitlist_task_completions/migration.sql`
- `prisma/migrations/20260708150000_add_waitlist_status_token/migration.sql`

Test files:

- `tests/waitlist-display-name.test.ts`
- `tests/waitlist-founder-pass.test.ts`
- `tests/waitlist-tasks.test.ts`
- `tests/waitlist-xp.test.ts`

Public asset folders:

- `public/logo`
- `public/maps`
- `public/partners`
- `public/role-icons`

## 24. What To Tell Another ChatGPT To Do With This

If you paste this into another ChatGPT, say something like:

```text
This is the full project context for my Webcoin Labs waitlist Next.js app.
Please use this as the source of truth for the current frontend, backend,
database schema, routes, flows, and known implementation details.
Do not assume any real env secret values.
```
