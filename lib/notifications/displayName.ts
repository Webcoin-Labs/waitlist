// Pure string helper — no server-only import, safe to unit test directly.

const GENERIC_PREFIXES = new Set([
  "info", "admin", "support", "contact", "hello", "team", "sales", "help",
  "noreply", "no-reply", "test", "webmaster", "office", "hr", "careers",
  "jobs", "press", "media", "billing", "accounts", "enquiries", "inquiries",
  "service", "services", "mail", "postmaster", "abuse", "security",
]);

// Common first names used to greedily split concatenated local-parts
// (e.g. "anshitraj4" -> "anshit" + "raj") when no separator is present.
const COMMON_FIRST_NAMES = new Set([
  "aarav", "aarti", "aditya", "akash", "amit", "amitabh", "ananya", "angad",
  "anil", "anita", "ankit", "ankur", "anshit", "anshul", "anshuman", "anuj",
  "anushka", "arjun", "arnav", "arun", "ashish", "ashok", "avinash", "bhavesh",
  "chetan", "deepak", "devansh", "dhruv", "diya", "gaurav", "harsh", "harshit",
  "isha", "ishaan", "jai", "jatin", "kabir", "karan", "kartik", "kavya",
  "kiran", "kunal", "lakshya", "manish", "manoj", "meera", "mohit", "mukesh",
  "naina", "naman", "neha", "nikhil", "nikita", "nishant", "nitin", "om",
  "pankaj", "parth", "pooja", "prakash", "pranav", "prateek", "priya",
  "priyanka", "rahul", "raj", "rajat", "rajesh", "raju", "ravi", "riya",
  "rohan", "rohit", "sachin", "sahil", "sameer", "sandeep", "sanjay", "sarah",
  "shivam", "shreya", "shubham", "siddharth", "simran", "sneha", "sonia",
  "suresh", "tanvi", "tanya", "tarun", "uday", "umesh", "varun", "vijay",
  "vikas", "vikram", "vinay", "vipul", "vishal", "vivek", "yash", "yuvraj",
  "aiden", "alex", "alexander", "alice", "amanda", "amy", "andrew", "andy",
  "ann", "anna", "anthony", "ashley", "austin", "ben", "benjamin", "bob",
  "brian", "carlos",
  "charles", "charlie", "chris", "christian", "christina", "christopher",
  "daniel", "david", "dennis", "diana", "edward", "elizabeth", "emily",
  "emma", "eric", "ethan", "eva", "frank", "george", "grace", "hannah",
  "henry", "isabella", "jack", "jacob", "james", "jane", "jason", "jen", "jennifer",
  "jessica", "jim", "joe", "john", "jonathan", "jordan", "joseph", "joshua", "julia",
  "justin", "katherine", "kevin", "laura", "liam", "lisa", "lucas", "luke",
  "madison", "mark", "martin", "mary", "matthew", "max", "michael",
  "michelle", "mohammed", "natalie", "nathan", "nicholas", "nicole",
  "noah", "oliver", "olivia", "patricia", "patrick", "paul", "peter",
  "rachel", "raymond", "rebecca", "richard", "robert", "ryan", "samuel",
  "sara", "scott", "sean", "sophia", "stephanie", "steven", "susan",
  "thomas", "tyler", "victoria", "vincent", "walter", "william", "zoe",
]);

function titleCase(part: string): string {
  return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
}

function splitCamelCase(part: string): string[] {
  return part
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(/\s+/)
    .filter(Boolean);
}

/** Greedy longest-prefix match against a known first-name list, e.g. "anshitraj" -> ["anshit", "raj"]. */
function splitByKnownFirstName(blob: string): string[] | null {
  const lower = blob.toLowerCase();
  const maxPrefixLen = Math.min(lower.length - 2, 12);
  for (let len = maxPrefixLen; len >= 3; len -= 1) {
    const prefix = lower.slice(0, len);
    const rest = lower.slice(len);
    if (rest.length >= 2 && COMMON_FIRST_NAMES.has(prefix)) {
      return [prefix, rest];
    }
  }
  return null;
}

/**
 * Derives a display name from an email's local-part.
 * Returns null when not confident — callers should fall back to a neutral greeting.
 */
export function getDisplayNameFromEmail(email: string): string | null {
  // Keep original casing around for camelCase detection before normalizing.
  const rawPrefixOriginal = email.split("@")[0]?.trim() ?? "";
  if (!rawPrefixOriginal) return null;

  const noDigitsOriginal = rawPrefixOriginal.replace(/[0-9]+/g, "");
  if (!noDigitsOriginal) return null;

  const noDigits = noDigitsOriginal.toLowerCase();
  if (GENERIC_PREFIXES.has(noDigits)) return null;

  // Separator-based split: "anshit.raj" / "founder_team" / "jane-doe"
  const sepParts = noDigits.split(/[._\-+]+/).filter(Boolean);
  if (sepParts.length >= 2) {
    return sepParts.map(titleCase).join(" ");
  }

  const single = sepParts[0] ?? noDigits;
  if (!single || GENERIC_PREFIXES.has(single)) return null;

  // camelCase split needs the ORIGINAL casing — "JaneDoe" has no separator,
  // so noDigitsOriginal still carries the case transition at this point.
  const camelParts = splitCamelCase(noDigitsOriginal);
  if (camelParts.length >= 2) {
    return camelParts.map(titleCase).join(" ");
  }

  // Concatenated known-first-name split: "anshitraj" -> "anshit" + "raj"
  const dictSplit = splitByKnownFirstName(single);
  if (dictSplit) {
    return dictSplit.map(titleCase).join(" ");
  }

  // Single confident name-like token.
  if (/^[a-z]{2,20}$/i.test(single)) {
    return titleCase(single);
  }

  return null;
}
