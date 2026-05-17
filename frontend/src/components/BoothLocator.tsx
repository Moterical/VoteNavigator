"use client";

import React, { useState, useEffect } from 'react';
import styles from './BoothLocator.module.css';

interface District {
  id: string;
  name: string;
}

interface Constituency {
  id: string;
  name: string;
}

interface Booth {
  partNo: string;
  name: string;
  address: string;
  lat: string;
  lng: string;
}

interface BoothLocatorProps {
  t: any;
  currentLang: string;
}

const GMAPS_API_KEY = "AIzaSyCWzef610zNjlIgG-L3tfIAx1zvMPREgBQ";

export default function BoothLocator({ t, currentLang }: BoothLocatorProps) {
  const [districts, setDistricts] = useState<District[]>([]);
  const [constituencies, setConstituencies] = useState<Constituency[]>([]);
  const [booths, setBooths] = useState<Booth[]>([]);

  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedConstituency, setSelectedConstituency] = useState<string>('');
  const [selectedBooth, setSelectedBooth] = useState<Booth | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  // Fetch Districts on mount
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/booth/districts');
        const data = await res.json();
        if (data.success) {
          setDistricts(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch districts", err);
      }
    };
    fetchDistricts();
  }, []);

  // Fetch Constituencies when District changes
  useEffect(() => {
    if (!selectedDistrict) {
      setConstituencies([]);
      setSelectedConstituency('');
      setBooths([]);
      setSelectedBooth(null);
      return;
    }

    const fetchConstituencies = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:8080/api/booth/constituencies/${selectedDistrict}`);
        const data = await res.json();
        if (data.success) {
          setConstituencies(data.data);
          setSelectedConstituency('');
          setBooths([]);
          setSelectedBooth(null);
        }
      } catch (err) {
        console.error("Failed to fetch constituencies", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConstituencies();
  }, [selectedDistrict]);

  // Fetch Booths when Constituency changes
  useEffect(() => {
    if (!selectedConstituency) {
      setBooths([]);
      setSelectedBooth(null);
      return;
    }

    const fetchBooths = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:8080/api/booth/list/${selectedConstituency}`);
        const data = await res.json();
        if (data.success) {
          setBooths(data.data);
          setSelectedBooth(null);
        }
      } catch (err) {
        console.error("Failed to fetch booths", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooths();
  }, [selectedConstituency]);

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <h1 className={styles.title}>Browse Polling Stations</h1>
        <p className={styles.subtitle}>Select your area to find the exact location of your polling booth.</p>
      </div>

      <div className={styles.browserLayout}>
        {/* Left Side: Selectors & List */}
        <div className={styles.selectorPanel}>
          <div className={styles.dropdownGroup}>
            <label className={styles.label}>1. Select District</label>
            <select 
              className={styles.select}
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              <option value="">-- Choose District --</option>
              {districts.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.dropdownGroup}>
            <label className={styles.label}>2. Select Constituency</label>
            <select 
              className={styles.select}
              value={selectedConstituency}
              onChange={(e) => setSelectedConstituency(e.target.value)}
              disabled={!selectedDistrict || constituencies.length === 0}
            >
              <option value="">-- Choose Constituency --</option>
              {constituencies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {isLoading && <div className={styles.loadingText}>Loading...</div>}

          {booths.length > 0 && (
            <div className={styles.boothListSection}>
              <label className={styles.label}>3. Select Your Booth (Part)</label>
              <div className={styles.boothList}>
                {booths.map(booth => (
                  <div 
                    key={booth.partNo} 
                    className={`${styles.boothCard} ${selectedBooth?.partNo === booth.partNo ? styles.activeBooth : ''}`}
                    onClick={() => setSelectedBooth(booth)}
                  >
                    <div className={styles.partNoBadge}>Part {booth.partNo}</div>
                    <div className={styles.boothName}>{booth.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Map & Details */}
        <div className={styles.mapPanel}>
          {selectedBooth ? (
            <div className={styles.mapContainer}>
              <div className={styles.boothDetailsHeader}>
                <h3 className={styles.detailsTitle}>{selectedBooth.name}</h3>
                <p className={styles.detailsAddress}>{selectedBooth.address}</p>
              </div>
              <button 
                className={styles.navigateBtn}
                onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedBooth.lat},${selectedBooth.lng}`, '_blank')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                Get Directions
              </button>
            </div>
          ) : (
            <div className={styles.emptyMapState}>
              <div className={styles.emptyIcon}>🗺️</div>
              <p>Select a booth from the list to view its location on the map.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
