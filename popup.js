chrome.storage.local.get({ enabled: true }, ({ enabled }) => {
  const el = document.getElementById("status");
  el.textContent = enabled ? "Blocking is ON" : "Blocking is OFF";
  el.className = "status " + (enabled ? "on" : "off");
});

document.getElementById("openOptions").addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});
