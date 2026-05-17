# 🗳️ VoteNavigator

> Helping every Indian voter navigate elections — from registration to casting their vote, and holding leaders accountable.

VoteNavigator is an AI-powered civic assistant that makes India's election process easy to understand for every citizen. Built for first-time voters, students, and the general public, it provides step-by-step guidance through voter registration, a comprehensive candidate dashboard, booth location services, and a civic issue reporting tool.

---

## 🎯 Chosen Vertical

**Election Process Assistant** — Helping users understand the election process, timelines, and voting steps in an interactive, conversational, and easy-to-follow way.

---

## 🏗️ Architecture

```
Frontend (Next.js)  →  Cloud Run
Backend (Node.js)   →  Cloud Run
Database            →  Cloud SQL (PostgreSQL) & Local JSON Directories
AI                  →  Google Gemini 1.5 Flash API
Maps                →  Google Maps API
```

---

## ✨ Key Features

### 1. 🤖 The VoteNavigator Assistant
- **Conversational AI** — Natural language Q&A powered by Google Gemini.
- **RAG Implementation** — Grounded in official ECI (Election Commission of India) rules and a local civic knowledge base.
- **Multilingual Support** — Ask questions in regional languages.

### 2. 📊 KYC (Know Your Candidate) Dashboard
- **Candidate Profiles** — View assets, criminal records, and educational backgrounds of local MPs and MLAs.
- **AI Translation** — Instantly translates regional candidate manifestos and details into English (or other target languages) using Gemini's structured JSON output.
- **Data Transparency** — Empowers voters to make informed decisions before heading to the polls.

### 3. 🏛️ Booth Locator (Area Browser)
- **Cascading Selection** — A highly reliable, directory-based browser to select your District and Constituency without relying on brittle government captchas.
- **Google Maps Integration** — Instantly generates a "Get Directions" deep link to your specific polling booth, bypassing complex map embeds for a seamless mobile experience.
- **Offline-First Data** — Uses a robust local JSON directory (`boothDirectory.json`) to guarantee 100% uptime during election day traffic spikes.

### 4. 📢 Civic Issue Reporter
- **The Accountability Loop** — Empowers citizens to report local issues (like potholes or water shortages) directly to their elected representatives.
- **AI Complaint Drafting** — Uses Gemini AI to instantly transform a casual user complaint into a formal, professionally drafted email template.
- **1-Click Escalation** — Pulls verified MLA contact details (from `civicDirectory.json`) and provides "Tap to Call" and "Send Email" buttons to take immediate civic action.

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js 18+
- Google Gemini API Key

### Setup

```bash
# Clone the repository
git clone https://github.com/Moterical/VoteNavigator.git
cd VoteNavigator

# Backend
cd backend
npm install
cp .env.example .env   # Add your GEMINI_API_KEY here
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:3000`  
Backend runs on: `http://localhost:8080`

---

## 📦 Project Structure

```
VoteNavigator/
├── frontend/          # Next.js application (App Router, TypeScript)
│   ├── src/app/       # Main pages & layout
│   └── src/components/# Feature UI (BoothLocator, KYCDashboard, IssueReporter)
├── backend/           # Node.js + Express API
│   ├── src/
│   │   ├── data/      # Local Databases (boothDirectory.json, civicDirectory.json)
│   │   ├── services/  # Gemini AI Service, Translation, Civic Services
│   │   ├── routes/    # API endpoints
│   │   └── index.js   # Server entry point
│   └── .env
└── README.md
```

---

## 🔒 Assumptions & Scope

- **Official Redirection**: For sensitive lookups (EPIC verification), the bot provides direct deep-links to `voters.eci.gov.in` instead of requesting voter PII.
- **Data Freshness**: The civic and booth directories are currently stored as local JSON files for high reliability and demo purposes. In production, these would be updated via scheduled background scraper jobs (Cron).

---

## 📜 License

MIT
