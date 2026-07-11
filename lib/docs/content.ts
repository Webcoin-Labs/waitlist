export type DocsBlock =
  | { type: "paragraph"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "steps"; items: Array<{ title: string; text: string }> }
  | { type: "callout"; tone: "info" | "note" | "warning"; title: string; text: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "links"; items: Array<{ label: string; href: string; description: string }> };

export type DocsSection = {
  id: string;
  title: string;
  blocks: DocsBlock[];
};

export type DocsPage = {
  slug: string;
  group: "Start" | "Platform" | "Access" | "Trust" | "Brand" | "Support" | "Legal";
  title: string;
  description: string;
  updated?: string;
  sections: DocsSection[];
};

export const DOCS_PAGES: DocsPage[] = [
  {
    slug: "",
    group: "Start",
    title: "Webcoin Labs documentation",
    description: "Learn how Webcoin Labs helps founders and builders move from an idea to a credible, connected company.",
    sections: [
      {
        id: "what-is-webcoin-labs",
        title: "What is Webcoin Labs?",
        blocks: [
          {
            type: "paragraph",
            text: "Webcoin Labs is an operating layer for founders and builders. It brings startup workflows, verified builder discovery, access credentials, introductions, and launch signals into one place.",
          },
          {
            type: "callout",
            tone: "info",
            title: "Public tools roadmap",
            text: "Public Webcoin Labs tools are planned to begin rolling out at the start of Q4 2026. Timing, eligibility, and individual features may change as the beta develops.",
          },
        ],
      },
      {
        id: "choose-a-path",
        title: "Choose a path",
        blocks: [
          {
            type: "links",
            items: [
              { label: "Join the waitlist", href: "/docs/getting-started", description: "Create and verify your early-access profile." },
              { label: "Understand Credits", href: "/docs/platform/credits", description: "See how verified launch actions affect priority." },
              { label: "Explore access passes", href: "/docs/access/founder-pass", description: "Learn what Founder Pass and Builder Pass represent." },
              { label: "Get help", href: "/docs/help", description: "Resolve verification, referral, or dashboard issues." },
            ],
          },
        ],
      },
      {
        id: "principles",
        title: "How the platform is designed",
        blocks: [
          {
            type: "bullets",
            items: [
              "Proof before promises: verification and real work matter more than self-description.",
              "Useful introductions: network access is curated and never guaranteed by a point total alone.",
              "One founder operating layer: tools, people, progress signals, and access pathways live together.",
              "Clear boundaries: Credits and passes are access signals, not financial products.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "getting-started",
    group: "Start",
    title: "Getting started",
    description: "Join the waitlist, verify your email, and open your early-access dashboard.",
    sections: [
      {
        id: "before-you-begin",
        title: "Before you begin",
        blocks: [
          { type: "paragraph", text: "You need an email address you control and a role that best describes how you plan to use Webcoin Labs: Founder, Builder, Investor, or Advisor." },
          { type: "callout", tone: "note", title: "Investor email requirement", text: "Investor applications require a firm or work email. Common personal inbox providers are not accepted for that role." },
        ],
      },
      {
        id: "join",
        title: "Join in four steps",
        blocks: [
          {
            type: "steps",
            items: [
              { title: "Enter your email", text: "Use the primary email you want connected to your Webcoin Labs profile." },
              { title: "Select your role", text: "Choose Founder, Builder, Investor, or Advisor. Role selection shapes the access information shown later." },
              { title: "Apply a referral", text: "Paste an optional referral code or full referral link. You can join without one." },
              { title: "Verify your email", text: "Open the verification link within 24 hours. Verification activates your dashboard, Credits, and referral link." },
            ],
          },
        ],
      },
      {
        id: "after-verification",
        title: "After verification",
        blocks: [
          { type: "paragraph", text: "Your private dashboard shows your Credits, rank signal, verified referrals, role-specific access information, launch tasks, and pass status when available." },
          { type: "callout", tone: "warning", title: "Keep your dashboard link private", text: "The status link contains a private access token. Do not post it publicly. Share only the separate referral link shown inside your dashboard." },
        ],
      },
    ],
  },
  {
    slug: "platform/dashboard",
    group: "Platform",
    title: "Early-access dashboard",
    description: "Understand the status, ranking, task, and access information shown after verification.",
    sections: [
      {
        id: "overview",
        title: "Dashboard overview",
        blocks: [
          { type: "paragraph", text: "The dashboard is the source of truth for your waitlist profile. It is connected to your verified entry rather than the illustrative preview on the landing page." },
          { type: "bullets", items: ["Current Credits and verified referral count", "Relative rank and access tier", "Personal referral link", "Launch task progress", "Founder Pass or Builder Pass status", "Role-specific access notes and beta availability"] },
        ],
      },
      {
        id: "ranking",
        title: "How ranking works",
        blocks: [
          { type: "paragraph", text: "Verified, invited, and approved profiles are ordered by Credits, then verified referrals, then earliest verification time. A rank is a waitlist signal, not a guarantee of selection or access." },
        ],
      },
      {
        id: "status-language",
        title: "Status language",
        blocks: [
          { type: "table", headers: ["Status", "Meaning"], rows: [["Verified", "Email verification is complete and the profile can rank."], ["Eligible soon", "The profile may enter a future pass review when that path opens."], ["Eligible", "The profile meets the current review criteria; access is still subject to availability."], ["Invited", "Webcoin Labs has issued an invitation for the stated beta or access path."], ["Claimed", "The available credential or invitation has been accepted."]] },
        ],
      },
    ],
  },
  {
    slug: "platform/credits",
    group: "Platform",
    title: "Credits and ranking",
    description: "Credits are verified promotional points that help order early-access priority.",
    sections: [
      {
        id: "what-credits-are",
        title: "What Credits are",
        blocks: [
          { type: "paragraph", text: "Credits are an in-app promotional points and priority signal. They reflect verified waitlist actions and help Webcoin Labs order launch access and task progress." },
          { type: "callout", tone: "warning", title: "No financial value", text: "Credits have no monetary, token, airdrop, ownership, investment, or financial value. They cannot be bought, sold, transferred, redeemed for cash, or treated as a promise of a future distribution." },
        ],
      },
      {
        id: "earning-credits",
        title: "Current launch rewards",
        blocks: [
          { type: "table", headers: ["Verified action", "First 8 days", "After launch window"], rows: [["Verify signup", "+100 Credits", "+50 Credits"], ["Verified referral", "+50 Credits", "+10 Credits"], ["Confirmed X share task", "+200 Credits", "When available"], ["Three verified referrals", "+150 Credits", "When available"]] },
          { type: "paragraph", text: "Task values and availability can change. The current values shown in your dashboard control when they differ from this guide." },
        ],
      },
      {
        id: "integrity",
        title: "Credits integrity",
        blocks: [
          { type: "bullets", items: ["Signup Credits require email verification.", "Referral Credits require the invited person to verify.", "One-time tasks use unique award records to prevent duplicate claims.", "Fraudulent, automated, or coordinated activity can be removed or blocked.", "Webcoin Labs may correct balances created by technical errors or abuse."] },
        ],
      },
    ],
  },
  {
    slug: "platform/referrals",
    group: "Platform",
    title: "Referrals",
    description: "Invite people you genuinely recommend and understand when a referral becomes verified.",
    sections: [
      {
        id: "share-a-referral",
        title: "Share your referral link",
        blocks: [
          { type: "steps", items: [{ title: "Open your dashboard", text: "Use the private status link created after email verification." }, { title: "Copy the referral link", text: "The shareable URL contains your public referral code, not your private status token." }, { title: "Send it to a relevant person", text: "Invite founders, builders, investors, or advisors you would genuinely recommend." }, { title: "Wait for verification", text: "The referral appears in your verified count only after the invited person verifies their email." }] },
        ],
      },
      {
        id: "attribution",
        title: "Referral attribution",
        blocks: [
          { type: "paragraph", text: "A referral is attributed when a valid code is included during the new profile's signup. The same person cannot refer themselves, and blocked profiles do not create eligible rewards." },
          { type: "callout", tone: "note", title: "Missing code", text: "If a referral link did not apply automatically, paste the code or full referral URL in the optional referral field before joining." },
        ],
      },
      {
        id: "fair-use",
        title: "Fair-use rules",
        blocks: [
          { type: "bullets", items: ["Do not create or control extra email accounts to manufacture referrals.", "Do not buy, sell, exchange, or automate referral activity.", "Do not make misleading claims about guaranteed access, funding, tokens, or rewards.", "Repeated device, network, or email-domain patterns may trigger review or blocking."] },
        ],
      },
    ],
  },
  {
    slug: "access/founder-pass",
    group: "Access",
    title: "Founder Pass",
    description: "An invite-only access credential for founders building serious companies.",
    sections: [
      {
        id: "purpose",
        title: "Purpose",
        blocks: [
          { type: "paragraph", text: "Founder Pass is intended to identify founders who may benefit from deeper Webcoin Labs tools, builder discovery, investor-readiness support, advisor discovery, and curated network opportunities." },
          { type: "callout", tone: "warning", title: "Access credential only", text: "Founder Pass is not a payment card, token, NFT, investment product, financial product, ownership interest, or guarantee of funding." },
        ],
      },
      {
        id: "consideration",
        title: "How consideration works",
        blocks: [
          { type: "bullets", items: ["Maintain a verified Webcoin Labs profile.", "Provide accurate founder and company information when review opens.", "Show credible progress, clarity, and a real need for the relevant access path.", "Follow platform and referral integrity rules.", "Wait for an invitation; eligibility language alone is not an invitation."] },
        ],
      },
      {
        id: "availability",
        title: "Availability",
        blocks: [
          { type: "paragraph", text: "Founder Pass access is limited and may be introduced in phases. Criteria, supported programs, and benefits may change as Webcoin Labs moves from waitlist to public tools beginning in the planned Q4 2026 rollout." },
        ],
      },
    ],
  },
  {
    slug: "access/builder-pass",
    group: "Access",
    title: "Builder Pass",
    description: "A proof-based access credential for builders shipping verifiable work.",
    sections: [
      {
        id: "purpose",
        title: "Purpose",
        blocks: [
          { type: "paragraph", text: "Builder Pass is designed to recognize execution rather than self-description. Review may consider deployed products, contracts, mini apps, repositories, portfolio work, and meaningful ecosystem contributions." },
        ],
      },
      {
        id: "beta-tracks",
        title: "Current beta tracks",
        blocks: [
          { type: "paragraph", text: "Arc and Base are the current Builder Pass beta tracks. More ecosystems may be added later. Track availability does not guarantee selection, review, or a particular benefit." },
          { type: "callout", tone: "note", title: "Prepare proof", text: "Keep public repositories, deployed links, portfolio examples, and a concise explanation of your contribution ready for future eligibility review." },
        ],
      },
      {
        id: "boundaries",
        title: "Credential boundaries",
        blocks: [
          { type: "paragraph", text: "Builder Pass is an in-app access credential. It has no monetary, token, airdrop, ownership, investment, or financial value and is not transferable." },
        ],
      },
    ],
  },
  {
    slug: "access/founder-tools",
    group: "Access",
    title: "Founder tools",
    description: "The planned public toolkit for company-building workflows and decision support.",
    sections: [
      {
        id: "roadmap",
        title: "Q4 2026 rollout plan",
        blocks: [
          { type: "paragraph", text: "Webcoin Labs plans to begin releasing public founder tools at the start of Q4 2026. Rollout may be phased by tool, role, geography, capacity, or beta eligibility." },
          { type: "callout", tone: "info", title: "Roadmap, not a guarantee", text: "Planned dates and features are forward-looking. They may change based on testing, partner readiness, security, compliance, and product quality." },
        ],
      },
      {
        id: "planned-tools",
        title: "Planned tool areas",
        blocks: [
          { type: "bullets", items: ["Pitch-deck structure and review support", "Tokenomics planning and generation workflows", "Founder and builder directories", "Proof and reputation signals", "Investor-readiness workflows", "Advisor discovery and introductions", "Distribution, influencer, and ecosystem research"] },
        ],
      },
      {
        id: "responsible-use",
        title: "Responsible use",
        blocks: [
          { type: "paragraph", text: "Tool output is informational and may be incomplete. Founders remain responsible for reviewing business, legal, tax, financial, technical, and regulatory decisions with qualified professionals." },
        ],
      },
    ],
  },
  {
    slug: "access/network",
    group: "Access",
    title: "Network and introductions",
    description: "How directories, advisor discovery, and curated introductions are expected to work.",
    sections: [
      {
        id: "network",
        title: "Network scope",
        blocks: [
          { type: "paragraph", text: "Webcoin Labs is building discovery and access paths across founders, builders, advisors, investors, and launch partners. Current positioning includes a directory of 2,000+ VCs and angel investors and a planned directory of thousands of founders." },
          { type: "callout", tone: "note", title: "Directory access is not an endorsement", text: "A listing, match, or introduction does not mean Webcoin Labs endorses a person, company, investment, service, or opportunity." },
        ],
      },
      {
        id: "introductions",
        title: "Introduction requests",
        blocks: [
          { type: "bullets", items: ["Introductions are curated and depend on relevance, readiness, consent, and capacity.", "No founder is guaranteed an investor or advisor introduction.", "No introduction guarantees a meeting, investment, commercial relationship, or outcome.", "Recipients can decline an introduction without explanation.", "Do not use directory data for spam, scraping, resale, or mass outreach."] },
        ],
      },
      {
        id: "reputation",
        title: "Founder reputation roadmap",
        blocks: [
          { type: "paragraph", text: "Webcoin Labs plans to introduce reputation signals after the founder directory launches. The methodology, inputs, review process, and appeal options will be documented before any score materially affects access." },
        ],
      },
    ],
  },
  {
    slug: "trust/verification-security",
    group: "Trust",
    title: "Verification and account security",
    description: "Protect your email verification, private dashboard link, and profile activity.",
    sections: [
      {
        id: "email-verification",
        title: "Email verification",
        blocks: [
          { type: "paragraph", text: "Verification links expire after 24 hours and can be used once. If a link expires, request another from the verification screen. Webcoin Labs does not ask for your email password." },
        ],
      },
      {
        id: "private-links",
        title: "Private and public links",
        blocks: [
          { type: "table", headers: ["Link", "Sharing rule"], rows: [["Dashboard status link", "Private. It contains a status token and should not be shared."], ["Referral link", "Public. Share it with people you genuinely recommend."], ["Verification link", "Private and single-use. Open it only from the expected email."]] },
        ],
      },
      {
        id: "report-an-issue",
        title: "Report a security issue",
        blocks: [
          { type: "paragraph", text: "If you believe a private link, profile, or waitlist action was accessed without permission, contact Webcoin Labs immediately. Include the affected email and a description, but do not send passwords or unrelated secrets." },
          { type: "links", items: [{ label: "Contact support", href: "mailto:contact@webcoinlabs.com?subject=Security%20issue", description: "Email contact@webcoinlabs.com with a security issue." }] },
        ],
      },
    ],
  },
  {
    slug: "trust/abuse-prevention",
    group: "Trust",
    title: "Abuse prevention",
    description: "How Webcoin Labs protects waitlist integrity without storing raw network identifiers.",
    sections: [
      {
        id: "signals",
        title: "Signals used",
        blocks: [
          { type: "paragraph", text: "New signups are checked for disposable email providers and repeated activity patterns involving hashed IP, an anonymous first-party device cookie, and email domain. Raw IP addresses and raw device identifiers are not stored in the waitlist entry." },
        ],
      },
      {
        id: "outcomes",
        title: "Possible outcomes",
        blocks: [
          { type: "bullets", items: ["A disposable address is rejected before an entry is created.", "High-volume or combined suspicious activity can be temporarily blocked.", "A profile or reward can be reviewed for manipulation.", "Fraudulent Credits or referrals can be corrected or removed.", "Serious or repeated abuse can lead to blocking or loss of access."] },
        ],
      },
      {
        id: "false-positive",
        title: "If you were blocked incorrectly",
        blocks: [
          { type: "paragraph", text: "Shared office or community networks can occasionally resemble high-volume activity. Wait before retrying, use an email you control, and contact support if the issue continues." },
        ],
      },
    ],
  },
  {
    slug: "brand-assets",
    group: "Brand",
    title: "Brand assets",
    description: "Official Webcoin Labs logo files, usage guidelines, and attribution requirements for press, media, and partners.",
    updated: "Last updated: July 11, 2026",
    sections: [
      {
        id: "download",
        title: "Download brand assets",
        blocks: [
          {
            type: "links",
            items: [
              {
                label: "Download Brand Assets",
                href: "https://drive.google.com/drive/folders/1QET5OWe5B-GjYkzFFwMfBNVF8Jkk825t?usp=drive_link",
                description: "Logos, wordmarks, and marks in official file formats.",
              },
            ],
          },
          { type: "paragraph", text: "By downloading or using these files, you agree to the usage guidelines below." },
        ],
      },
      {
        id: "prohibited-uses",
        title: "Prohibited uses",
        blocks: [
          { type: "paragraph", text: "To preserve the integrity of the Webcoin Labs brand, the following are not permitted:" },
          {
            type: "bullets",
            items: [
              "Alteration — do not modify, distort, rotate, stretch, or skew the logo in any way.",
              "Color changes — do not change the logo's colors or apply gradients, tints, or effects not included in the official variations.",
              "Visual treatments — do not add drop shadows, outlines, glows, or other stylistic effects.",
              "Poor contrast — do not place the logo on busy or low-contrast backgrounds that reduce legibility.",
              "Implied endorsement — do not use the logo in a way that suggests Webcoin Labs endorses a product, service, cause, or viewpoint without prior written consent.",
              "Co-branding — do not combine the logo with other marks in a way that implies a partnership without Webcoin Labs' prior written approval.",
              "Incorporation into other marks — do not use the logo, or any element of it, as part of another company's name, product, or branding.",
              "Outdated assets — do not use any version of the logo that was not sourced from this page.",
              "Animation — do not animate the logo without prior written approval.",
            ],
          },
        ],
      },
      {
        id: "attribution",
        title: "Attribution and credit",
        blocks: [
          { type: "paragraph", text: "On first use in any document or publication, follow the brand name with the ™ symbol." },
          {
            type: "callout",
            tone: "note",
            title: "Standard credit line",
            text: "“Webcoin Labs and the Webcoin Labs logo are trademarks of Webcoin Labs. Used with permission.”",
          },
          {
            type: "paragraph",
            text: "Members of the press may use approved logo assets for factual editorial coverage without prior approval, provided the logo is reproduced without modification and the usage does not imply endorsement of any product, service, or viewpoint.",
          },
        ],
      },
      {
        id: "repository-use",
        title: "Using these assets in a code repository",
        blocks: [
          {
            type: "paragraph",
            text: "If the Webcoin Labs logo is included or referenced alongside software in a public repository (GitHub, GitLab, or similar), these guidelines apply regardless of the repository's software license. A code license does not extend to brand assets — logo files and trademarks are not transferable under any open-source license.",
          },
          {
            type: "table",
            headers: ["License type", "What you need to do"],
            rows: [
              ["Permissive (MIT, BSD, ISC)", "Keep all copyright and trademark notices intact. Do not imply the logo is covered by the same permissive terms as your code. Credit Webcoin Labs in your README or NOTICE file."],
              ["Permissive with notice requirements (Apache 2.0)", "Preserve all trademark and attribution notices. Include the credit line in your NOTICE file if one exists."],
              ["Copyleft (GPL v2, GPL v3, AGPL)", "Keep the logo clearly separated from open-source components (for example, its own /branding folder). State in your LICENSE or README that Webcoin Labs assets are excluded from the repository's open-source license."],
              ["Weak copyleft (LGPL, MPL 2.0)", "Same separation and exclusion requirements as copyleft. Modifications to the logo are never permitted, regardless of license terms."],
            ],
          },
          {
            type: "bullets",
            items: [
              "Do not include logo files in a public repository without written permission — email contact@webcoinlabs.com first.",
              "The presence of the logo in a repository does not imply a partnership, sponsorship, or endorsement.",
              "Include a clear attribution notice in your README.md or a dedicated NOTICE file using the standard credit line above.",
            ],
          },
        ],
      },
      {
        id: "third-party-logos",
        title: "Third-party logos on this site",
        blocks: [
          {
            type: "paragraph",
            text: "This website may display logos, trademarks, and service marks of partners, ecosystems, or other third parties. Such logos are the property of their respective owners and are shown solely for identification purposes.",
          },
          {
            type: "bullets",
            items: [
              "Inclusion of a logo does not imply current or past endorsement, sponsorship, or affiliation by either party.",
              "It does not indicate the entity is a client, investor, or partner unless expressly stated.",
              "It should not be read as a recommendation or testimonial.",
            ],
          },
        ],
      },
      {
        id: "questions",
        title: "Questions and permissions",
        blocks: [
          {
            type: "paragraph",
            text: "Uses not covered by these guidelines require prior written approval. Webcoin Labs can revoke permission to use its assets at any time if these guidelines are not followed.",
          },
          {
            type: "links",
            items: [{ label: "Request permission", href: "mailto:contact@webcoinlabs.com?subject=Brand%20asset%20permission", description: "Describe the intended use and any supporting materials." }],
          },
        ],
      },
    ],
  },
  {
    slug: "help",
    group: "Support",
    title: "Help and support",
    description: "Get help with verification, dashboard access, referrals, Credits, or pass information.",
    sections: [
      {
        id: "contact",
        title: "Contact Webcoin Labs",
        blocks: [
          { type: "links", items: [{ label: "Email support", href: "mailto:contact@webcoinlabs.com", description: "contact@webcoinlabs.com" }, { label: "Telegram", href: "https://t.me/thewebcoinlabs", description: "Community updates and public conversation." }, { label: "X", href: "https://x.com/webcoinlabs", description: "Product and launch updates." }, { label: "LinkedIn", href: "https://www.linkedin.com/company/webcoin-capital", description: "Company updates and network information." }] },
        ],
      },
      {
        id: "include",
        title: "What to include",
        blocks: [
          { type: "bullets", items: ["The email connected to your profile", "The page or action where the issue occurred", "A concise description of what you expected and what happened", "A screenshot with private tokens and unrelated personal data removed", "The approximate time of the issue and your timezone"] },
          { type: "callout", tone: "warning", title: "Do not send secrets", text: "Never email passwords, verification tokens, private dashboard URLs, wallet seed phrases, private keys, or full identity documents." },
        ],
      },
      {
        id: "response",
        title: "Support boundaries",
        blocks: [
          { type: "paragraph", text: "Webcoin Labs can help with product access and waitlist records. Support does not provide legal, tax, investment, fundraising, or financial advice and cannot guarantee invitations, introductions, funding, or release dates." },
        ],
      },
    ],
  },
  {
    slug: "faq",
    group: "Support",
    title: "Documentation FAQ",
    description: "Short answers to common launch and documentation questions.",
    sections: [
      { id: "public-launch", title: "When do public tools launch?", blocks: [{ type: "paragraph", text: "The first public Webcoin Labs tools are planned to begin rolling out at the start of Q4 2026. The roadmap can change, and individual tools may launch in phases." }] },
      { id: "waitlist", title: "Does joining guarantee access?", blocks: [{ type: "paragraph", text: "No. Joining creates a verified profile for consideration. Invitations, tools, passes, reviews, and introductions depend on fit, availability, and current beta criteria." }] },
      { id: "credits", title: "Are Credits money or tokens?", blocks: [{ type: "paragraph", text: "No. Credits are non-transferable promotional in-app points with no monetary, token, airdrop, ownership, investment, or financial value." }] },
      { id: "funding", title: "Does Webcoin Labs guarantee fundraising?", blocks: [{ type: "paragraph", text: "No. Directories, readiness support, and introductions can help founders prepare and connect, but no meeting, investment, amount raised, or outcome is guaranteed." }] },
      { id: "delete", title: "How do I request access to or deletion of my data?", blocks: [{ type: "paragraph", text: "Email contact@webcoinlabs.com from the address connected to the profile. Webcoin Labs may request reasonable verification before acting on a privacy request." }] },
    ],
  },
  {
    slug: "legal/terms",
    group: "Legal",
    title: "Terms of use",
    description: "Terms governing the Webcoin Labs website, waitlist, dashboard, documentation, and beta services.",
    updated: "Effective July 11, 2026",
    sections: [
      { id: "acceptance", title: "1. Acceptance", blocks: [{ type: "paragraph", text: "By accessing or using the Webcoin Labs website, waitlist, documentation, dashboard, communications, or beta features, you agree to these Terms. If you do not agree, do not use the services." }] },
      { id: "eligibility", title: "2. Eligibility and authority", blocks: [{ type: "paragraph", text: "You must be legally able to enter this agreement and at least 18 years old. If you use Webcoin Labs for an organization, you represent that you have authority to bind that organization." }] },
      { id: "beta", title: "3. Waitlist and beta services", blocks: [{ type: "bullets", items: ["Joining the waitlist does not guarantee access, review, an invitation, a pass, an introduction, or any outcome.", "Beta features may be incomplete, unavailable, changed, suspended, or discontinued without notice.", "The planned Q4 2026 public-tools rollout is a roadmap and not a binding release commitment.", "You must provide accurate information and keep private dashboard and verification links confidential."] }] },
      { id: "acceptable-use", title: "4. Acceptable use", blocks: [{ type: "paragraph", text: "You may not misuse Webcoin Labs, interfere with the service, bypass controls, scrape or resell directory data, impersonate another person, submit unlawful or deceptive content, automate fake activity, create fraudulent referrals, probe for vulnerabilities without authorization, or use the platform to spam or harass others." }] },
      { id: "credits", title: "5. Credits, referrals, and passes", blocks: [{ type: "bullets", items: ["Credits are promotional points only and have no monetary, token, airdrop, ownership, investment, or financial value.", "Credits and passes are non-transferable and cannot be sold, purchased, redeemed, or exchanged.", "Referral and task rewards require the stated verified action and may be reviewed for abuse.", "Webcoin Labs may correct technical mistakes, reverse fraudulent activity, change reward rules, or end a promotion.", "Founder Pass and Builder Pass are access credentials, not financial products or guarantees of services."] }] },
      { id: "introductions", title: "6. Networks and introductions", blocks: [{ type: "paragraph", text: "Directory access and introductions depend on relevance, consent, readiness, and availability. Webcoin Labs does not guarantee a response, meeting, partnership, investment, fundraising result, employment result, or other outcome and does not endorse a listed participant merely by displaying or matching them." }] },
      { id: "content", title: "7. Your content and feedback", blocks: [{ type: "paragraph", text: "You retain ownership of information and content you submit. You grant Webcoin Labs a limited right to host, process, reproduce, and display that content as needed to operate, secure, and improve the services. Feedback may be used without restriction or compensation, provided it does not identify you publicly without permission." }] },
      { id: "intellectual-property", title: "8. Webcoin Labs materials", blocks: [{ type: "paragraph", text: "The services, branding, documentation, software, designs, and original materials are owned by Webcoin Labs or its licensors and are protected by applicable law. These Terms do not transfer ownership. You may use the documentation for your internal, lawful use of the service." }] },
      { id: "third-parties", title: "9. Third-party services", blocks: [{ type: "paragraph", text: "Webcoin Labs may link to or rely on third-party email, hosting, database, analytics, monitoring, social, ecosystem, or network services. Their products and policies are controlled by them. Webcoin Labs is not responsible for third-party services or decisions." }] },
      { id: "disclaimers", title: "10. Disclaimers", blocks: [{ type: "paragraph", text: "The services and documentation are provided on an as-is and as-available basis to the extent permitted by law. Webcoin Labs does not promise uninterrupted availability, error-free output, business success, funding, compliance, or fitness for a particular purpose. Nothing provided is legal, tax, investment, accounting, or financial advice." }] },
      { id: "liability", title: "11. Limitation of liability", blocks: [{ type: "paragraph", text: "To the maximum extent permitted by applicable law, Webcoin Labs will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages, lost profits, lost opportunities, lost data, or business interruption arising from the services. Rights that cannot legally be limited remain unaffected." }] },
      { id: "suspension", title: "12. Suspension and termination", blocks: [{ type: "paragraph", text: "Webcoin Labs may restrict, suspend, or terminate access when reasonably necessary to protect users, comply with law, address abuse or security risk, enforce these Terms, or operate the beta. You may stop using the service at any time and can request account-data deletion subject to applicable retention duties." }] },
      { id: "changes", title: "13. Changes to these Terms", blocks: [{ type: "paragraph", text: "These Terms may be updated as Webcoin Labs develops. The effective date will be revised when material changes are published. Continued use after an update means you accept the revised Terms where permitted by law." }] },
      { id: "contact", title: "14. Contact", blocks: [{ type: "paragraph", text: "Questions about these Terms can be sent to contact@webcoinlabs.com. Additional entity, payment, or jurisdiction-specific terms may be presented before contracted or paid services are offered." }] },
    ],
  },
  {
    slug: "legal/privacy",
    group: "Legal",
    title: "Privacy notice",
    description: "How Webcoin Labs collects, uses, shares, protects, and manages personal information.",
    updated: "Effective July 11, 2026",
    sections: [
      { id: "scope", title: "1. Scope", blocks: [{ type: "paragraph", text: "This notice applies to personal information processed through the Webcoin Labs website, waitlist, verification emails, dashboard, documentation, support, and beta services. It does not control independent third-party websites or services." }] },
      { id: "collect", title: "2. Information we collect", blocks: [{ type: "bullets", items: ["Profile information such as email, optional name, role, status, and access preferences", "Waitlist information such as referral code, referring profile, verification state, Credits, rank signals, tasks, and pass status", "Source information such as campaign, medium, and source parameters when present", "Security information such as hashed IP, hashed anonymous device identifier, browser metadata, rate-limit activity, and fraud-risk flags", "Support communications and information you choose to provide", "Operational information such as delivery provider results, errors, and sanitized application logs"] }] },
      { id: "use", title: "3. How we use information", blocks: [{ type: "bullets", items: ["Create, verify, and maintain waitlist and beta profiles", "Provide dashboards, referrals, Credits, tasks, access reviews, and requested communications", "Rank verified profiles and evaluate current access criteria", "Prevent disposable-email abuse, fraudulent referrals, automated activity, and security incidents", "Operate, debug, monitor, analyze, and improve Webcoin Labs", "Respond to support, privacy, legal, and compliance requests", "Enforce terms and protect users, partners, and the service"] }] },
      { id: "cookies", title: "4. Cookies and device security", blocks: [{ type: "paragraph", text: "Webcoin Labs uses an HttpOnly, first-party anonymous device cookie to recognize repeated signup activity and protect waitlist integrity. The stored waitlist signal is hashed. The service may also use essential cookies for authenticated admin functions. Browser controls can remove cookies, but doing so may affect security checks or access." }] },
      { id: "sharing", title: "5. How information is shared", blocks: [{ type: "paragraph", text: "Information may be shared with service providers that support hosting, databases, email delivery, monitoring, security, analytics, and customer support; with professional advisers; in a business transaction; or when required to comply with law and protect rights or safety. Webcoin Labs does not sell personal information for money." }, { type: "callout", tone: "note", title: "Introductions require context", text: "Information is not sent to a potential investor, advisor, founder, builder, or partner as an introduction without a relevant product workflow, request, consent, or other appropriate basis." }] },
      { id: "legal-bases", title: "6. Legal bases", blocks: [{ type: "paragraph", text: "Depending on your location, processing may rely on your consent, steps taken at your request, performance of an agreement, legitimate interests in operating and securing the service, or compliance with legal obligations." }] },
      { id: "retention", title: "7. Retention", blocks: [{ type: "paragraph", text: "Information is kept only as long as reasonably necessary for the purposes described, including maintaining the waitlist, preventing fraud, resolving disputes, enforcing agreements, and meeting legal obligations. Retention periods can vary by record type. Data may be deleted, anonymized, or aggregated when no longer required." }] },
      { id: "security", title: "8. Security", blocks: [{ type: "paragraph", text: "Webcoin Labs uses measures intended to protect information, including one-time verification tokens, private status tokens, hashed network and device identifiers, restricted admin access, rate limits, disposable-email controls, structured error monitoring, and log redaction. No system can guarantee absolute security." }] },
      { id: "international", title: "9. International processing", blocks: [{ type: "paragraph", text: "Webcoin Labs and its providers may process information in countries other than your own. Where required, appropriate safeguards will be used for cross-border transfers." }] },
      { id: "rights", title: "10. Your choices and rights", blocks: [{ type: "bullets", items: ["Request access to or correction of profile information", "Request deletion, restriction, or objection where applicable", "Withdraw consent where processing depends on consent", "Opt out of non-essential marketing communications", "Ask for a portable copy where applicable", "Complain to an appropriate data-protection authority"] }, { type: "paragraph", text: "To make a request, email contact@webcoinlabs.com from the address associated with the profile. Reasonable identity verification may be required." }] },
      { id: "children", title: "11. Children", blocks: [{ type: "paragraph", text: "Webcoin Labs is intended for adults and is not directed to children under 18. If you believe a child submitted personal information, contact Webcoin Labs so the record can be reviewed." }] },
      { id: "changes", title: "12. Changes to this notice", blocks: [{ type: "paragraph", text: "This notice may be updated as products, providers, or legal requirements change. The effective date will be revised when an updated notice is published." }] },
      { id: "contact", title: "13. Contact", blocks: [{ type: "paragraph", text: "Privacy questions and requests can be sent to contact@webcoinlabs.com. Additional region-specific privacy information will be provided where required by applicable law." }] },
    ],
  },
];

export const DOCS_GROUPS = ["Start", "Platform", "Access", "Trust", "Brand", "Support", "Legal"] as const;

export function docsHref(slug: string) {
  return slug ? `/docs/${slug}` : "/docs";
}

export function getDocsPage(slugParts?: string[]) {
  const slug = (slugParts ?? []).join("/");
  return DOCS_PAGES.find((page) => page.slug === slug);
}

export function docsPageText(page: DocsPage) {
  const blockText = page.sections.flatMap((section) =>
    section.blocks.flatMap((block) => {
      if (block.type === "paragraph") return [block.text];
      if (block.type === "bullets") return block.items;
      if (block.type === "steps") return block.items.flatMap((item) => [item.title, item.text]);
      if (block.type === "callout") return [block.title, block.text];
      if (block.type === "table") return [...block.headers, ...block.rows.flat()];
      return block.items.flatMap((item) => [item.label, item.description]);
    }),
  );
  return [page.title, page.description, ...blockText].join(" ").toLowerCase();
}
