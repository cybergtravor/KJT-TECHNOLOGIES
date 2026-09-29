/**
 * =====================================================================
 * AUTHOR INITIALS & COLOR UTILITIES - KJT TECHNOLOGIES
 * =====================================================================
 * Motto: “Accelerating Innovation, Securing Data.”
 * 
 * Reusable utility providing:
 * - Deterministic, rule-compliant author initials generation
 * - Cohesive brand color theme assignment
 * 
 * Test cases:
 * - Jonathan Travor → JT
 * - Sarah Nakato → SN
 * - KJT Technologies → KT
 * - Peter → P
 * - John Michael Okello → JO
 * - Empty name / whitespace → KJ (fallback)
 * =====================================================================
 */

/**
 * Extracts up to two uppercase initials from an author's name.
 * 
 * Rules:
 * 1. Uses the first letter of the first name and first letter of the last name.
 * 2. For a single name, uses its first letter.
 * 3. For names with more than two words, uses the first letter of the first word
 *    and the first letter of the last word.
 * 4. Converts initials to uppercase.
 * 5. Ignores unnecessary spaces and special symbols.
 * 6. Limits the avatar to two initials.
 * 7. Falls back to "KJ" when the author name is empty or missing.
 */
export function getAuthorInitials(authorName?: string | null): string {
  if (!authorName || typeof authorName !== 'string') {
    return 'KJ';
  }

  // Remove extraneous punctuation/symbols (hashtags, brackets, emojis, etc.)
  const cleaned = authorName
    .replace(/[#*&@!?^%$~`|\\/[\]{}()_+=:;"'<>0-9]/g, ' ')
    .trim();

  if (!cleaned) {
    return 'KJ';
  }

  // Split by whitespace
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return 'KJ';
  }

  if (words.length === 1) {
    // Single word name: use its first letter
    const firstChar = words[0].charAt(0).toUpperCase();
    return firstChar || 'KJ';
  }

  // Two or more words: first letter of first word + first letter of last word
  const firstWord = words[0];
  const lastWord = words[words.length - 1];

  const firstChar = firstWord.charAt(0).toUpperCase();
  const lastChar = lastWord.charAt(0).toUpperCase();

  const initials = `${firstChar}${lastChar}`.trim();
  return initials || 'KJ';
}

/**
 * Color Theme structure matching KJT TECHNOLOGIES branding:
 * Navy blue, Electric blue, Cyan, Teal, Purple, Dark green.
 */
export interface AuthorColorTheme {
  name: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  shadowClass: string;
}

export const AUTHOR_COLOR_PALETTES: AuthorColorTheme[] = [
  // 1. Electric Blue (Primary Tech Accent)
  {
    name: 'electric-blue',
    bgClass: 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800',
    textClass: 'text-white',
    borderClass: 'border-blue-300/40 ring-1 ring-blue-400/30',
    shadowClass: 'shadow-sm shadow-blue-900/40',
  },
  // 2. Cyan / Turquoise (KJT Core Brand Accent)
  {
    name: 'cyan',
    bgClass: 'bg-gradient-to-br from-cyan-600 via-teal-700 to-cyan-800',
    textClass: 'text-white',
    borderClass: 'border-cyan-300/50 ring-1 ring-cyan-300/30',
    shadowClass: 'shadow-sm shadow-cyan-950/40',
  },
  // 3. Navy Blue / Deep Enterprise Slate
  {
    name: 'navy-blue',
    bgClass: 'bg-gradient-to-br from-[#0B1E3B] via-[#0F2748] to-slate-900',
    textClass: 'text-cyan-200',
    borderClass: 'border-[#00D4FF]/40 ring-1 ring-[#00D4FF]/20',
    shadowClass: 'shadow-sm shadow-slate-950/50',
  },
  // 4. Teal (Security & Infrastructure)
  {
    name: 'teal',
    bgClass: 'bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800',
    textClass: 'text-white',
    borderClass: 'border-teal-300/40 ring-1 ring-teal-400/20',
    shadowClass: 'shadow-sm shadow-teal-950/40',
  },
  // 5. Purple / Royal Indigo (Advanced Cloud & AI)
  {
    name: 'purple',
    bgClass: 'bg-gradient-to-br from-indigo-600 via-purple-700 to-purple-900',
    textClass: 'text-white',
    borderClass: 'border-purple-300/40 ring-1 ring-purple-400/20',
    shadowClass: 'shadow-sm shadow-purple-950/40',
  },
  // 6. Dark Green / Forest Emerald (Data Protection)
  {
    name: 'dark-green',
    bgClass: 'bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900',
    textClass: 'text-emerald-100',
    borderClass: 'border-emerald-300/40 ring-1 ring-emerald-400/20',
    shadowClass: 'shadow-sm shadow-emerald-950/40',
  },
];

/**
 * Deterministically generates a consistent background colour theme from an author's name.
 * The same author always receives the exact same colour palette.
 */
export function getAuthorColorTheme(authorName?: string | null): AuthorColorTheme {
  const name = (authorName || 'KJT Technologies').trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  const index = Math.abs(hash) % AUTHOR_COLOR_PALETTES.length;
  return AUTHOR_COLOR_PALETTES[index];
}
