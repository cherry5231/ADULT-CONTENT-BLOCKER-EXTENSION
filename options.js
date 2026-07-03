const enabledToggle = document.getElementById("enabledToggle");
const pinStatus = document.getElementById("pinStatus");
const pinSetup = document.getElementById("pinSetup");
const pinChange = document.getElementById("pinChange");
const newPinInput = document.getElementById("newPin");
const oldPinInput = document.getElementById("oldPin");
const setPinBtn = document.getElementById("setPinBtn");
const removePinBtn = document.getElementById("removePinBtn");
const newDomainInput = document.getElementById("newDomain");
const addDomainBtn = document.getElementById("addDomainBtn");
const importBox = document.getElementById("importBox");
const importBtn = document.getElementById("importBtn");
const domainListEl = document.getElementById("domainList");
const countEl = document.getElementById("count");
const toastEl = document.getElementById("toast");

function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  setTimeout(() => toastEl.classList.remove("show"), 1800);
}

async function sha256(text) {
  const enc = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function getState() {
  return chrome.storage.local.get({ enabled: true, customDomains: [], pinHash: null });
}

async function requirePin(promptMsg) {
  const { pinHash } = await getState();
  if (!pinHash) return true; // no PIN set, nothing to check
  const attempt = prompt(promptMsg || "Enter PIN to confirm:");
  if (attempt === null) return false;
  const hash = await sha256(attempt);
  if (hash !== pinHash) {
    toast("Incorrect PIN");
    return false;
  }
  return true;
}

async function render() {
  const { enabled, customDomains, pinHash } = await getState();
  enabledToggle.checked = enabled;

  if (pinHash) {
    pinStatus.textContent = "PIN is set. Changes are protected.";
    pinSetup.style.display = "none";
    pinChange.style.display = "flex";
  } else {
    pinStatus.textContent = "No PIN set — anyone with access to this browser can change settings.";
    pinSetup.style.display = "flex";
    pinChange.style.display = "none";
  }

  domainListEl.innerHTML = "";
  customDomains.forEach((domain) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = domain;
    const btn = document.createElement("button");
    btn.textContent = "Remove";
    btn.addEventListener("click", () => removeDomain(domain));
    li.append(span, btn);
    domainListEl.appendChild(li);
  });
  countEl.textContent = customDomains.length;
}

enabledToggle.addEventListener("change", async () => {
  const desired = enabledToggle.checked;
  const ok = await requirePin(desired ? "Enter PIN to re-enable blocking:" : "Enter PIN to disable blocking:");
  if (!ok) {
    enabledToggle.checked = !desired; // revert
    return;
  }
  await chrome.storage.local.set({ enabled: desired });
  chrome.runtime.sendMessage({ type: "REBUILD_RULES" });
  toast(desired ? "Blocking enabled" : "Blocking disabled");
});

setPinBtn.addEventListener("click", async () => {
  const pin = newPinInput.value.trim();
  if (!pin || pin.length < 4) {
    toast("PIN must be at least 4 characters");
    return;
  }
  const hash = await sha256(pin);
  await chrome.storage.local.set({ pinHash: hash });
  newPinInput.value = "";
  toast("PIN set");
  render();
});

removePinBtn.addEventListener("click", async () => {
  const { pinHash } = await getState();
  const attempt = oldPinInput.value.trim();
  const hash = await sha256(attempt);
  if (hash !== pinHash) {
    toast("Incorrect PIN");
    return;
  }
  await chrome.storage.local.set({ pinHash: null });
  oldPinInput.value = "";
  toast("PIN removed");
  render();
});

function normalizeDomain(raw) {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0];
}

async function addDomain(raw) {
  const domain = normalizeDomain(raw);
  if (!domain || !domain.includes(".")) return false;
  const { customDomains } = await getState();
  if (customDomains.includes(domain)) return false;
  customDomains.push(domain);
  await chrome.storage.local.set({ customDomains });
  return true;
}

async function removeDomain(domain) {
  const ok = await requirePin("Enter PIN to remove a blocked site:");
  if (!ok) return;
  const { customDomains } = await getState();
  const next = customDomains.filter((d) => d !== domain);
  await chrome.storage.local.set({ customDomains: next });
  toast("Removed " + domain);
  render();
}

addDomainBtn.addEventListener("click", async () => {
  const added = await addDomain(newDomainInput.value);
  if (added) {
    newDomainInput.value = "";
    toast("Added to blocklist");
    render();
  } else {
    toast("Enter a valid domain, e.g. example.com");
  }
});

importBtn.addEventListener("click", async () => {
  const lines = importBox.value.split("\n").map((l) => l.trim()).filter(Boolean);
  let addedCount = 0;
  for (const line of lines) {
    const added = await addDomain(line);
    if (added) addedCount++;
  }
  importBox.value = "";
  toast(`Imported ${addedCount} domain(s)`);
  render();
});

document.addEventListener("DOMContentLoaded", render);
render();
