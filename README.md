# Webcoin Labs Waitlist

Production-ready Next.js waitlist microsite for Webcoin Labs early access, WebXP, referrals, Founder Pass eligibility, and email verification.

## Stack

- Next.js 15 App Router
- React 18
- Prisma + PostgreSQL
- Vitest
- Tailwind CSS

## Local Setup

```bash
pnpm install
cp .env.example .env
pnpm db:generate
pnpm dev
```

Open `http://localhost:3000`.

## Required Production Env

Set these in the hosting provider before launch:

- `DATABASE_URL`
- `NEXT_PUBLIC_APP_URL`
- `APP_ENCRYPTION_SECRET`
- `WAITLIST_ADMIN_TOKEN`
- `WAITLIST_LAUNCH_AT`

Email verification needs either:

- `RESEND_API_KEY` and `WAITLIST_FROM_EMAIL`
- or `WAITLIST_EMAIL_WEBHOOK_URL` and optional `WAITLIST_EMAIL_WEBHOOK_TOKEN`

Operational alerts use:

- `WAITLIST_ALERT_WEBHOOK_URL`
- optional `WAITLIST_ALERT_WEBHOOK_TOKEN`

The alert webhook receives sanitized JSON for unhandled server errors,
email-delivery failures, and high-risk signup blocks. Email addresses, raw IPs,
device identifiers, cookies, verification tokens, and private status tokens are
not included.

## Signup abuse protection

New signups are checked against a built-in disposable-email domain list and
combined activity from hashed IP, anonymous first-party device cookie, and
email domain. Existing entries can still resend verification without creating
another account. The default limits are intentionally tolerant of shared Wi-Fi
and can be tuned with:

- `WAITLIST_MAX_SIGNUPS_PER_IP_HOUR`
- `WAITLIST_MAX_SIGNUPS_PER_IP_DAY`
- `WAITLIST_MAX_SIGNUPS_PER_DEVICE_DAY`
- `WAITLIST_MAX_SIGNUPS_PER_IP_DOMAIN_DAY`
- `WAITLIST_MAX_SIGNUPS_PER_DEVICE_DOMAIN_DAY`
- `WAITLIST_DISPOSABLE_EMAIL_DOMAINS` for comma-separated local additions

## Verification

```bash
pnpm test
pnpm build
```

## Database

This app uses the waitlist-related tables in the shared Webcoin Labs PostgreSQL database.

Apply migrations before production traffic:

```bash
pnpm prisma migrate deploy
```

## Notes

WebXP and Founder Pass are access/reward signals only. They have no monetary value, token value, airdrop value, ownership rights, investment rights, or financial rights.
