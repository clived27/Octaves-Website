# OCTAVES.IN — Concept 1: Comic Jam / Split Stage
## Visual Prototype — NOT a production build

---

## How to Open
Double-click `index.html` in this folder.
No build step, no server, no install needed.

---

## How to Edit Content

Open `index.html` in any text editor.
Find `<script id="CFG" type="application/json">` near the top.
Edit any of these values:

```json
{
  "site": {
    "title":    "OCTAVES.IN",
    "subtitle": "TWO MINDS. TWO INSTRUMENTS. ONE FREQUENCY."
  },
  "left": {
    "label":     "GUITARIST",
    "name":      "ARJUN K.",
    "role":      "Frontend / Creative Developer",
    "bio":       "...",
    "stack":     ["React", "Three.js", "GSAP", "JavaScript"],
    "riff":      "Comfortably Numb — Pink Floyd",
    "ig_handle": "@arjun.codes",
    "ig_url":    "https://instagram.com/your_guitarist_handle",
    "accent":    "#ff3cac",
    "image":     "assets/characters/guitarist.svg"
  },
  "right": {
    "label":     "KEYBOARDIST",
    "name":      "RIYA S.",
    ...
  }
}
```

---

## How to Replace Character Art

### Option A — SVG Illustration
Replace the `<svg id="guitarist-art">` block in index.html
with your final SVG illustration.
Search for: `REPLACE THIS IMAGE WITH FINAL GUITARIST ART`

### Option B — Image File
1. Drop your file into `assets/characters/guitarist.svg` (or .png)
2. In index.html, find `<div class="charwrap" id="cwl">`
3. Replace the `<svg id="guitarist-art">` with:
   `<img src="assets/characters/guitarist.svg" alt="Guitarist">`

Repeat for keyboardist using `assets/characters/keyboardist.svg`

---

## Asset Folders

```
concept1/
  index.html                  ← Main prototype file
  README.md                   ← This file
  assets/
    characters/
      guitarist.svg           ← REPLACE WITH FINAL GUITARIST ART
      keyboardist.svg         ← REPLACE WITH FINAL KEYBOARDIST ART
    backgrounds/
      stage-bg.svg            ← Optional: replace background
    icons/
      instagram.svg           ← Instagram icon (used inline in HTML)
```

---

## Colors (CSS Variables in index.html)

```css
:root {
  --cl: #ff3cac;   /* Left / Guitarist accent */
  --cr: #00f5d4;   /* Right / Keyboardist accent */
  --cd: #ffe600;   /* Central divider lightning */
  --bg: #07080f;   /* Stage dark background */
}
```

---

## Key Interactions

| Action              | Result                                 |
|---------------------|----------------------------------------|
| Hover left panel    | Guitarist expands to 70% viewport      |
| Hover right panel   | Keyboardist expands to 70% viewport    |
| Active panel        | Bio card slides up, glow intensifies   |
| Click IG sticker    | Opens Instagram in new tab             |
| Mobile tap panel    | Toggles expand on touch devices        |

---

## Notes

- This is Concept 1 only. No other concepts are included.
- All animations are pure CSS + vanilla JS. No frameworks needed.
- Google Fonts are loaded from CDN (requires internet for first load).
- Film grain, scanlines, particles, EQ bars, waveforms are all ambient/subtle.
- Parallax effect responds to mouse position on desktop.
