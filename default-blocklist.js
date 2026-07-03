// Starter list of well-known adult/18+ domains.
// This is intentionally a small seed list — extend it from the Options page,
// either one at a time or by pasting/importing a larger hosts-style list
// (e.g. a "adult" category file from a public domain-blocklist project).
const DEFAULT_BLOCKLIST = [
  "pornhub.com",
  "xvideos.com",
  "xnxx.com",
  "xhamster.com",
  "redtube.com",
  "youporn.com",
  "tube8.com",
  "spankbang.com",
  "chaturbate.com",
  "livejasmin.com",
  "onlyfans.com",
  "brazzers.com",
  "stripchat.com",
  "bongacams.com",
  "cam4.com",
  "myfreecams.com",
];

// exported for use by background.js (classic script, not a module)
if (typeof module !== "undefined") {
  module.exports = { DEFAULT_BLOCKLIST };
}
