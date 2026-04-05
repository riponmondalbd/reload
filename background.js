let timer = null;
let remaining = 0;
let routeIndex = 0;
let domainCounts = {};

// Reset running state when browser starts/restarts
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.set({ running: false });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ running: false });
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "START") start();
  if (msg.type === "STOP") stop();
});

function stop() {
  if (timer) clearInterval(timer);
  timer = null;
}

function rand(max) {
  return Math.floor(Math.random() * max) + 1;
}

async function start() {
  stop();
  const d = await chrome.storage.local.get(["running"]);
  if (!d.running) return;
  remaining = 1;
  timer = setInterval(tick, 1000);
}

async function tick() {
  const d = await chrome.storage.local.get(["running", "routes", "activeOnly"]);
  if (!d.running) return stop();

  if (remaining > 0) {
    remaining--;
    sendStatus(d.routes);
    return;
  }

  const routes = (d.routes || []).filter((r) => r.enabled);
  if (!routes.length) return;

  const route = routes[routeIndex % routes.length];
  remaining = rand(route.maxSec || 300);

  await reloadRoute(route.url, d.activeOnly);

  routeIndex++;
  sendStatus(routes);
}

function sendStatus(routes) {
  const next = routes?.length ? routes[routeIndex % routes.length].url : null;
  chrome.runtime.sendMessage({
    type: "STATUS",
    remaining,
    next,
    count: totalReloads(),
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
    tab = tabs.find((t) => t.url && t.url.startsWith(url)) || tabs[0];
    // if no match, just take first tab
  }

  if (!tab) return; // safety

  // update the tab to navigate to the new URL (same tab)
  await chrome.tabs.update(tab.id, { url });

  // handle cache counting
  const domain = new URL(url).hostname;
  domainCounts[domain] = (domainCounts[domain] || 0) + 1;

  if (domainCounts[domain] >= 20) {
    await chrome.browsingData.remove(
      { origins: [`https://${domain}`] },
      { cache: true },
    );
    domainCounts[domain] = 0;
  }
}

function totalReloads() {
  return Object.values(domainCounts).reduce((a, b) => a + b, 0);
}
