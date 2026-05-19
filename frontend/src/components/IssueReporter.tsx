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

function RepresentativeImage({ name }: { name: string }) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!name) return;
    setError(false);
    setImgUrl(null);

    const fetchWikiImage = async () => {
      try {
        const cleanName = name.replace(/^(Dr\.|Shri\.|Smt\.|Mr\.|Mrs\.|H\.Y\.)\s+/gi, '').trim();
        const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(cleanName)}&prop=pageimages&pithumbsize=200&format=json&formatversion=2&origin=*`;
        const res = await fetch(url);
        const data = await res.json();
        
        const page = data?.query?.pages?.[0];
        if (page && page.thumbnail && page.thumbnail.source) {
          setImgUrl(page.thumbnail.source);
        } else {
          // Fallback: Search for the title first
          const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(cleanName + ' MLA Karnataka')}&format=json&origin=*`;
          const searchRes = await fetch(searchUrl);
          const searchData = await searchRes.json();
          const firstResult = searchData?.query?.search?.[0];
          
          if (firstResult && firstResult.title) {
            const pageUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(firstResult.title)}&prop=pageimages&pithumbsize=200&format=json&formatversion=2&origin=*`;
            const pageRes = await fetch(pageUrl);
            const pageData = await pageRes.json();
            const pageInfo = pageData?.query?.pages?.[0];
            if (pageInfo && pageInfo.thumbnail && pageInfo.thumbnail.source) {
              setImgUrl(pageInfo.thumbnail.source);
              return;
            }
          }
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching wiki image:', err);
        setError(true);
      }
    };

    fetchWikiImage();
  }, [name]);

  const getInitials = (fullName: string) => {
    const clean = fullName.replace(/^(Dr\.|Shri\.|Smt\.|Mr\.|Mrs\.|H\.Y\.)\s+/gi, '').trim();
    const parts = clean.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return clean.slice(0, 2).toUpperCase();
  };

  if (imgUrl && !error) {
    return (
      <img 
        src={imgUrl} 
        alt={name} 
        className={styles.repPhoto} 
        onError={() => setError(true)}
      />
    );
  }

  const initials = getInitials(name);
  const colors = [
    'linear-gradient(135deg, #2563eb, #1d4ed8)',
    'linear-gradient(135deg, #7c3aed, #6d28d9)',
    'linear-gradient(135deg, #059669, #047857)',
    'linear-gradient(135deg, #db2777, #be185d)',
    'linear-gradient(135deg, #d97706, #b45309)',
  ];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const bg = colors[hash % colors.length];

  return (
    <div className={styles.repPhotoFallback} style={{ background: bg }}>
      {initials}
    </div>
  );
}

export default function IssueReporter() {
  const [districts, setDistricts] = useState<District[]>([]);
  const [constituencies, setConstituencies] = useState<Constituency[]>([]);
  
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedConstituency, setSelectedConstituency] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [evidencePreview, setEvidencePreview] = useState<string | null>(null);
  
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setEvidenceFile(file);

    // If it's an image, create a URL preview
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEvidencePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setEvidencePreview(null);
    }
  };

  const handleRemoveFile = () => {
    setEvidenceFile(null);
    setEvidencePreview(null);
  };

  const handleGenerate = async () => {
    if (!selectedConstituency || !issueDescription || !evidenceFile) return;

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
        areaName,
        evidenceType: evidenceFile.type.startsWith('image/') ? 'photographic' : 'video'
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

          <div className={styles.inputGroup}>
            <label>4. Upload Photo / Video Evidence</label>
            {!evidenceFile ? (
              <div 
                className={styles.uploadZone}
                onClick={() => document.getElementById('evidence-upload')?.click()}
              >
                <span className={styles.uploadText}>Click to upload Image or Video evidence</span>
                <span className={styles.uploadSubtext}>Supported formats: JPG, PNG, MP4 (Max 10MB)</span>
                <input 
                  type="file"
                  id="evidence-upload"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className={styles.hiddenFileInput}
                />
              </div>
            ) : (
              <div className={styles.uploadedFileCard}>
                {evidencePreview ? (
                  <img src={evidencePreview} alt="Preview" className={styles.fileThumbnail} />
                ) : (
                  <div className={styles.videoIconThumbnail}>
                    {evidenceFile.type.startsWith('video/') ? '🎥' : '📄'}
                  </div>
                )}
                <div className={styles.fileDetails}>
                  <span className={styles.fileName}>{evidenceFile.name}</span>
                  <span className={styles.fileSize}>{(evidenceFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                </div>
                <button type="button" className={styles.removeFileBtn} onClick={handleRemoveFile}>
                  ✕
                </button>
              </div>
            )}
          </div>

          <button 
            className={styles.generateBtn}
            onClick={handleGenerate}
            disabled={!selectedConstituency || !issueDescription || !evidenceFile || isLoading}
          >
            {isLoading ? "Analyzing & Drafting..." : "Generate Official Complaint"}
          </button>
          
          {error && <p style={{ color: '#ef4444', fontSize: '14px' }}>{error}</p>}
        </div>

        {/* Right Panel: Action Area */}
        <div className={styles.actionPanel}>
          {isLoading ? (
            <div className={styles.loadingState}>
              <div className={styles.sparkleIcon}>⚡</div>
              <h3 className={styles.loadingTitle}>Drafting Complaint...</h3>
              <p className={styles.loadingProgress}>
                Gemini is composing a professional letter to your representative...
              </p>
              
              <div className={styles.skeletonRepCard}>
                <div className={styles.skeletonAvatar}></div>
                <div className={styles.skeletonRepInfo}>
                  <div className={styles.skeletonLineShort}></div>
                  <div className={styles.skeletonLineTiny}></div>
                </div>
              </div>

              <div className={styles.skeletonDraftArea}>
                <div className={styles.skeletonLineFull}></div>
                <div className={styles.skeletonLineFull}></div>
                <div className={styles.skeletonLineMedium}></div>
              </div>
            </div>
          ) : !repInfo ? (
            <div className={styles.placeholderState}>
              <span>📋</span>
              <p>Fill out the details on the left to identify your representative and draft a formal complaint.</p>
            </div>
          ) : (
            <>
              <div className={styles.repCard}>
                <RepresentativeImage name={repInfo.name} />
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
