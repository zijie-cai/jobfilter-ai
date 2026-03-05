<div align="center">
  <img src="./icon128.png" alt="JobFilter AI icon" width="88" />
  <h1>JobFilter AI</h1>
  <p><strong>A Chrome extension that scans LinkedIn job posts with Gemini and answers the question fast:</strong><br />is this job actually worth applying to as an international student?</p>
  <p>
    <code>Chrome Extension</code>
    <code>LinkedIn Jobs</code>
    <code>Gemini Powered</code>
    <code>Cyber UI</code>
  </p>
</div>

## Demo

https://github.com/user-attachments/assets/38abd6ce-03f6-42a9-9f0f-770232a9ae7d

## What It Does

JobFilter AI injects a draggable scanner panel into LinkedIn job pages, extracts the active role details, sends the description to Gemini, and returns a compact decision board:

- `Eligible`, `Not Eligible`, or `Maybe`
- `Visa Sponsor`
- `OPT Friendly`
- `Citizen Only`
- `Clearance Required`
- extracted skills
- one-line reasoning

## Why It Feels Useful

Instead of manually hunting for hidden sponsorship signals, the extension turns a long job post into a quick yes/no/maybe screen.

## Current Scope

This repo is currently built for `linkedin.com/jobs/*`.

If your product direction is Handshake, that is not implemented in the current code yet. The manifest, content script, and selectors are all LinkedIn-specific right now.

## Install The Extension

1. Download or clone this repo.
2. Open `chrome://extensions`.
3. Turn on `Developer mode`.
4. Click `Load unpacked`.
5. Select this project folder.
6. Open the extension settings popup.
7. Paste your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
8. Open a LinkedIn job page and let the panel scan.

## How It Works

| Step | What happens |
| --- | --- |
| 1 | `content.js` watches LinkedIn job-page changes |
| 2 | job title, company, and description are extracted from the active listing |
| 3 | the text is sent to Gemini with a strict JSON response schema |
| 4 | the floating panel renders the verdict, signals, skills, and reasoning |
| 5 | the API key is stored in Chrome sync storage via the options page |

## Local Development

### Extension runtime

The Chrome extension itself does not require a build step. These files run directly:

- `manifest.json`
- `content.js`
- `styles.css`
- `options.html`
- `options.js`
- `background.js`

After changes, reload the unpacked extension in Chrome.

### Landing page / install guide

This repo also includes a separate Vite + React UI in `src/` that acts like a polished landing page or install guide.

```bash
npm install
npm run dev
```

Optional:

```bash
npm run build
npm run lint
```

If you run the Vite app, `.env.example` shows the expected `GEMINI_API_KEY` shape. The extension itself still reads the API key from the options UI, not from `.env`.

## Project Map

| Path | Purpose |
| --- | --- |
| `manifest.json` | Chrome extension config, permissions, and content-script wiring |
| `content.js` | LinkedIn page scraping, Gemini call, and injected results panel |
| `styles.css` | floating cyber-scanner UI styles |
| `options.html` + `options.js` | API key settings screen |
| `background.js` | opens the options page on request |
| `src/` | Vite/React marketing or setup page |
| `jobfilter_demo.mp4` | short demo video used in this README |

## Permissions

- `storage`: save the Gemini API key
- `activeTab` and `scripting`: interact with the active job page
- `https://www.linkedin.com/*`: read LinkedIn job content
- `https://generativelanguage.googleapis.com/*`: call Gemini

## Stack

- Chrome Extension Manifest V3
- Vanilla JavaScript for the extension runtime
- React + Vite + Tailwind for the landing page
- Gemini API for job eligibility analysis

## Short Version

JobFilter AI is a fast LinkedIn job triage tool with a loud UI and a simple purpose: help users spot visa-hostile roles before they waste time applying.
