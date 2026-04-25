-- ============================================================
-- VoteNavigator Database Schema
-- PostgreSQL (Cloud SQL)
-- ============================================================

-- Enable UUID extension (optional, using SERIAL for simplicity)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. ELECTION EVENTS
-- Stores election schedule, phases, key dates
-- Populated per election cycle from official ECI sources
-- ============================================================
CREATE TABLE IF NOT EXISTS election_events (
  id                   SERIAL PRIMARY KEY,
  election_type        VARCHAR(20) NOT NULL CHECK (election_type IN ('LOK_SABHA', 'VIDHAN_SABHA', 'LOCAL_BODY', 'BY_ELECTION')),
  election_name        VARCHAR(255) NOT NULL,         -- e.g. "Lok Sabha General Election 2024"
  what_voting_for      VARCHAR(100) NOT NULL,         -- e.g. "Member of Parliament (MP)"
  election_description TEXT NOT NULL,                -- Plain-language explanation for voter
  phase_number         INTEGER,                       -- NULL for single-phase elections
  total_phases         INTEGER,                       -- Total phases in this election
  state                VARCHAR(100),                  -- NULL = national election
  constituency         VARCHAR(255),                  -- Specific constituency (if applicable)
  polling_date         DATE,
  notification_date    DATE,                          -- Official notification date
  last_nomination_date DATE,
  last_withdrawal_date DATE,
  result_date          DATE,
  mcc_start_date       DATE,                          -- Model Code of Conduct start
  mcc_end_date         DATE,                          -- Usually result date
  is_active            BOOLEAN DEFAULT TRUE,           -- TRUE = upcoming/current
  source_url           VARCHAR(500) DEFAULT 'https://eci.gov.in',
  created_at           TIMESTAMP DEFAULT NOW(),
  updated_at           TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 2. CIVIC CONCEPTS
-- Educational content: What is Lok Sabha? What is an EVM?
-- Also handles Rajya Sabha misconception
-- ============================================================
CREATE TABLE IF NOT EXISTS civic_concepts (
  id                SERIAL PRIMARY KEY,
  concept_key       VARCHAR(100) UNIQUE NOT NULL,    -- e.g. 'lok_sabha', 'rajya_sabha', 'evm'
  title             VARCHAR(255) NOT NULL,
  short_description TEXT NOT NULL,                   -- 1-2 sentences (for quick answer)
  full_explanation  TEXT NOT NULL,                   -- Detailed explanation
  can_citizens_vote BOOLEAN,                         -- NULL = not applicable, TRUE/FALSE for election types
  category          VARCHAR(50) NOT NULL CHECK (category IN (
                      'election_type', 'voting_process', 'terminology', 'rights', 'bodies'
                    )),
  source_url        VARCHAR(500),
  created_at        TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 3. GLOSSARY
-- Abbreviations & terms: EVM, VVPAT, NOTA, EPIC, BLO, etc.
-- ============================================================
CREATE TABLE IF NOT EXISTS glossary (
  id          SERIAL PRIMARY KEY,
  term        VARCHAR(100) UNIQUE NOT NULL,
  full_form   VARCHAR(255),
  definition  TEXT NOT NULL,
  example     TEXT,
  source_url  VARCHAR(500),
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 4. FAQS
-- Frequently asked voter questions with verified answers
-- ============================================================
CREATE TABLE IF NOT EXISTS faqs (
  id          SERIAL PRIMARY KEY,
  question    TEXT NOT NULL,
  answer      TEXT NOT NULL,
  category    VARCHAR(50) NOT NULL CHECK (category IN (
                'eligibility', 'registration', 'voting_day',
                'booth', 'documents', 'rights', 'general'
              )),
  tags        TEXT[],                                -- For AI search matching
  source_url  VARCHAR(500),
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 5. FORMS GUIDE
-- Step-by-step guidance for Form 6, 6A, 6B, 7, 8, 8A
-- ============================================================
CREATE TABLE IF NOT EXISTS forms_guide (
  id               SERIAL PRIMARY KEY,
  form_type        VARCHAR(20) NOT NULL CHECK (form_type IN (
                     'FORM_6', 'FORM_6A', 'FORM_6B', 'FORM_7', 'FORM_8', 'FORM_8A'
                   )),
  form_name        VARCHAR(255) NOT NULL,
  purpose          TEXT NOT NULL,                    -- Who should use this form
  step_number      INTEGER NOT NULL,
  step_title       VARCHAR(255) NOT NULL,
  step_description TEXT NOT NULL,
  step_documents   TEXT[],                           -- Documents needed at this step
  portal_url       VARCHAR(500) DEFAULT 'https://voters.eci.gov.in',
  created_at       TIMESTAMP DEFAULT NOW(),
  UNIQUE(form_type, step_number)
);

-- ============================================================
-- 6. ACCEPTED DOCUMENTS
-- List of valid photo IDs accepted at polling booth
-- Source: ECI 2024 Lok Sabha notification
-- ============================================================
CREATE TABLE IF NOT EXISTS accepted_documents (
  id                SERIAL PRIMARY KEY,
  document_name     VARCHAR(255) NOT NULL,
  issuing_authority VARCHAR(255),
  notes             TEXT,
  is_primary        BOOLEAN DEFAULT FALSE,           -- TRUE only for EPIC/Voter ID
  display_order     INTEGER,                         -- Order to show in UI
  source_url        VARCHAR(500) DEFAULT 'https://eci.gov.in',
  created_at        TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 7. VOTER RIGHTS
-- Rights inside and outside the polling booth
-- ============================================================
CREATE TABLE IF NOT EXISTS voter_rights (
  id             SERIAL PRIMARY KEY,
  right_title    VARCHAR(255) NOT NULL,
  description    TEXT NOT NULL,
  action_to_take TEXT,                               -- What to do if right is violated
  contact        VARCHAR(255),                       -- Helpline or portal
  source_url     VARCHAR(500),
  display_order  INTEGER,
  created_at     TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_election_events_type    ON election_events(election_type);
CREATE INDEX IF NOT EXISTS idx_election_events_state   ON election_events(state);
CREATE INDEX IF NOT EXISTS idx_election_events_active  ON election_events(is_active);
CREATE INDEX IF NOT EXISTS idx_faqs_category           ON faqs(category);
CREATE INDEX IF NOT EXISTS idx_civic_concepts_key      ON civic_concepts(concept_key);
CREATE INDEX IF NOT EXISTS idx_forms_guide_type        ON forms_guide(form_type);
