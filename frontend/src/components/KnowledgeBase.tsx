import React, { useState, useEffect } from 'react';
import styles from './KnowledgeBase.module.css';

interface KnowledgeBaseProps {
  t: any;
  currentLang: string;
}

interface KnowledgeItem {
  id: number;
  concept_key: string;
  title: string;
  abbreviation: string | null;
  full_form: string | null;
  short_description: string;
  full_explanation: string;
  example: string | null;
  can_citizens_vote: boolean | null;
  category: string;
  source_url: string;
}

export default function KnowledgeBase({ t, currentLang }: KnowledgeBaseProps) {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);

  useEffect(() => {
    async function fetchKnowledge() {
      try {
        const res = await fetch('http://localhost:8080/api/content/knowledge');
        const data = await res.json();
        if (data && data.items) {
          setItems(data.items);
        }
      } catch (err) {
        console.error('Failed to fetch knowledge:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchKnowledge();
  }, []);

  const categories = ['All', 'Election Types', 'Terminology', 'Process & Tools', 'Officials & Bodies'];

  const getCategoryLabel = (category: string) => {
    if (category === 'election_type') return 'Election Types';
    if (category === 'terminology') return 'Terminology';
    if (category === 'voting_process') return 'Process & Tools';
    if (category === 'bodies') return 'Officials & Bodies';
    return category;
  };

  const filteredItems = items.filter(item => {
    // 1. Search Query filter
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.short_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.full_explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.full_form && item.full_form.toLowerCase().includes(searchQuery.toLowerCase()));

    // 2. Category Pill filter
    if (selectedCategory === 'All') return matchesSearch;
    if (selectedCategory === 'Election Types') return matchesSearch && item.category === 'election_type';
    if (selectedCategory === 'Terminology') return matchesSearch && item.category === 'terminology';
    if (selectedCategory === 'Process & Tools') return matchesSearch && item.category === 'voting_process';
    if (selectedCategory === 'Officials & Bodies') return matchesSearch && item.category === 'bodies';
    
    return matchesSearch;
  });

  return (
    <div className={styles.container}>
      <div className={styles.headerArea}>
        <h1 className={styles.title}>📚 Election Knowledge Base</h1>
        <p className={styles.subtitle}>
          Your quick directory for electoral terminology, government offices, and direct citizen vote checks.
        </p>

        <div className={styles.controlsRow}>
          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search concepts (e.g. EVM, BLO, Rajya Sabha)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.categoryPills}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`${styles.pill} ${selectedCategory === cat ? styles.activePill : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingArea}>
          <div className={styles.spinner}></div>
          <p>Loading electoral terminology library...</p>
        </div>
      ) : (
        <div className={styles.knowledgeGrid}>
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              className={styles.card}
              onClick={() => setSelectedItem(item)}
            >
              <div className={styles.cardTopRow}>
                <span className={`${styles.categoryTag} ${styles[item.category]}`}>
                  {getCategoryLabel(item.category)}
                </span>
                
                {item.category === 'election_type' && item.can_citizens_vote !== null && (
                  <span className={`${styles.voteBadge} ${item.can_citizens_vote ? styles.directYes : styles.directNo}`}>
                    {item.can_citizens_vote ? 'Direct Vote ✅' : 'No Direct Vote ❌'}
                  </span>
                )}
              </div>

              <h3 className={styles.cardTerm}>
                {item.title} 
                {item.abbreviation && <span className={styles.abbrevPill}>{item.abbreviation}</span>}
              </h3>
              
              {item.full_form && <p className={styles.fullFormText}>{item.full_form}</p>}
              
              <p className={styles.cardDefinition}>{item.short_description}</p>
              
              <div className={styles.cardFooter}>
                <span className={styles.detailsLink}>View detailed definition →</span>
              </div>
            </div>
          ))}
          {filteredItems.length === 0 && (
            <div className={styles.noResults}>
              <p>No terminology matches your query. Try searching other categories or terms.</p>
            </div>
          )}
        </div>
      )}

      {/* Detail Overlay */}
      {selectedItem && (
        <div className={styles.overlay} onClick={() => setSelectedItem(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelectedItem(null)}>✕</button>
            
            <div className={styles.modalHeader}>
              <span className={`${styles.categoryTag} ${styles[selectedItem.category]}`}>
                {getCategoryLabel(selectedItem.category)}
              </span>
              <h2 className={styles.modalTitle}>{selectedItem.title}</h2>
              {selectedItem.full_form && <p className={styles.modalSub}>{selectedItem.full_form}</p>}
            </div>

            <div className={styles.modalBody}>
              <div className={styles.section}>
                <h4>Definition & Details</h4>
                <p className={styles.definitionText}>{selectedItem.full_explanation}</p>
              </div>

              {selectedItem.example && (
                <div className={styles.section}>
                  <h4>💡 Real-world Example</h4>
                  <p className={styles.exampleText}>"{selectedItem.example}"</p>
                </div>
              )}

              {selectedItem.category === 'election_type' && selectedItem.can_citizens_vote !== null && (
                <div className={`${styles.section} ${selectedItem.can_citizens_vote ? styles.voteYesBlock : styles.voteNoBlock}`}>
                  <h4>🗳️ Direct Citizen Vote Assessment</h4>
                  <div className={styles.assessmentHeader}>
                    <strong>Status: </strong>
                    <span className={selectedItem.can_citizens_vote ? styles.textYes : styles.textNo}>
                      {selectedItem.can_citizens_vote ? 'Direct Citizen Vote (Your Vote Counts Directly)' : 'Indirect Election (State Representatives Elect on Your Behalf)'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              {selectedItem.source_url && (
                <a 
                  href={selectedItem.source_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.sourceBtn}
                >
                  🌐 View Official ECI Definitions
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
