<div align="center">
  <img src="./banner.png" alt="JobFilter AI banner" width="100%" />
  <hr />
  <p><strong>A Chrome extension that scans LinkedIn job posts with Gemini and answers the question fast:</strong><br />is this job actually worth applying to as an international student?</p>
  <p>
    <code>Chrome Extension</code>
    <code>LinkedIn Jobs</code>
    <code>Gemini Powered</code>
    <code>Cyber UI</code>
  </p>
  <p>
    <a href="https://zijie-cai.github.io/jobfilter-ai/">Open Landing Page</a> •
    <a href="https://github.com/user-attachments/assets/9a8a2a0e-bb64-4292-8a7c-22aecd4ecfa5">Watch Demo</a>
  </p>
</div>

## Demo

https://github.com/user-attachments/assets/9a8a2a0e-bb64-4292-8a7c-22aecd4ecfa5

## What It Does

JobFilter AI drops a draggable scan panel into LinkedIn jobs and gives you the fast read:

- `Eligible`, `Not Eligible`, or `Maybe`
- `Visa Sponsor`
- `OPT Friendly`
- `Citizen Only`
- `Clearance Required`
- detected skills
- one-line reasoning

## Why It Exists

Some job posts hide the real filter deep in the fine print. This tool tries to catch the citizenship wall, the clearance trap, and the no-sponsorship vibe before you waste the application.

## Install

1. Download or clone this repo.
2. Open `chrome://extensions`.
3. Turn on `Developer mode`.
4. Click `Load unpacked` and select this folder.
5. Open the extension settings and paste your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
6. Open a LinkedIn job post and let it scan.

## Scope

This repo currently works on `linkedin.com/jobs/*`.

If you want Handshake support, that still needs to be built. The current manifest and selectors are LinkedIn-specific.

## Core Files

- `manifest.json` — extension wiring and permissions
- `content.js` — job extraction, Gemini call, injected panel
- `styles.css` — floating scanner UI
- `options.html` + `options.js` — API key config
- `background.js` — opens the config page

## Stack

- Chrome Extension Manifest V3
- Vanilla JavaScript
- Gemini API
