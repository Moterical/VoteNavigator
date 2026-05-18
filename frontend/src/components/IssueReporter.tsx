"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './IssueReporter.module.css';

interface District {
  id: string;
  name: string;
}

interface Constituency {
  id: string;
  name: string;
}

interface Representative {
  name: string;
  party: string;
  phone: string;
  email: string;
  photoUrl: string;
}

export default function IssueReporter() {
  const [districts, setDistricts] = useState<District[]>([]);
  const [constituencies, setConstituencies] = useState<Constituency[]>([]);
  
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedConstituency, setSelectedConstituency] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  
  const [repInfo, setRepInfo] = useState<Representative | null>(null);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  useEffect(() => {
    // Fetch districts on mount
    axios.get(`${API_BASE}/api/booth/districts`)
      .then(res => setDistricts(res.data.data || []))
      .catch(err => console.error(err));
  }, []);

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dId = e.target.value;
    setSelectedDistrict(dId);
    setSelectedConstituency("");
    setRepInfo(null);
    setDraft("");
    
    if (dId) {
      axios.get(`${API_BASE}/api/booth/constituencies/${dId}`)
        .then(res => setConstituencies(res.data.data || []))
        .catch(err => console.error(err));
    } else {
      setConstituencies([]);
    }
  };

  const handleGenerate = async () => {
    if (!selectedConstituency || !issueDescription) return;

    setIsLoading(true);
    setError("");
    setRepInfo(null);
    setDraft("");

    try {
      // 1. Fetch the representative info
      const repRes = await axios.get(`${API_BASE}/api/civic/representative/${selectedConstituency}`);
      
      if (!repRes.data.success) {
        throw new Error(repRes.data.message || "Representative not found for this area.");
      }

      const repData = repRes.data.data;
      setRepInfo(repData);

      // Get Area Name for the prompt
      const areaName = constituencies.find(c => c.id === selectedConstituency)?.name || "my area";

      // 2. Generate the draft
      const draftRes = await axios.post(`${API_BASE}/api/civic/draft-complaint`, {
        issueDescription,
        repName: repData.name,
        areaName
      });

      if (draftRes.data.success) {
        setDraft(draftRes.data.draft);
      } else {
        throw new Error("Failed to generate draft.");
      }

    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const getMailtoLink = () => {
    if (!repInfo || !draft) return "#";
    const subject = encodeURIComponent("Urgent Civic Issue Report");
    const body = encodeURIComponent(draft);
    return `mailto:${repInfo.email}?subject=${subject}&body=${body}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(draft);
    alert("Draft copied to clipboard!");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Civic Issue Reporter</h2>
        <p>Report local issues and escalate them directly to your elected representative.</p>
      </div>

      <div className={styles.mainContent}>
        
        {/* Left Panel: Input Area */}
        <div className={styles.inputPanel}>
          <div className={styles.inputGroup}>
            <label>1. Select Your District</label>
            <select className={styles.select} value={selectedDistrict} onChange={handleDistrictChange}>
              <option value="">-- Choose District --</option>
              {districts.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>2. Select Your Constituency</label>
            <select 
              className={styles.select} 
              value={selectedConstituency} 
              onChange={e => setSelectedConstituency(e.target.value)}
              disabled={!selectedDistrict}
            >
              <option value="">-- Choose Constituency --</option>
              {constituencies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>3. Describe the Issue</label>
            <textarea 
              className={styles.textarea}
              placeholder="e.g., Deep potholes on 100ft road causing accidents, or water supply missing for 3 days..."
              value={issueDescription}
              onChange={e => setIssueDescription(e.target.value)}
            />
          </div>

          <button 
            className={styles.generateBtn}
            onClick={handleGenerate}
            disabled={!selectedConstituency || !issueDescription || isLoading}
          >
            {isLoading ? "Analyzing & Drafting..." : "Generate Official Complaint"}
          </button>
          
          {error && <p style={{ color: '#ef4444', fontSize: '14px' }}>{error}</p>}
        </div>

        {/* Right Panel: Action Area */}
        <div className={styles.actionPanel}>
          {!repInfo ? (
            <div className={styles.placeholderState}>
              <span>📋</span>
              <p>Fill out the details on the left to identify your representative and draft a formal complaint.</p>
            </div>
          ) : (
            <>
              <div className={styles.repCard}>
                <img src={repInfo.photoUrl} alt={repInfo.name} className={styles.repPhoto} />
                <div className={styles.repInfo}>
                  <h3>{repInfo.name}</h3>
                  <span className={styles.partyTag}>{repInfo.party} MLA</span>
                </div>
              </div>

              <div className={styles.draftSection}>
                <h4>AI Drafted Complaint</h4>
                <textarea 
                  className={styles.draftEditor}
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                />
              </div>

              <div className={styles.actionButtons}>
                <a href={`tel:${repInfo.phone}`} className={`${styles.actionBtn} ${styles.callBtn}`}>
                  📞 Call Ward Office
                </a>
                <a href={getMailtoLink()} className={`${styles.actionBtn} ${styles.emailBtn}`}>
                  ✉️ 1-Click Email
                </a>
                <button onClick={copyToClipboard} className={`${styles.actionBtn} ${styles.callBtn}`} style={{ gridColumn: 'span 2' }}>
                  📋 Copy Draft to Clipboard
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
