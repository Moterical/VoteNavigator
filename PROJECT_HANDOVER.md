# VoteNavigator: Project State & Architecture Handover

This document serves as the master context file for the VoteNavigator project. Read this file to instantly understand the project's purpose, architecture, completed features, and future roadmap.

---

## 1. Project Overview
**VoteNavigator** is an AI-powered civic assistant designed to help Indian citizens navigate the election process, know their candidates, locate their polling booths, and hold local representatives accountable. It lowers the barrier to civic engagement through intuitive UI and generative AI.

## 2. Tech Stack
- **Frontend:** Next.js (App Router), TypeScript, React, Vanilla CSS Modules.
- **Backend:** Node.js, Express.js.
- **AI Engine:** Google Gemini 1.5 Flash (via `@google/generative-ai` SDK).
- **Data Layer (Current):** Offline-first local JSON directories (`boothDirectory.json`, `civicDirectory.json`).
- **External Integrations:** Google Maps API (Deep linking for directions).

---

## 3. Completed Features & Architectural Thinking

### A. The VoteNavigator Assistant (Chat)
- **What it is:** A conversational interface for election queries.
- **Thinking Process:** Uses a RAG (Retrieval-Augmented Generation) approach to ground Gemini's answers in official Election Commission of India (ECI) rules, preventing political hallucinations.

### B. KYC (Know Your Candidate) Dashboard
- **What it is:** A portal to view MPs and MLAs, their assets, and criminal records.
- **Thinking Process (The JSON Hallucination Fix):** We needed to translate nested regional manifestos into English. Initial LLM approaches failed because the model hallucinated JSON keys or injected conversational filler. 
- **Solution:** We migrated to Gemini and enforced `responseMimeType: "application/json"` at the SDK level, paired with strict zero-shot system prompts to guarantee deterministic, parseable output.

### C. Booth Locator (The Area Browser)
- **What it is:** A cascading UI (District → Constituency → Booth) that instantly maps polling stations.
- **Thinking Process (The Scraping Pivot):** We originally tried to build a live backend proxy to scrape ECI servers using Voter IDs. This completely failed due to aggressive government anti-bot captchas and rate-limiting (`403 Forbidden`). 
- **Solution:** We executed a massive architectural pivot to an **offline-first** model. We created a local JSON data layer. This dropped latency to zero and guaranteed 100% uptime, completely removing the brittle external dependency from the critical path.

### D. Civic Issue Reporter
- **What it is:** The "Accountability Loop." Users type a messy complaint about a local issue, and the AI drafts a formal, bureaucratic grievance email addressed to their specific MLA.
- **Thinking Process:** AI is mostly used for chatbots. We wanted to use it as an **Action Engine**. It includes 1-Click "Call" and "Copy Draft/Email" fallbacks, recognizing that `mailto:` links are notoriously unreliable on unconfigured Windows machines.

---

## 4. Migration History (Crucial Context)
- **Groq to Gemini:** We initially used the Groq API for our AI layer. However, because we were translating political manifestos, their open-source safety filters triggered false-positive bans for "political lobbying," crashing our backend. We performed a hot-migration of `aiService.js` and `translationService.js` to Google Gemini 1.5 Flash, which handles factual civic context much better.
- **API Key Security:** We had a GitHub Secret Scanning alert for a hardcoded Google Maps API key in `BoothLocator.tsx`. This was removed and we committed to strict `.env` usage moving forward.

---

## 5. Future Goals & Next Steps
When resuming work, these are the immediate priorities:
1. **Form 6 Wizard:** Build the UI/UX for the "Voter Registration Guide" tab in the frontend.
2. **Background Cron Scraper:** The current JSON directories are static. We need to build a background Node.js job that slowly scrapes official portals during off-peak hours to update our local JSON files, maintaining "data freshness" without impacting the live user experience.
3. **Database Integration:** Move from static JSON to PostgreSQL (Cloud SQL) if we decide to implement user accounts, authentication, or saved preferences.
