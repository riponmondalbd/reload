const urlListEl = document.getElementById("urlList");
const maxEl = document.getElementById("maxsec");
const activeOnlyEl = document.getElementById("activeOnly");

async function load() {
  const d = await chrome.storage.local.get(["routes", "activeOnly", "maxSec"]);
  const routes = d.routes || [];
  urlListEl.innerHTML = "";
  routes.forEach((r, i) => addUrlItem(r.url, i + 1));
  if (d.maxSec) maxEl.value = d.maxSec;
  activeOnlyEl.checked = !!d.activeOnly;
}
load();

// Add new URL input item
function addUrlItem(value = "", serial = null) {
  const div = document.createElement("div");
  div.className = "url-item";
  div.innerHTML = `<strong>${serial ? serial + ". " : ""}</strong>
                   <input type="text" value="${value}" placeholder="https://site/example">`;
  urlListEl.appendChild(div);
  return div.querySelector("input"); // return the input for focusing
}

// Button to add URL manually with auto-focus
document.getElementById("addUrl").onclick = () => {
  const newInput = addUrlItem("", urlListEl.children.length + 1);
  newInput.focus(); // auto-focus the newly added input
};

// Button to clear all URLs
document.getElementById("clearUrls").onclick = () => {
  urlListEl.innerHTML = "";
};

// Start button
document.getElementById("start").onclick = async () => {
  const urls = Array.from(urlListEl.querySelectorAll("input"))
    .map((i) => i.value.trim())
    .filter(Boolean);
  const maxSec = Math.min(300, Math.max(1, Number(maxEl.value) || 300));
  const routes = urls.map((url) => ({ url, enabled: true, maxSec }));

  await chrome.storage.local.set({
    routes,
    running: true,
    activeOnly: activeOnlyEl.checked,
    maxSec,
  });

  chrome.runtime.sendMessage({ type: "START" });
};

// Pause button
document.getElementById("pause").onclick = async () => {
  await chrome.storage.local.set({ running: false });
  chrome.runtime.sendMessage({ type: "STOP" });
};

// Update status
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "STATUS") {
    next.textContent = "Next: " + (msg.next || "-");
    timer.textContent = "Reload in: " + msg.remaining + " sec";
    count.textContent = "Reload count: " + msg.count;
  }
});
