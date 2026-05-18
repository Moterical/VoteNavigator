"use client";

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './page.module.css';
import KYCDashboard from '../components/KYCDashboard';
import BoothLocator from '../components/BoothLocator';
import IssueReporter from '../components/IssueReporter';

export default function Home() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('English');
  const [activeTab, setActiveTab] = useState('chat');
  const languages = ['English', 'Hindi', 'Kannada'];

  const handleLangChange = (lang: string) => {
    setCurrentLang(lang);
    setIsLangDropdownOpen(false);
  };

  const translations: any = {
    English: {
      assistant: "Assistant", aiChat: "AI Chat", tools: "Tools",
      kycDashboard: "KYC Dashboard", boothLocator: "Booth Locator", issueReporter: "Issue Reporter", form6Wizard: "Form 6 Wizard",
      information: "Information", voterRights: "Voter Rights", knowledgeBase: "Knowledge Base",
      officialData: "Official Data Engine", title: "Election Navigator 2026",
      heroTitle: "How can I help you vote today?", heroSub: "Ask about registration, your EPIC number, or the local election steps.",
      sug1: "Am I eligible to vote?", sug2: "How to use Form 6?", sug3: "What is a VVPAT?", sug4: "ID docs needed for booth?",
      thinking: "Thinking...", verified: "Verified with Election Commission of India documentation.",
      placeholder: "Ask anything about the election...",
      // KYC Dashboard
      kycTitle: "Know your constituency",
      kycSubMP: "Explore your current representatives in the 18th Lok Sabha (2024 - 2029)",
      kycSubMLA: "Explore your current representatives in the 16th Vidhana Sabha",
      modalTitle: "Who do you want to find?",
      modalSub: "Select the type of representative you are looking for in Karnataka.",
      mpLabel: "Member of Parliament", mpDesc: "Central Representative (Lok Sabha)",
      mlaLabel: "Member of Assembly", mlaDesc: "State Representative (Vidhana Sabha)",
      selectLS: "Select LS Constituency", selectAssembly: "Select Assembly Area",
      sittingMP: "Sitting MP", sittingMLA: "Sitting MLA",
      age: "Age", years: "Years",
      parliamentarySeat: "Parliamentary Seat", assemblySeat: "Assembly Seat",
      mpShort: "MP (Central)", mlaShort: "MLA (State)", loading: "Loading representatives..."
    },
    Hindi: {
      assistant: "सहायक", aiChat: "एआई चैट", tools: "उपकरण",
      kycDashboard: "केवाईसी डैशबोर्ड", boothLocator: "बूथ लोकेटर", issueReporter: "शिकायत दर्ज करें", form6Wizard: "फॉर्म 6 विज़ार्ड",
      information: "जानकारी", voterRights: "मतदाता अधिकार", knowledgeBase: "ज्ञानकोष",
      officialData: "आधिकारिक डेटा इंजन", title: "चुनाव नेविगेटर 2026",
      heroTitle: "आज वोट करने में मैं आपकी कैसे मदद कर सकता हूँ?", heroSub: "पंजीकरण, अपने EPIC नंबर, या स्थानीय चुनाव चरणों के बारे में पूछें।",
      sug1: "क्या मैं वोट देने के योग्य हूँ?", sug2: "फॉर्म 6 का उपयोग कैसे करें?", sug3: "वीवीपैट (VVPAT) क्या है?", sug4: "बूथ के लिए कौन से आईडी दस्तावेज़ चाहिए?",
      thinking: "सोच रहा हूँ...", verified: "भारत के चुनाव आयोग के दस्तावेजों से सत्यापित।",
      placeholder: "चुनाव के बारे में कुछ भी पूछें...",
      // KYC Dashboard
      kycTitle: "अपने निर्वाचन क्षेत्र को जानें",
      kycSubMP: "18वीं लोकसभा (2024 - 2029) में अपने वर्तमान प्रतिनिधियों को खोजें",
      kycSubMLA: "16वीं विधानसभा में अपने वर्तमान प्रतिनिधियों को खोजें",
      modalTitle: "आप किसे ढूंढना चाहते हैं?",
      modalSub: "कर्नाटक में आप जिस प्रकार के प्रतिनिधि की तलाश कर रहे हैं उसका चयन करें।",
      mpLabel: "सांसद (MP)", mpDesc: "केंद्रीय प्रतिनिधि (लोकसभा)",
      mlaLabel: "विधायक (MLA)", mlaDesc: "राज्य प्रतिनिधि (विधानसभा)",
      selectLS: "लोकसभा निर्वाचन क्षेत्र चुनें", selectAssembly: "विधानसभा क्षेत्र चुनें",
      sittingMP: "वर्तमान सांसद", sittingMLA: "वर्तमान विधायक",
      age: "आयु", years: "वर्ष",
      parliamentarySeat: "संसदीय सीट", assemblySeat: "विधानसभा सीट",
      mpShort: "सांसद (MP)", mlaShort: "विधायक (MLA)", loading: "प्रतिनिधियों को लोड किया जा रहा है..."
    },
    Kannada: {
      assistant: "ಸಹಾಯಕ", aiChat: "ಎಐ ಚಾಟ್", tools: "ಪರಿಕರಗಳು",
      kycDashboard: "KYC ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", boothLocator: "ಬೂತ್ ಲೊಕೇಟರ್", issueReporter: "ದೂರು ದಾಖಲಿಸಿ", form6Wizard: "ನಮೂನೆ 6 ವಿಝಾರ್ಡ್",
      information: "ಮಾಹಿತಿ", voterRights: "ಮತದಾರರ ಹಕ್ಕುಗಳು", knowledgeBase: "ಜ್ಞಾನದ ನೆಲೆ",
      officialData: "ಅಧಿಕೃತ ಡೇಟಾ ಎಂಜಿನ್", title: "ಚುನಾವಣಾ ಮಾರ್ಗದರ್ಶಿ 2026",
      heroTitle: "ಇಂದು ಮತ ಚಲಾಯಿಸಲು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?", heroSub: "ನೋಂದಣಿ, ನಿಮ್ಮ EPIC ಸಂಖ್ಯೆ ಅಥವಾ ಸ್ಥಳೀಯ ಚುನಾವಣಾ ಹಂತಗಳ ಬಗ್ಗೆ ಕೇಳಿ.",
      sug1: "ನಾನು ಮತ ಚಲಾಯಿಸಲು ಅರ್ಹನೇ?", sug2: "ನಮೂನೆ 6 ಅನ್ನು ಹೇಗೆ ಬಳಸುವುದು?", sug3: "VVPAT ಎಂದರೇನು?", sug4: "ಮತಗಟ್ಟೆಗೆ ಯಾವ ಐಡಿ ದಾಖಲೆಗಳು ಬೇಕು?",
      thinking: "ಯೋಚಿಸುತ್ತಿದೆ...", verified: "ಭಾರತದ ಚುನಾವಣಾ ಆಯೋಗದ ದಾಖಲಾತಿಯೊಂದಿಗೆ ಪರಿಶೀಲಿಸಲಾಗಿದೆ.",
      placeholder: "ಚುನಾವಣೆಯ ಬಗ್ಗೆ ಏನಾದರೂ ಕೇಳಿ...",
      // KYC Dashboard
      kycTitle: "ನಿಮ್ಮ ಕ್ಷೇತ್ರವನ್ನು ತಿಳಿಯಿರಿ",
      kycSubMP: "18ನೇ ಲೋಕಸಭೆಯಲ್ಲಿ (2024 - 2029) ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಪ್ರತಿನಿಧಿಗಳನ್ನು ಅನ್ವೇಷಿಸಿ",
      kycSubMLA: "16ನೇ ವಿಧಾನಸಭೆಯಲ್ಲಿ ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಪ್ರತಿನಿಧಿಗಳನ್ನು ಅನ್ವೇಷಿಸಿ",
      modalTitle: "ನೀವು ಯಾರನ್ನು ಹುಡುಕಲು ಬಯಸುತ್ತೀರಿ?",
      modalSub: "ಕರ್ನಾಟಕದಲ್ಲಿ ನೀವು ಹುಡುಕುತ್ತಿರುವ ಪ್ರತಿನಿಧಿಯ ಪ್ರಕಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
      mpLabel: "ಸಂಸತ್ ಸದಸ್ಯರು (MP)", mpDesc: "ಕೇಂದ್ರ ಪ್ರತಿನಿಧಿ (ಲೋಕಸಭೆ)",
      mlaLabel: "ಶಾಸಕರು (MLA)", mlaDesc: "ರಾಜ್ಯ ಪ್ರತಿನಿಧಿ (ವಿಧಾನಸಭೆ)",
      selectLS: "ಲೋಕಸಭಾ ಕ್ಷೇತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ", selectAssembly: "ವಿಧಾನಸಭಾ ಕ್ಷೇತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
      sittingMP: "ಪ್ರಸ್ತುತ ಸಂಸದರು", sittingMLA: "ಪ್ರಸ್ತುತ ಶಾಸಕರು",
      age: "ವಯಸ್ಸು", years: "ವರ್ಷಗಳು",
      parliamentarySeat: "ಸಂಸದೀಯ ಕ್ಷೇತ್ರ", assemblySeat: "ಶಾಸನಸಭೆಯ ಕ್ಷೇತ್ರ",
      mpShort: "ಸಂಸದರು (MP)", mlaShort: "ಶಾಸಕರು (MLA)", loading: "ಪ್ರತಿನಿಧಿಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ..."
    }
  };

  const t = translations[currentLang] || translations['English'];

  // Auto-close sidebar on mobile devices on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 900) {
      setSidebarOpen(false);
    }
  }, []);

  const sendMessage = async (text: string) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;

    // 1. Add user message to UI
    const userMsg = { role: 'user', content: messageText, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // 2. Call backend API
      const response = await fetch('http://localhost:8080/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText }),
      });

      const data = await response.json();

      // 3. Add AI message to UI
      const aiMsg = {
        role: 'assistant',
        content: data.message,
        context: data.contextUsed,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later.",
        error: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestion = (text: string) => {
    sendMessage(text);
  };

  return (
    <main className={styles.main}>
      {/* Mobile Overlay */}
      <div
        className={`${styles.overlay} ${isSidebarOpen ? styles.overlayVisible : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar - Quick Navigation */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : styles.closed}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🗳️</span>
            <h1 className={styles.logoText}>Vote<span>Navigator</span></h1>
          </div>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navGroup}>
            <span className={styles.navLabel}>{t.assistant}</span>
            <button 
              className={`${styles.navItem} ${activeTab === 'chat' ? styles.active : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              <span className={styles.icon}>💬</span> {t.aiChat}
            </button>
          </div>

          <div className={styles.navGroup}>
            <span className={styles.navLabel}>{t.tools}</span>
            <button 
              className={`${styles.navItem} ${activeTab === 'kyc' ? styles.active : ''}`}
              onClick={() => setActiveTab('kyc')}
            >
              <span className={styles.icon}>🗓️</span> {t.kycDashboard}
            </button>
            <button 
              className={`${styles.navItem} ${activeTab === 'booth' ? styles.active : ''}`}
              onClick={() => setActiveTab('booth')}
            >
              <span className={styles.icon}>📝</span> {t.boothLocator}
            </button>
            <button 
              className={`${styles.navItem} ${activeTab === 'issue' ? styles.active : ''}`}
              onClick={() => setActiveTab('issue')}
            >
              <span className={styles.icon}>📢</span> {t.issueReporter}
            </button>
            <button 
              className={`${styles.navItem} ${activeTab === 'form6' ? styles.active : ''}`}
              onClick={() => setActiveTab('form6')}
            >
              <span className={styles.icon}>🆔</span> {t.form6Wizard}
            </button>
          </div>

          <div className={styles.navGroup}>
            <span className={styles.navLabel}>{t.information}</span>
            <button className={styles.navItem}>
              <span className={styles.icon}>🛡️</span> {t.voterRights}
            </button>
            <button className={styles.navItem}>
              <span className={styles.icon}>📚</span> {t.knowledgeBase}
            </button>
          </div>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.statusBadge}>
            <span className={styles.statusDot}></span> {t.officialData}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <section className={styles.content}>
        {/* Header / Top Bar */}
        <header className={styles.header}>
          <button
            className={styles.menuToggle}
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? '⇠' : '⇢'}
          </button>

          <div className={styles.headerTitle}>
            <h2 className="gradient-text">{t.title}</h2>
          </div>

          <div className={styles.headerActions}>
            <div className={styles.langContainer}>
              <button 
                className={styles.langBtn}
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              >
                🌐 {currentLang} <span>{isLangDropdownOpen ? '▴' : '▾'}</span>
              </button>
              
              {isLangDropdownOpen && (
                <div className={styles.langDropdown}>
                  {languages.map(lang => (
                    <button 
                      key={lang}
                      className={styles.langOption}
                      onClick={() => handleLangChange(lang)}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Chat / Feature Area */}
        <div className={styles.viewContainer}>
          {activeTab === 'chat' ? (
            <div className={styles.chatArea}>
              {messages.length === 0 ? (
                <div className={styles.welcomeHero}>
                  <h1 className="primary-gradient-text">{t.heroTitle}</h1>
                  <p>{t.heroSub}</p>

                  <div className={styles.suggestionGrid}>
                    <button className={styles.suggestionBox} onClick={() => handleSuggestion(t.sug1)}>
                      <span>🗳️</span> "{t.sug1}"
                    </button>
                    <button className={styles.suggestionBox} onClick={() => handleSuggestion(t.sug2)}>
                      <span>📝</span> "{t.sug2}"
                    </button>
                    <button className={styles.suggestionBox} onClick={() => handleSuggestion(t.sug3)}>
                      <span>📜</span> "{t.sug3}"
                    </button>
                    <button className={styles.suggestionBox} onClick={() => handleSuggestion(t.sug4)}>
                      <span>🆔</span> "{t.sug4}"
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.messageList}>
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`${styles.message} ${styles[msg.role]}`}>
                      <div className={styles.avatar}>{msg.role === 'user' ? '👤' : '🤖'}</div>
                      <div className={styles.messageContent}>
                        <div className={styles.text}>
                          {msg.role === 'assistant' ? (
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          ) : (
                            msg.content
                          )}
                        </div>
                        {msg.context && msg.context.length > 0 && (
                          <div className={styles.sources}>
                            Verified via: {msg.context.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className={`${styles.message} ${styles.assistant}`}>
                      <div className={styles.avatar}>🤖</div>
                      <div className={styles.messageContent}>
                        <div className={styles.typing}>{t.thinking}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Chat Input */}
              <div className={styles.inputContainer}>
                <div className={styles.inputWrapper}>
                  <button className={styles.voiceBtn}>🎤</button>
                  <input
                    type="text"
                    placeholder={t.placeholder}
                    className={styles.chatInput}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage('')}
                  />
                  <button
                    className={styles.sendBtn}
                    onClick={() => sendMessage('')}
                    disabled={isLoading}
                  >
                    {isLoading ? '...' : '🚀'}
                  </button>
                </div>
                <p className={styles.inputDisclaimer}>{t.verified}</p>
              </div>
            </div>
          ) : activeTab === 'kyc' ? (
            <div className={styles.kycTab}>
              <KYCDashboard t={t} currentLang={currentLang} />
            </div>
          ) : activeTab === 'booth' ? (
            <div className={styles.kycTab}>
              <BoothLocator t={t} currentLang={currentLang} />
            </div>
          ) : activeTab === 'issue' ? (
            <div className={styles.kycTab}>
              <IssueReporter />
            </div>
          ) : (
            <div className={styles.chatArea}>
              <div className={styles.welcomeHero}>
                <h1 className="primary-gradient-text">{t.assistant}</h1>
                <p>{t.heroSub}</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
