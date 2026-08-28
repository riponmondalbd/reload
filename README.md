# Route Auto Reloader Lite

Route Auto Reloader Lite is a powerful yet lightweight Chrome Extension that allows you to automatically reload specific target URLs at randomized intervals. Developed with simplicity in mind, it provides a clean dashboard to monitor reload statuses and helps keep your desired webpages active or up-to-date. v2

## 🌟 Key Features

- **🎯 Target URLs:** Add multiple specific URLs that you want to be automatically reloaded.
- **⏱️ Randomized Delays:** Set min/max random delay per URL (1-300 seconds) to prevent predictable reloading patterns.
- **🔍 Active Tab Only:** Option to strictly reload only when you are viewing the active tab.
- **📊 Real-time Dashboard:** Monitor the extension's status, see the countdown to the next reload, identify the next target URL, and keep track of total reloads.
- **✨ Clean UI:** Intuitive and modern user interface to quickly start, pause, and configure settings.
- **💾 Export/Import:** Backup and restore your settings as JSON.
- **⌨️ Keyboard Shortcut:** Toggle with `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac).
- **🌙 Dark Mode:** Automatic dark mode support based on system preference.
- **🔒 Smart Cache Management:** Auto-clears cache per domain every 20 reloads.
- **✅ URL Validation:** Automatic validation and `https://` prefix correction.

## 🚀 Installation

### Load Extension Locally (Developer Mode)

1. Clone or download this repository to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** in the top right corner.
4. Click on **Load unpacked**.
5. Select the folder containing the extension files.
6. The extension icon should now appear in your browser's toolbar!

## ⚙️ How to Use

1. Click on the extension icon in your toolbar to open the popup interface.
2. **Add URLs:** Click the "Add URL" button to insert the links you want the extension to reload.
3. **Configure Per-URL Settings:** Each URL has its own Min/Max delay (seconds).
4. **Configure Global Settings:**
   - Set the `Global Min Delay` and `Global Max Delay` as defaults for new URLs.
   - Toggle `Active Tab Only` depending on your needs.
5. **Start:** Click the **Start** button to begin the auto-reload sequence.
6. **Pause:** Click the **Pause** button whenever you want to momentarily stop the reloads.
7. Check the Status Dashboard to see the countdown and the current reload count.
8. **Export/Import:** Use the Export/Import buttons in Settings to backup/restore your configuration.

## ⌨️ Keyboard Shortcuts

- **Toggle Reloader:** `Ctrl+Shift+R` (Windows/Linux) / `Cmd+Shift+R` (Mac)

## 👨‍💻 Developer

Developed by **[Ripon](https://riponmondalbd.vercel.app/)**

## 📄 License

This project is open-source.
