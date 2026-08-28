# Route Auto Reloader Lite

![License](https://img.shields.io/badge/license-MIT-green.svg)
![Version](https://img.shields.io/badge/version-1.4.0-blue.svg)
![Manifest V3](https://img.shields.io/badge/manifest-V3-blue)
![Chrome Extension](https://img.shields.io/badge/chrome-extension-brightgreen)

A powerful yet lightweight Chrome Extension that automatically reloads specific target URLs at randomized intervals. Perfect for keeping web applications, dashboards, or any webpage active and up-to-date without manual intervention.

## ✨ Features

- **🎯 Multiple URLs:** Add and manage multiple target URLs for simultaneous reloading
- **⏱️ Randomized Delays:** Configurable min/max delay (1-300 seconds) per URL to prevent predictable patterns
- **🔍 Active Tab Mode:** Reload only the currently viewed tab, or open a new tab when the target isn't already open
- **📊 Real-time Dashboard:** Monitor status, countdown timer, next target URL, and total reload count
- **🎨 Modern UI:** Clean, intuitive interface with smooth animations
- **💾 Export/Import:** Backup and restore your configuration as JSON
- **⌨️ Keyboard Shortcut:** Quick toggle with `Ctrl+Shift+R` / `Cmd+Shift+R`
- **🌙 Dark Mode:** Automatic dark theme based on system preference
- **🔒 Smart Cache:** Auto-clears browser cache per domain every 20 reloads
- **✅ URL Validation:** Automatic validation and HTTPS prefix correction
- **📈 Badge Counter:** Visual countdown timer on extension icon

## 📸 Screenshots

_Screenshots will be added once the extension is finalized._

## 🚀 Installation

### Method 1: Chrome Web Store (Coming Soon)

The extension is not yet available on the Chrome Web Store. Use the manual installation method below.

### Method 2: Load Unpacked (Developer Mode)

1. **Download the extension**
   - Clone this repository or download the latest release as a ZIP file
   - Extract the folder to your desired location

2. **Open Chrome Extensions**
   - Navigate to `chrome://extensions/` in your browser
   - Enable **Developer mode** using the toggle in the top-right corner

3. **Load the extension**
   - Click **Load unpacked**
   - Select the extracted extension folder
   - The extension icon will appear in your toolbar

## 📖 How to Use

### Basic Usage

1. Click the extension icon in your Chrome toolbar
2. **Add URLs:** Click the "Add URL" button and enter the target URLs
3. **Configure Settings:**
   - Set `Global Min Delay` and `Global Max Delay` (in seconds)
   - Toggle `Active Tab Only` if you only want to reload when viewing the tab
4. Click **Update** to save your settings
5. Click **Start** to begin the auto-reload sequence
6. Monitor progress in the Status Dashboard

### Advanced Features

- **Pause/Resume:** Click Pause to temporarily stop reloading, Start to resume
- **Export Settings:** Download your configuration as a JSON file for backup
- **Import Settings:** Restore settings from a previously exported file
- **Keyboard Shortcut:** Press `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac) to toggle

### Cache Management

The extension automatically clears browser cache for each domain after 20 reloads to prevent stale content. This count persists across browser restarts.

## ⌨️ Keyboard Shortcuts

| Shortcut                   | Action               |
| -------------------------- | -------------------- |
| `Ctrl+Shift+R` (Win/Linux) | Toggle reload on/off |
| `Cmd+Shift+R` (Mac)        | Toggle reload on/off |

## 🔧 Development

### Prerequisites

- Google Chrome browser (latest version)
- Git (for cloning the repository)

### Local Development Setup

```bash
# Clone the repository
git clone https://github.com/riponmondalbd/reload

# Navigate to the extension directory
cd reloadV4

# The extension is ready to use - no build step required!
```

### Extension Structure

```
reloadV4/
├── manifest.json      # Extension configuration
├── background.js      # Service worker for background tasks
├── popup.html         # Main UI interface
├── popup.js           # Popup logic and state management
├── style.css          # Styling and dark mode support
├── icon-16.png        # Extension icon (16x16)
├── icon-48.png        # Extension icon (48x48)
├── icon-128.png       # Extension icon (128x128)
└── README.md          # This file
```

### Making Changes

1. Edit the source files as needed
2. In Chrome, go to `chrome://extensions/`
3. Click the refresh icon on the extension card to reload
4. Changes will be reflected immediately

## 🔒 Privacy & Permissions

This extension requires the following permissions:

| Permission     | Purpose                                                   |
| -------------- | --------------------------------------------------------- |
| `tabs`         | Access tab information to identify and reload target URLs |
| `storage`      | Persist settings, routes, and reload counts               |
| `browsingData` | Clear browser cache per domain to prevent stale content   |
| `<all_urls>`   | Navigate tabs to target URLs                              |

The extension **does not**:

- Collect or transmit any personal data
- Access content on pages beyond reloading them
- Share any information with third parties
- Require an account or subscription

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Commit your changes:** `git commit -m 'Add amazing feature'`
4. **Push to the branch:** `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Reporting Issues

- Use the [GitHub Issues](https://github.com/riponmondalbd/route-auto-reloader-lite/issues) to report bugs or request features
- Include steps to reproduce, expected behavior, and screenshots if applicable

## 📝 Changelog

### Version 1.4.0 (Current)

- Added smart cache management (auto-clear cache every 20 reloads per domain)
- Improved URL validation with automatic HTTPS prefix correction
- Added toast notifications for user feedback
- Enhanced background script with better initialization logic
- Updated extension metadata and version

### Version 1.3.0

- Simplified UI by removing legacy image processing scripts
- Improved route change detection
- Updated status message logic

### Version 1.2.0

- Added keyboard shortcut support (`Ctrl+Shift+R`)
- Removed URL-specific delay settings from popup UI

### Version 1.1.0

- Added Export/Import functionality for settings backup
- Implemented randomized delay patterns
- Added dark mode support

### Version 1.0.0

- Initial release
- Basic URL reloading functionality
- Real-time status dashboard

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

Created and maintained by **[Ripon Mondal](https://riponmondalbd.vercel.app/)**

- 🌐 Website: https://riponmondalbd.vercel.app/
- 🐙 GitHub: https://github.com/riponmondalbd

## 🙏 Acknowledgments

- Built with [Chrome Extension Manifest V3](https://developer.chrome.com/docs/extensions/mv3/intro/)
- Icons and UI inspired by modern design systems
- Special thanks to all contributors and users

---

**Made with ❤️ by Ripon Mondal**

If you find this extension helpful, please consider giving it a ⭐ on GitHub!
