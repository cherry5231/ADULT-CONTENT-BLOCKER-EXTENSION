importScripts("default-blocklist.js");

const RULE_ID_START = 1000;

async function getState() {
  const data = await chrome.storage.local.get({
    enabled: true,
    customDomains: [],
    pinHash: null,
  });
  return data;
}

function domainToRule(domain, id) {
  return {
    id,
    priority: 1,
    action: {
      type: "redirect",
      redirect: { extensionPath: "/blocked.html?site=" + encodeURIComponent(domain) },
    },
    condition: {
      requestDomains: [domain],
      resourceTypes: ["main_frame"],
    },
  };
}

async function rebuildRulesImpl() {
  const { enabled, customDomains } = await getState();

  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  const removeRuleIds = existing.map((r) => r.id);

  let addRules = [];
  if (enabled) {
    const allDomains = Array.from(
      new Set([...DEFAULT_BLOCKLIST, ...customDomains].map((d) => d.trim().toLowerCase()).filter(Boolean))
    );
    addRules = allDomains.map((domain, i) => domainToRule(domain, RULE_ID_START + i));
  }

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds,
    addRules,
  });
}

// Multiple triggers (onInstalled, onStartup, storage changes) can fire close
// together. declarativeNetRequest.updateDynamicRules isn't safe to run
// concurrently with itself, so we chain calls through this lock instead of
// letting them race, which is what caused the "does not have a unique ID" error.
let rebuildChain = Promise.resolve();
function rebuildRules() {
  rebuildChain = rebuildChain.then(rebuildRulesImpl).catch((err) => {
    console.error("rebuildRules failed:", err);
  });
  return rebuildChain;
}

chrome.runtime.onInstalled.addListener(async () => {
  const data = await chrome.storage.local.get(null);
  if (data.enabled === undefined) {
    await chrome.storage.local.set({ enabled: true, customDomains: [], pinHash: null });
  
    return;
  }
  rebuildRules();
});

chrome.runtime.onStartup.addListener(rebuildRules);


chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && (changes.enabled || changes.customDomains)) {
    rebuildRules();
  }
});


chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === "REBUILD_RULES") {
    rebuildRules().then(() => sendResponse({ ok: true }));
    return true; 
  }
});
