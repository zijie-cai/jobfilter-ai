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
    <a href="https://zijie-cai.github.io/jobfilter-ai/">Open Landing Page</a>
  </p>
</div>

## Demo

https://github.com/user-attachments/assets/9a8a2a0e-bb64-4292-8a7c-22aecd4ecfa5

## What It Does

JobFilter AI analyzes LinkedIn jobs and gives you the quick verdict before you spiral into another pointless application, surfacing sponsorship signals, citizenship requirements, clearance requirements, and key skills:

- `Eligible`, `Not Eligible`, or `Maybe`
- `Visa Sponsor`
- `OPT Friendly`
- `Citizen Only`
- `Clearance Required`
- detected skills
- one-line reasoning

## Why It Exists

JobFilter AI helps international students waste less time on visa-hostile roles. It catches citizenship requirements, clearance requirements, and no-sponsorship signals early.

## Install

1. Download or clone this repo.
2. Open `chrome://extensions`.
3. Turn on `Developer mode`.
4. Click `Load unpacked` and select this folder.
5. Open the extension settings and paste your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
6. Open a LinkedIn job post.
7. Let the scanner judge the vibes.

## Scope

Right now this thing is wired for `linkedin.com/jobs/*`.

If you want Handshake support, that still needs to be built. The current manifest and selectors are LinkedIn-only.

## Core Files

- `manifest.json` — tells Chrome what this creature can touch
- `content.js` — scrapes the job post, calls Gemini, renders the scanner
- `styles.css` — the floating cyber-panel look
- `options.html` + `options.js` — where the API key lives
- `background.js` — opens the config page when needed

## Stack

- Chrome Extension Manifest V3
- Vanilla JavaScript
- Gemini API
