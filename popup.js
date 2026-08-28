const urlListEl = document.getElementById("urlList");
const maxEl = document.getElementById("maxsec");
const minEl = document.getElementById("minsec");
const activeOnlyEl = document.getElementById("activeOnly");

// Dashboard Elements
const dashboardEl = document.getElementById("dashboard");
const runStatusEl = document.getElementById("runStatus");
const timerEl = document.getElementById("timer");
const nextUrlEl = document.getElementById("nextUrl");
const countEl = document.getElementById("count");

// Buttons
const startBtn = document.getElementById("startbtn");
const pauseBtn = document.getElementById("pausebtn");
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importFile = document.getElementById("importFile");
const updateBtn = document.getElementById("updateUrls");
const addUrlBtn = document.getElementById("addUrl");
const clearUrlsBtn = document.getElementById("clearUrls");

// URL validation helper
function normalizeUrl(url) {
  url = url.trim();
  if (!url) return null;
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
  try {
    new URL(url);
    return url;
  } catch {
    return null;
  }
}

function showUrlError(input, message) {
  input.setCustomValidity(message);
  input.reportValidity();
}

function clearUrlError(input) {
  input.setCustomValidity('');
}

// Show toast notification
function showToast(message, type = 'info') {
  const existingToast = document.querySelector('.toast');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  // Force reflow for animation
  toast.offsetHeight;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

async function load() {
  const d = await chrome.storage.local.get(["routes", "activeOnly", "maxSec", "minSec", "running"]);
  const routes = d.routes || [];
  urlListEl.innerHTML = "";

  if (routes.length === 0) {
    // Add one empty input by default if none exist
    addUrlItem("");
  } else {
    routes.forEach((r, i) => addUrlItem(r.url, i + 1));
  }

  if (d.maxSec) maxEl.value = d.maxSec;
  if (d.minSec) minEl.value = d.minSec;
  activeOnlyEl.checked = !!d.activeOnly;

  setUIState(!!d.running);
}
load();

function setUIState(isRunning) {
  if (isRunning) {
    dashboardEl.classList.add("running");
    runStatusEl.textContent = "Running";
    startBtn.style.display = "none";
    pauseBtn.style.display = "flex";
  } else {
    dashboardEl.classList.remove("running");
    runStatusEl.textContent = "Stopped";
    startBtn.style.display = "flex";
    pauseBtn.style.display = "none";
    timerEl.textContent = "-";
    nextUrlEl.textContent = "-";
  }
}

// Add new URL input item
function addUrlItem(value = "", serial = null) {
  const wrapper = document.createElement("div");
  wrapper.className = "url-item";

  const serialSpan = document.createElement("span");
  serialSpan.className = "url-serial";
  serialSpan.textContent = serial ? `${serial}.` : "";

  const input = document.createElement("input");
  input.type = "text";
  input.value = value;
  input.placeholder = "https://site/example";
  input.setAttribute("aria-label", "Target URL");
  input.className = "url-input";

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "btn-icon btn-delete";
  deleteBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  deleteBtn.title = "Delete URL";
  deleteBtn.setAttribute("aria-label", "Delete this URL");
  deleteBtn.onclick = () => {
    wrapper.remove();
    updateSerials();
  };

  // Real-time validation on blur
  input.addEventListener('blur', () => {
    const normalized = normalizeUrl(input.value);
    if (input.value && !normalized) {
      showUrlError(input, "Invalid URL format");
    } else {
      clearUrlError(input);
      if (normalized) input.value = normalized;
    }
  });

  wrapper.appendChild(serialSpan);
  wrapper.appendChild(input);
  wrapper.appendChild(deleteBtn);

  urlListEl.appendChild(wrapper);
  return input;
}

function updateSerials() {
  const items = urlListEl.querySelectorAll('.url-serial');
  items.forEach((item, index) => {
    item.textContent = `${index + 1}.`;
  });
}

// Button to add URL manually
addUrlBtn.onclick = () => {
  const newInput = addUrlItem("", urlListEl.children.length + 1);
  urlListEl.scrollTop = urlListEl.scrollHeight;
  newInput.focus();
};

// Button to clear all URLs
clearUrlsBtn.onclick = () => {
  urlListEl.innerHTML = "";
  addUrlItem("", 1); // keep at least one empty box
};

// Export settings
exportBtn.onclick = async () => {
  const d = await chrome.storage.local.get(["routes", "activeOnly", "maxSec", "minSec"]);
  const data = JSON.stringify(d, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'route-reloader-settings.json';
  a.click();
  URL.revokeObjectURL(url);
};

// Import settings
importBtn.onclick = () => importFile.click();

// Update button - saves both global settings AND URL list to storage
updateBtn.onclick = async () => {
  // Validate global settings
  const minSec = Math.min(300, Math.max(1, Number(minEl.value) || 10));
  const maxSec = Math.min(300, Math.max(1, Number(maxEl.value) || 300));

  if (minSec > maxSec) {
    showUrlError(minEl, "Min delay cannot exceed max delay");
    return;
  }
  clearUrlError(minEl);
  clearUrlError(maxEl);

  // Validate and collect URL routes
  const routes = collectRoutes();
  if (!routes) return;

  if (routes.length === 0) {
    showToast("Please add at least one URL", "error");
    return;
  }

  // Apply global min/max to all routes
  routes.forEach((r) => { r.minSec = minSec; r.maxSec = maxSec; });

  // Save both global settings and routes in one operation
  await chrome.storage.local.set({ routes, minSec, maxSec });

  // Show success toast
  showToast("Settings updated successfully!", "success");

  // Visual feedback
  const originalText = updateBtn.innerHTML;
  updateBtn.innerHTML = '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> Updated!';
  updateBtn.style.backgroundColor = "var(--success)";
  setTimeout(() => {
    updateBtn.innerHTML = originalText;
    updateBtn.style.backgroundColor = "";
  }, 1500);
};

importFile.onchange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const text = await file.text();
  try {
    const data = JSON.parse(text);
    if (data.routes) {
      await chrome.storage.local.set(data);
      load(); // reload UI
      showToast("Settings imported successfully!", "success");
    }
  } catch (err) {
    showToast('Invalid settings file: ' + err.message, "error");
  }
  importFile.value = ''; // reset for next import
};

// Collect and validate routes from the URL list
function collectRoutes() {
  const wrappers = Array.from(urlListEl.querySelectorAll('.url-item'));
  const routes = [];
  const seenUrls = new Set();

  for (const wrapper of wrappers) {
    const input = wrapper.querySelector('.url-input');
    const url = input.value.trim();
    if (!url) continue;

    const normalized = normalizeUrl(url);
    if (!normalized) {
      showUrlError(input, "Invalid URL format");
      return null;
    }

    if (seenUrls.has(normalized)) {
      showUrlError(input, "Duplicate URL - each URL can only be added once");
      return null;
    }
    seenUrls.add(normalized);
    routes.push({ url: normalized, enabled: true });
    clearUrlError(input);
  }

  return routes;
}

// Start button
startBtn.onclick = async () => {
  const minSec = Math.min(300, Math.max(1, Number(minEl.value) || 10));
  const maxSec = Math.min(300, Math.max(1, Number(maxEl.value) || 300));

  const routes = collectRoutes();
  if (!routes) return;

  if (routes.length === 0) {
    showToast("Please add at least one URL", "error");
    return;
  }

  // Apply global min/max to all routes
  routes.forEach((r) => { r.minSec = minSec; r.maxSec = maxSec; });

  await chrome.storage.local.set({
    routes,
    running: true,
    activeOnly: activeOnlyEl.checked,
    maxSec,
    minSec,
  });

  setUIState(true);
  chrome.runtime.sendMessage({ type: "START" });
  showToast("Reloader started!", "success");
};

// Pause button
pauseBtn.onclick = async () => {
  await chrome.storage.local.set({ running: false });
  setUIState(false);
  chrome.runtime.sendMessage({ type: "STOP" });
  showToast("Reloader paused", "info");
};

// Update status from background
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "STATUS") {
    nextUrlEl.textContent = msg.next || "-";
    nextUrlEl.title = msg.next || ""; // Add tooltip for long URLs
    timerEl.textContent = `${msg.remaining}s`;
    countEl.textContent = msg.count;
  }
});