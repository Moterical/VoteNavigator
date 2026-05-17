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
├── frontend/          # Next.js application (App Router, TypeScript)
│   ├── src/app/       # Main pages & layout
│   └── public/        # Static assets
├── backend/           # Node.js + Express API
│   ├── src/
│   │   ├── config/    # DB & Cloud configurations
│   │   ├── services/  # Gemini, Translate, Speech services
│   │   ├── routes/    # /chat, /content, /election endpoints
│   │   └── index.js   # Server entry point
│   └── .env.example
├── database/
│   ├── schema.sql     # PostgreSQL schema (Unified Knowledge Base)
│   └── seed.sql       # Verified ECI content (FAQs, Glossary, Rights)
└── README.md
```

---

## 🛠️ Technical Implementation Details

### Database Schema (PostgreSQL)
The database uses a unified **Knowledge Base** approach to handle the "long tail" of civic queries:
- `knowledge_base`: Merged glossary and civic concepts (EVM, VVPAT, Lok Sabha details).
- `faqs`: Categories for eligibility, registration, and voting day.
- `forms_guide`: Step-by-step metadata for ECI forms (Form 6, 8, 8A).
- `election_events`: State-wise schedules and phases.
- `accepted_documents`: The 13 verified photo IDs permitted by ECI.

### AI Engine (Gemini 1.5 Flash + RAG)
The assistant uses a search-first retrieval pattern:
1. **Keyword Match**: Backend searches local tables for the user's query keywords.
2. **Context Injection**: Relevant DB rows are injected into the Gemini system prompt as "Reference Facts".
3. **Reasoning**: Gemini generates a response that prioritizes the injected facts to ensure 100% legal accuracy.

---

## 🔒 Assumptions & Scope

- **Official Redirection**: For sensitive lookups (EPIC verification), the bot provides direct deep-links to `voters.eci.gov.in` instead of requesting voter PII in the chat.
- **Verification**: All static content in `seed.sql` is cross-referenced with the ECI 2024 General Election handbooks.
- **Scope**: Covers Lok Sabha (Parliament) and Vidhan Sabha (State) elections. Rajya Sabha misconceptions are handled proactively.

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
