"use client";

import React, { useState, useEffect } from 'react';
import styles from './KYCDashboard.module.css';

interface Candidate {
  name: string;
  party: string;
  age: number;
  constituency: string;
  type: string;
}

interface KYCDashboardProps {
  t: any;
  currentLang: string;
}

export default function KYCDashboard({ t, currentLang }: KYCDashboardProps) {
  const [constituencies, setConstituencies] = useState<string[]>([]);
  const [selectedConstituency, setSelectedConstituency] = useState('');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'MP' | 'MLA' | null>(null);

  // Fetch constituencies
  useEffect(() => {
    if (!viewMode) return;
    
    const endpoint = viewMode === 'MP' ? 'mps' : 'mlas';
    fetch(`http://localhost:8080/api/kyc/${endpoint}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.constituencies.length > 0) {
          setConstituencies(data.constituencies);
          setSelectedConstituency(data.constituencies[0]);
        }
      })
      .catch(err => console.error('Error fetching constituencies:', err));
  }, [viewMode]);

  // Fetch and auto-translate candidates
  useEffect(() => {
    if (!selectedConstituency || !viewMode) return;
    
    const fetchCandidates = async () => {
      setIsLoading(true);
      try {
        const endpoint = viewMode === 'MP' ? 'mps' : 'mlas';
        const res = await fetch(`http://localhost:8080/api/kyc/${endpoint}/${selectedConstituency}`);
        const data = await res.json();
        
        if (data.success) {
          let candidateList = data.candidates;

          // AI Translation Pass if not English
          if (currentLang !== 'English') {
            setIsTranslating(true);
            try {
              const transRes = await fetch('http://localhost:8080/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  content: { candidates: candidateList },
                  targetLang: currentLang
                })
              });
              const transData = await transRes.json();
              if (transData.success) {
                candidateList = transData.translated.candidates;
              }
            } catch (err) {
              console.error('AI Translation failed:', err);
            } finally {
              setIsTranslating(false);
            }
          }
          
          setCandidates(candidateList);
        }
      } catch (err) {
        console.error('Error fetching candidates:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidates();
  }, [selectedConstituency, viewMode, currentLang]);

  const handleSelect = (constituency: string) => {
    setSelectedConstituency(constituency);
    setIsDropdownOpen(false);
  };

  const getPartyClass = (party: string) => {
    const p = party.toUpperCase();
    if (p.includes('BJP')) return styles.bjp;
    if (p.includes('INC') || p.includes('CONGRESS')) return styles.inc;
    if (p.includes('JD(S)') || p.includes('JANATA')) return styles.jds;
    return styles.defaultParty;
  };

  if (!viewMode) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <h2 className={styles.modalTitle}>{t.modalTitle}</h2>
          <p className={styles.modalSubtitle}>{t.modalSub}</p>
          <div className={styles.modalOptions}>
            <div className={styles.optionCard} onClick={() => setViewMode('MP')}>
              <span className={styles.optionIcon}>🏛️</span>
              <span className={styles.optionLabel}>{t.mpLabel}</span>
              <span className={styles.optionDesc}>{t.mpDesc}</span>
            </div>
            <div className={styles.optionCard} onClick={() => setViewMode('MLA')}>
              <span className={styles.optionIcon}>🏘️</span>
              <span className={styles.optionLabel}>{t.mlaLabel}</span>
              <span className={styles.optionDesc}>{t.mlaDesc}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.titleRow}>
        <h1 className={`primary-gradient-text ${styles.title}`}>{t.kycTitle}</h1>
        <p className={styles.subtitle}>
          {viewMode === 'MP' ? t.kycSubMP : t.kycSubMLA}
        </p>
        
        <div className={styles.toggleContainer}>
          <button 
            className={`${styles.toggleButton} ${viewMode === 'MP' ? styles.toggleButtonActive : ''}`}
            onClick={() => setViewMode('MP')}
          >
            {t.mpShort}
          </button>
          <button 
            className={`${styles.toggleButton} ${viewMode === 'MLA' ? styles.toggleButtonActive : ''}`}
            onClick={() => setViewMode('MLA')}
          >
            {t.mlaShort}
          </button>
        </div>
      </div>
      
      <div className={styles.contentWrapper}>
        <header className={styles.header}>
          <div className={styles.selector}>
            <span className={styles.selectorLabel}>
              {viewMode === 'MP' ? t.selectLS : t.selectAssembly}
            </span>
            <div className={styles.dropdownContainer}>
              <div 
                className={`${styles.dropdownTrigger} ${isDropdownOpen ? styles.active : ''}`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span>{selectedConstituency || 'Select...'}</span>
                <span className={`${styles.dropdownIcon} ${isDropdownOpen ? styles.dropdownIconOpen : ''}`}>▼</span>
              </div>
              
              {isDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  {constituencies.map(c => (
                    <div 
                      key={c} 
                      className={`${styles.dropdownOption} ${selectedConstituency === c ? styles.dropdownOptionSelected : ''}`}
                      onClick={() => handleSelect(c)}
                    >
                      {c}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {isLoading || isTranslating ? (
          <div className={styles.error}>
            {isTranslating ? "Translating data using AI..." : t.loading}
          </div>
        ) : (
          <div className={styles.grid}>
            {candidates.map((candidate, idx) => (
              <div key={idx} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.info}>
                    <h3 className={styles.name}>{candidate.name}</h3>
                    <div className={styles.badgeRow}>
                      <span className={`${styles.partyBadge} ${getPartyClass(candidate.party)}`}>
                        {candidate.party}
                      </span>
                      <span className={styles.roleBadge}>
                        {viewMode === 'MP' ? t.sittingMP : t.sittingMLA}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.stats}>
                  <div className={styles.statRow}>
                    <div className={styles.statLabel}>
                      <span>{t.age}</span>
                      <span className={styles.statValue}>{candidate.age} {t.years}</span>
                    </div>
                  </div>

                  <div className={styles.statRow}>
                    <div className={styles.statLabel}>
                      <span>{viewMode === 'MP' ? t.parliamentarySeat : t.assemblySeat}</span>
                      <span className={styles.statValue}>{candidate.constituency}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
