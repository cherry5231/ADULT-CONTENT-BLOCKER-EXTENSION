# Adult Blocker Chrome Extension

A lightweight and privacy-friendly Chrome extension that automatically blocks access to adult and explicit websites, helping create a safer and more distraction-free browsing experience.

Whether you're looking to improve productivity, create a family-friendly environment, or reduce exposure to inappropriate content, Adult Blocker works quietly in the background to help keep your browsing safe.

---

##  Features

*  Blocks adult and explicit websites automatically
*  Lightweight and fast performance
*  Runs locally in your browser for better privacy
*  Easy to install and use
*  Built using Chrome Extension Manifest V3
   Open-source and customizable

---

##  Project Structure

```text
Adult-Blocker/
│── manifest.json
│── background.js
│── popup.html
│── popup.css
│── popup.js
│── icons/
└── README.md
```

> **Important:** `manifest.json` must be located in the root of the project folder.

---

##  Installation (For Developers)

1. Clone this repository or download it as a ZIP.
2. If you downloaded a ZIP, extract it.
3. Ensure all project files remain inside the same folder.
4. Open Google Chrome and go to:

```
chrome://extensions/
```

5. Enable **Developer Mode** (top-right).
6. Click **Load unpacked**.
7. Select the project folder (the folder that contains `manifest.json`).
8. The extension will now be installed and ready to use.

---

##  Creating a ZIP for Distribution

If you want to share or submit this extension:

1. Place all extension files inside a single folder.
2. Make sure `manifest.json` is directly inside that folder (not inside another subfolder).
3. Compress **that folder's contents** into a ZIP archive.

Your ZIP should look like this:

```text
Adult-Blocker.zip
├── manifest.json
├── background.js
├── popup.html
├── popup.css
├── popup.js
└── icons/
```

**Incorrect structure:**

```text
Adult-Blocker.zip
└── Adult-Blocker/
    ├── manifest.json
    ├── popup.html
    └── ...
```

---

##  Built With

* HTML5
* CSS3
* JavaScript
* Chrome Extensions API
* Manifest V3

---

##  Contributing

Contributions are welcome!

If you'd like to improve the extension:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Submit a Pull Request.

Bug reports and feature suggestions are always appreciated.

---

##  License

This project is licensed under the MIT License.

---

##  Support

If you found this project useful, consider giving the repository a **⭐ Star**. It helps others discover the project and supports future development.
