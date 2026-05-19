import React, { useState, useEffect } from 'react';
import styles from './VoterRights.module.css';

interface VoterRightsProps {
  t: any;
  currentLang: string;
}

interface Right {
  id: number;
  right_title: string;
  description: string;
  action_to_take: string;
  contact: string;
  source_url: string;
  display_order: number;
}

export default function VoterRights({ t, currentLang }: VoterRightsProps) {
  const [rights, setRights] = useState<Right[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRight, setSelectedRight] = useState<Right | null>(null);

  useEffect(() => {
    async function fetchRights() {
      try {
        const res = await fetch('http://localhost:8080/api/content/rights');
        const data = await res.json();
        if (data && data.rights) {
          setRights(data.rights);
        }
      } catch (err) {
        console.error('Failed to fetch rights:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchRights();
  }, []);

  // Map right ids to appropriate graphic icons
  const getIcon = (id: number) => {
    switch (id) {
      case 1: return '🔒'; // Secret Ballot
      case 2: return '🛡️'; // Intimidation
      case 3: return '🆔'; // Lost ID Alternative Docs
      case 4: return '🗳️'; // Tendered Vote
      case 5: return '♿'; // Accessibility
      case 6: return '🏠'; // Vote from Home
      case 7: return '📢'; // cVIGIL Complaint
      case 8: return 'ℹ️'; // Candidate Info
      default: return '⚖️';
    }
  };

  const filteredRights = rights.filter(right =>
    right.right_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    right.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (right.action_to_take && right.action_to_take.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={styles.container}>
      <div className={styles.headerArea}>
        <h1 className={styles.title}>🛡️ Voter Rights & Protections</h1>
        <p className={styles.subtitle}>
          Learn about your constitutional rights, official voting guarantees, and ECI protections.
        </p>
        
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search rights (e.g. secrecy, cVIGIL, ID)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingArea}>
          <div className={styles.spinner}></div>
          <p>Fetching ECI Voter Rights...</p>
        </div>
      ) : (
        <div className={styles.rightsGrid}>
          {filteredRights.map((right) => (
            <div 
              key={right.id} 
              className={styles.card}
              onClick={() => setSelectedRight(right)}
            >
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>{getIcon(right.id)}</span>
                <h3 className={styles.cardTitle}>{right.right_title}</h3>
              </div>
              <p className={styles.cardDescription}>{right.description}</p>
              <div className={styles.cardFooter}>
                <span className={styles.learnMore}>Learn how to exercise this right →</span>
              </div>
            </div>
          ))}
          {filteredRights.length === 0 && (
            <div className={styles.noResults}>
              <p>No rights found matching your search. Try searching other keywords.</p>
            </div>
          )}
        </div>
      )}

      {/* Drawer Detail View */}
      {selectedRight && (
        <div className={styles.drawerOverlay} onClick={() => setSelectedRight(null)}>
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelectedRight(null)}>✕</button>
            
            <div className={styles.drawerHeader}>
              <span className={styles.drawerIcon}>{getIcon(selectedRight.id)}</span>
              <h2 className={styles.drawerTitle}>{selectedRight.right_title}</h2>
              <span className={styles.verifiedBadge}>✓ ECI Verified</span>
            </div>

            <div className={styles.drawerContent}>
              <div className={styles.section}>
                <h4>Law & Guarantee</h4>
                <p className={styles.drawerText}>{selectedRight.description}</p>
              </div>

              {selectedRight.action_to_take && (
                <div className={`${styles.section} ${styles.highlightSection}`}>
                  <h4>🚨 Proactive Steps to Take</h4>
                  <p className={styles.drawerText}>{selectedRight.action_to_take}</p>
                </div>
              )}

              {selectedRight.contact && (
                <div className={styles.section}>
                  <h4>📞 Official Help Desk</h4>
                  <div className={styles.contactBadge}>
                    <span>{selectedRight.contact}</span>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.drawerFooter}>
              {selectedRight.source_url && (
                <a 
                  href={selectedRight.source_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.sourceBtn}
                >
                  🌐 View Official ECI Guidelines
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
