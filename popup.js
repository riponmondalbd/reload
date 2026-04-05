const urlListEl = document.getElementById("urlList");
const maxEl = document.getElementById("maxsec");
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

async function load() {
  const d = await chrome.storage.local.get(["routes", "activeOnly", "maxSec", "running"]);
  const routes = d.routes || [];
  urlListEl.innerHTML = "";
  
  if (routes.length === 0) {
    // Add one empty input by default if none exist
    addUrlItem("", 1);
  } else {
    routes.forEach((r, i) => addUrlItem(r.url, i + 1));
  }
  
  if (d.maxSec) maxEl.value = d.maxSec;
  activeOnlyEl.checked = !!d.activeOnly;
  
  setUIState(!!d.running);
}
load();

// Update UI logic based on running state
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
  
  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "btn-icon";
  removeBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  removeBtn.title = "Remove URL";
  
  removeBtn.onclick = () => {
    wrapper.remove();
    updateSerials();
  };

  wrapper.appendChild(serialSpan);
  wrapper.appendChild(input);
  wrapper.appendChild(removeBtn);
  
  urlListEl.appendChild(wrapper);
  return input; 
}

function updateSerials() {
  const items = urlListEl.querySelectorAll('.url-serial');
  items.forEach((item, index) => {
    item.textContent = `${index + 1}.`;
  });
}

// Button to add URL manually with auto-focus
document.getElementById("addUrl").onclick = () => {
  const newInput = addUrlItem("", urlListEl.children.length + 1);
  newInput.focus(); // auto-focus the newly added input
  urlListEl.scrollTop = urlListEl.scrollHeight; // scroll to bottom
};

// Button to clear all URLs
document.getElementById("clearUrls").onclick = () => {
  urlListEl.innerHTML = "";
  addUrlItem("", 1); // keep at least one empty box
};

// Start button
startBtn.onclick = async () => {
  const urls = Array.from(urlListEl.querySelectorAll("input[type='text']"))
    .map((i) => i.value.trim())
    .filter(Boolean);
    
  if (urls.length === 0) return; // Don't start if no URLs

  const maxSec = Math.min(300, Math.max(1, Number(maxEl.value) || 300));
  const routes = urls.map((url) => ({ url, enabled: true, maxSec }));

  await chrome.storage.local.set({
    routes,
    running: true,
    activeOnly: activeOnlyEl.checked,
    maxSec,
  });

  setUIState(true);
  chrome.runtime.sendMessage({ type: "START" });
};

// Pause button
pauseBtn.onclick = async () => {
  await chrome.storage.local.set({ running: false });
  setUIState(false);
  chrome.runtime.sendMessage({ type: "STOP" });
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
