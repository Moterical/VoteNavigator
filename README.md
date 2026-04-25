# 🗳️ VoteNavigator

> Helping every Indian voter navigate elections — from registration to casting their vote.

VoteNavigator is an AI-powered civic assistant that makes India's election process easy to understand for every citizen. Built for first-time voters, students, and the general public, it provides step-by-step guidance through voter registration, eligibility checks, election timelines, and the voting process — in multiple Indian languages.

---

## 🎯 Chosen Vertical

**Election Process Assistant** — Helping users understand the election process, timelines, and voting steps in an interactive, conversational, and easy-to-follow way.

---

## 🧠 Approach & Logic

VoteNavigator uses a **EPIC Number-first** approach as the universal voter identifier. Instead of asking users multiple questions (name, DOB, state, etc.), a single EPIC number lookup routes users to personalized, accurate information.

The assistant follows a **RAG (Retrieval-Augmented Generation)** pattern:
1. User asks a question → **Intent is detected**
2. Backend searches the **verified knowledge base** (PostgreSQL via Cloud SQL) first
3. If found → answer is returned directly (fast, accurate)
4. If not found → **Gemini API** generates a response grounded in our knowledge base
5. All answers include a **source citation** linking to official ECI/NVSP resources

---

## 🏗️ Architecture

```
Frontend (Next.js)  →  Cloud Run
Backend (Node.js)   →  Cloud Run
Database            →  Cloud SQL (PostgreSQL)
AI                  →  Gemini API
Translation         →  Google Cloud Translate API
Voice Input         →  Google Cloud Speech-to-Text
Voice Output        →  Google Cloud Text-to-Speech
Containers          →  Google Artifact Registry
Maps                →  Google Maps deep links
```

---

## ✨ Key Features

- 🤖 **Conversational AI** — Natural language Q&A powered by Gemini
- 🗓️ **Election Timeline** — Visual phase-wise election calendar
- ✅ **Eligibility Checker** — Am I eligible to vote?
- 📝 **Registration Guide** — Step-by-step Form 6 walkthrough
- 📍 **Booth Locator** — Find your polling booth via official NVSP + Google Maps
- 🌐 **Multilingual** — All major Indian languages via Google Translate API
- 🎙️ **Voice Interface** — Speak your question, hear the answer
- 📚 **Civic Glossary** — EVM, VVPAT, NOTA and more, explained simply
- 🛡️ **Voter Rights** — Know your rights at the polling booth

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js 18+
- PostgreSQL (or Cloud SQL connection)
- Google Cloud API keys (Gemini, Translate, STT, TTS)

### Setup

```bash
# Clone the repository
git clone https://github.com/Moterical/VoteNavigator.git
cd VoteNavigator

# Backend
cd backend
npm install
cp .env.example .env   # Fill in your API keys
npm run dev

# Frontend (new terminal)
cd frontend
npm install
cp .env.example .env.local   # Fill in your API keys
npm run dev
```

Frontend runs on: `http://localhost:3000`  
Backend runs on: `http://localhost:8080`

---

## 📦 Project Structure

```
VoteNavigator/
├── frontend/          # Next.js application
│   ├── src/
│   │   ├── app/       # Next.js App Router pages
│   │   ├── components/# Chat, Timeline, Checklist UI components
│   │   └── lib/       # API clients, helpers
│   └── Dockerfile
├── backend/           # Node.js + Express API
│   ├── src/
│   │   ├── routes/    # /chat, /content, /election
│   │   ├── services/  # gemini.js, translate.js, tts.js, stt.js
│   │   ├── db/        # schema, seed, queries
│   │   └── flows/     # Guided conversation flows
│   └── Dockerfile
├── database/
│   ├── schema.sql     # PostgreSQL schema
│   └── seed.sql       # Verified ECI content
└── README.md
```

---

## 🔒 Assumptions Made

- Voter registration status lookup redirects to the official **NVSP portal** (voters.eci.gov.in) — ECI does not provide a public API for voter data
- All civic information is sourced from official **Election Commission of India (ECI)** publications and verified before being added to the knowledge base
- The assistant covers **General Elections (Lok Sabha)** and **State Assembly Elections** — local body elections are out of scope for MVP
- EPIC Number is used as the **primary unique identifier** for all voter-specific lookups

---

## 🌐 Google Services Used

| Service | Purpose |
|---|---|
| Google Gemini API | Core conversational AI & intent detection |
| Google Cloud Translate API | Multilingual support (10+ Indian languages) |
| Google Cloud Speech-to-Text | Voice input for accessibility |
| Google Cloud Text-to-Speech | Voice output for low-literacy users |
| Google Cloud Run | Hosting frontend & backend |
| Google Cloud SQL | PostgreSQL database for election content |
| Google Artifact Registry | Docker container storage |
| Google Maps | Polling booth deep-link navigation |

---

## 📜 License

MIT
