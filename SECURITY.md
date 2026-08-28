# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.3.x   | :white_check_mark: |
| 1.2.x   | :white_check_mark: |
| 1.1.x   | :x:                |
| < 1.1   | :x:                |

## Reporting a Vulnerability

Please report security vulnerabilities by emailing **security@riponmondalbd.vercel.app** or by opening a private security advisory on GitHub.

We will acknowledge receipt within 48 hours and provide a status update within 5 business days. If the vulnerability is accepted, we will work on a fix and release a patch as soon as possible. If declined, we will explain why.

## Security Considerations

This extension requires the following permissions:
- `tabs` - To query and update tabs for reloading
- `storage` - To persist user settings
- `browsingData` - To clear cache for domains after 20 reloads
- `host_permissions: <all_urls>` - To navigate tabs to target URLs

No data is collected, transmitted, or shared with any external services. All settings are stored locally in the browser.
