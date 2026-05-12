/**
 * Checks a message string against Madium server rules + Discord ToS.
 * Returns an array of human-readable violation descriptions.
 */
export function checkMessageForViolations(content: string): string[] {
  const violations: string[] = [];
  const lower = content.toLowerCase();

  // ── Discord ToS / Community Guidelines ──────────────────────────────────

  // NSFW / explicit content
  if (/\b(nsfw|pornhub|onlyfans|r34|rule\s?34|hentai|nude|nudes)\b/.test(lower)) {
    violations.push("Possible NSFW content (Discord ToS)");
  }

  // Hate speech / slurs — pattern-based, covers common cases
  if (/\b(nigger|nigga|faggot|tranny|chink|spic|kike|retard)\b/.test(lower)) {
    violations.push("Slur / hate speech detected");
  }

  // Threats of violence
  if (/\b(i('ll| will) (kill|hurt|ddos|dox|swat) (you|u|him|her|them))\b/.test(lower)) {
    violations.push("Threat of harm / DDoS / doxxing (Discord ToS)");
  }

  // Malware / RAT sharing
  if (/\b(rat|remote access trojan|malware|keylogger|stealer|grabber|token grabber)\b/.test(lower)) {
    violations.push("Malware / RAT reference");
  }

  // ── Madium Server-Specific Rules ────────────────────────────────────────

  // No cheats or exploits discussion
  if (/\b(cheat engine|aimbot|esp|wallhack|triggerbot|spinbot|bypass|executor|injector|byfron bypass|hyperion bypass)\b/.test(lower)) {
    violations.push("Cheat / exploit tool mention (server rule)");
  }

  // No mention of other Roblox dev software
  const competitorTools = [
    "synapse", "krnl", "fluxus", "delta hub", "wave executor",
    "arceus x", "scriptware", "solara", "hydrogen executor",
    "codex executor", "xeno", "electro hub", "evon", "comet executor",
  ];
  for (const tool of competitorTools) {
    if (lower.includes(tool)) {
      violations.push(`Competitor software mentioned: "${tool}" (server rule)`);
      break;
    }
  }

  // No spamming (crude heuristic: >5 repeated characters or >3 repeated words)
  if (/(.)\1{6,}/.test(content) || /(\b\w+\b)(?:\s+\1){3,}/i.test(content)) {
    violations.push("Spam / flooding detected");
  }

  // No politics
  if (/\b(democrat|republican|trump|biden|maga|election fraud|abortion debate|gun control debate|blm debate)\b/.test(lower)) {
    violations.push("Political conversation (server rule)");
  }

  // No earrape / loud audio keywords
  if (/\b(earrape|loud audio|bass boost 1000|earrape compilation)\b/.test(lower)) {
    violations.push("Earrape / excessive loud audio reference");
  }

  // Don't promote own dev tools
  if (/\b(check out my (tool|exploit|executor|software|script hub)|use my (tool|hub|executor))\b/.test(lower)) {
    violations.push("Self-promotion of dev tools (server rule)");
  }

  // Partnership requests
  if (/\b(partnership|partner with us|collab with our server|join our community)\b/.test(lower)) {
    violations.push("Partnership solicitation (server rule)");
  }

  // Fake/unofficial Madium site
  if (/madium/.test(lower) && !/getmadium\.net/.test(lower) && /http/.test(lower)) {
    violations.push("Unofficial Madium link (only getmadium.net is official)");
  }

  // Key system scripts in free scripts channel
  // Note: can't detect channel server-side in a simple content check,
  // but flag scripts containing key systems regardless
  if (/\b(key system|linkvertise|work\.ink|loot-link)\b/.test(lower)) {
    violations.push("Script with key system (not allowed in free scripts channel)");
  }

  // Reverse engineering / malware testing
  if (/\b(reverse engineer|decompile madium|crack madium|test malware on)\b/.test(lower)) {
    violations.push("Reverse engineering / malware testing attempt");
  }

  // Ban/mute evasion
  if (/\b(alt account|ban evad|mute evad|timeout evad|bypassing ban)\b/.test(lower)) {
    violations.push("Ban / mute evasion attempt");
  }

  // No homophobia / racism
  if (/\b(gay joke|no homo but|that's so gay|kill all \w+)\b/.test(lower)) {
    violations.push("Homophobic / racist language");
  }

  // Harassment
  if (/\b(kys|kill your?self|go die|neck yourself|rope yourself)\b/.test(lower)) {
    violations.push("Harassment / self-harm encouragement (Discord ToS)");
  }

  return violations;
}
