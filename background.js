let timer = null;
let remaining = 0;
let domainCounts = {};
let shuffledRoutes = [];
let routePosition = 0;
let isInitialized = false;

// Load persisted domain counts on startup
async function loadDomainCounts() {
  const d = await chrome.storage.local.get("domainCounts");
  domainCounts = d.domainCounts || {};
}

// Save domain counts to storage
async function saveDomainCounts() {
  await chrome.storage.local.set({ domainCounts });
}

async function initialize() {
  if (isInitialized) return;
  await loadDomainCounts();
  isInitialized = true;
}

// Reset running state when browser starts/restarts
chrome.runtime.onStartup.addListener(async () => {
  await initialize();
  await chrome.storage.local.set({ running: false });
  updateBadge(false);
});

chrome.runtime.onInstalled.addListener(async () => {
  await initialize();
  await chrome.storage.local.set({ running: false });
  updateBadge(false);
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "START") start();
  if (msg.type === "STOP") stop();
});

// Handle keyboard shortcut
chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-reloader") {
    chrome.storage.local.get("running", (d) => {
      if (d.running) {
        stop();
        chrome.storage.local.set({ running: false });
      } else {
        chrome.storage.local.set({ running: true }, () => start());
      }
    });
  }
});

function updateBadge(isRunning) {
  if (isRunning) {
    chrome.action.setBadgeBackgroundColor({ color: "#4CAF50" }); // Green
    setBadgeText(remaining);
  } else {
    chrome.action.setBadgeText({ text: "OFF" });
    chrome.action.setBadgeBackgroundColor({ color: "#F44336" }); // Red
  }
}

function setBadgeText(value) {
  // Chrome badge text limited to ~4-6 chars, truncate if needed
  const text = String(value);
  chrome.action.setBadgeText({
    text: text.length > 4 ? text.slice(0, 3) + "+" : text,
  });
}

function stop() {
  if (timer) clearInterval(timer);
  timer = null;
  updateBadge(false);
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Get random delay between min and max for a route
function getRandomDelay(route) {
  const min = route.minSec || 1;
  const max = route.maxSec || 300;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function start() {
  stop();
  const d = await chrome.storage.local.get(["running", "routes"]);
  if (!d.running) return;

  // Shuffle routes once at start for random order with guaranteed coverage
  const routes = (d.routes || []).filter((r) => r.enabled);
  shuffledRoutes = shuffleArray(routes);
  routePosition = 0;

  updateBadge(true);
  remaining = 1;
  timer = setInterval(tick, 1000);
}

async function tick() {
  // Get fresh data from storage each tick
  const d = await chrome.storage.local.get(["running", "routes", "activeOnly"]);
  if (!d.running) return stop();

  // Refresh routes from storage in case user added/removed URLs while running
  const currentRoutes = (d.routes || []).filter((r) => r.enabled);
  if (!currentRoutes.length) return;

  // If routes changed (added/removed), re-shuffle and reset position
  if (currentRoutes.length !== shuffledRoutes.length) {
    shuffledRoutes = shuffleArray(currentRoutes);
    routePosition = 0;
  }

  if (remaining > 0) {
    remaining--;
    setBadgeText(remaining);
    sendStatus();
    return;
  }

  // Get current route from shuffled list
  const route = shuffledRoutes[routePosition];
  remaining = getRandomDelay(route);

  await reloadRoute(route.url, d.activeOnly);

  // Move to next position, wrap around and reshuffle when complete
  routePosition++;
  if (routePosition >= shuffledRoutes.length) {
    routePosition = 0;
    shuffledRoutes = shuffleArray(shuffledRoutes); // Reshuffle for next cycle
  }

  sendStatus();
}

function sendStatus() {
  // Show the next URL to be reloaded
  const next =
    shuffledRoutes.length > 0 && routePosition < shuffledRoutes.length
      ? shuffledRoutes[routePosition].url
      : null;
  chrome.runtime
    .sendMessage({
      type: "STATUS",
      remaining,
      next,
      count: totalReloads(),
    })
    .catch(() => {
      // Ignore error when popup is closed
    });
}

async function reloadRoute(url, activeOnly) {
  let tab = null;

  if (activeOnly) {
    // use current active tab
    const [t] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (t) tab = t;
  } else {
    // use any tab that matches start of url
    const tabs = await chrome.tabs.query({});
    tab = tabs.find((t) => t.url && t.url.startsWith(url));
    // If no matching tab, skip this route (don't fallback to random tab)
  }

  if (!tab) {
    console.log(`No matching tab found for ${url}, skipping reload`);
    return;
  }

  // update the tab to navigate to the new URL
  try {
    await chrome.tabs.update(tab.id, { url });
  } catch (err) {
    console.error(`Failed to reload tab for ${url}:`, err);
    return;
  }

  // handle cache counting
  try {
    const domain = new URL(url).hostname;
    domainCounts[domain] = (domainCounts[domain] || 0) + 1;

    if (domainCounts[domain] >= 20) {
      await chrome.browsingData.remove(
        { origins: [`https://${domain}`] },
        { cache: true },
      );
      domainCounts[domain] = 0;
    }
    await saveDomainCounts();
  } catch (err) {
    console.error(`Cache management error for ${url}:`, err);
  }
}

function totalReloads() {
  return Object.values(domainCounts).reduce((a, b) => a + b, 0);
}
