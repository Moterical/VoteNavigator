const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { scrapeKarnatakaMembers, scrapeKarnatakaMLAs } = require('../services/scraperService');

// Helper to get MP data
async function getMPData() {
  try {
    return await scrapeKarnatakaMembers();
  } catch (error) {
    const dataPath = path.join(__dirname, '../data/mockCandidates.json');
    const rawData = fs.readFileSync(dataPath);
    return JSON.parse(rawData);
  }
}

// Helper to get MLA data
async function getMLAData() {
  try {
    return await scrapeKarnatakaMLAs();
  } catch (error) {
    const dataPath = path.join(__dirname, '../data/mockMLAs.json');
    const rawData = fs.readFileSync(dataPath);
    return JSON.parse(rawData);
  }
}

// GET /api/kyc/mps/:constituency
router.get('/mps/:constituency', async (req, res) => {
  try {
    const data = await getMPData();
    const constituency = req.params.constituency;
    
    // Case-insensitive lookup with Mysore/Mysuru alias support
    const matchKey = Object.keys(data).find(k => {
      const kl = k.toLowerCase();
      const cl = constituency.toLowerCase();
      if (kl === cl) return true;
      if ((kl === 'mysore' || kl === 'mysuru') && (cl === 'mysore' || cl === 'mysuru')) return true;
      return false;
    });
    
    if (matchKey && data[matchKey]) {
      res.json({ success: true, candidates: data[matchKey] });
    } else {
      // Fallback search in mock data
      try {
        const mockPath = path.join(__dirname, '../data/mockCandidates.json');
        const mockRaw = fs.readFileSync(mockPath);
        const mockData = JSON.parse(mockRaw);
        const mockKey = Object.keys(mockData).find(k => {
          const kl = k.toLowerCase();
          const cl = constituency.toLowerCase();
          if (kl === cl) return true;
          if ((kl === 'mysore' || kl === 'mysuru') && (cl === 'mysore' || cl === 'mysuru')) return true;
          return false;
        });
        if (mockKey && mockData[mockKey]) {
          return res.json({ success: true, candidates: mockData[mockKey] });
        }
      } catch (mockErr) {
        console.error('Mock MP fallback search failed:', mockErr);
      }
      res.status(404).json({ success: false, message: 'Not found' });
    }
  } catch (err) { res.status(500).json({ success: false }); }
});

// GET /api/kyc/mps (list)
router.get('/mps', async (req, res) => {
  try {
    const data = await getMPData();
    // Merge scraped and mock keys to present a complete, rich list
    let keys = Object.keys(data);
    try {
      const mockPath = path.join(__dirname, '../data/mockCandidates.json');
      const mockRaw = fs.readFileSync(mockPath);
      const mockData = JSON.parse(mockRaw);
      keys = Array.from(new Set([...keys, ...Object.keys(mockData)]));
    } catch (mockErr) {}
    res.json({ success: true, constituencies: keys.sort() });
  } catch (err) { res.status(500).json({ success: false }); }
});

// GET /api/kyc/mlas/:constituency
router.get('/mlas/:constituency', async (req, res) => {
  try {
    const data = await getMLAData();
    const constituency = req.params.constituency;
    
    // Case-insensitive lookup with Mysore/Mysuru alias support
    const matchKey = Object.keys(data).find(k => {
      const kl = k.toLowerCase();
      const cl = constituency.toLowerCase();
      if (kl === cl) return true;
      if ((kl === 'mysore' || kl === 'mysuru') && (cl === 'mysore' || cl === 'mysuru')) return true;
      return false;
    });
    
    if (matchKey && data[matchKey]) {
      res.json({ success: true, candidates: data[matchKey] });
    } else {
      // Fallback search in mock data (e.g. for Mysore/Mysuru MLAs)
      try {
        const mockPath = path.join(__dirname, '../data/mockMLAs.json');
        const mockRaw = fs.readFileSync(mockPath);
        const mockData = JSON.parse(mockRaw);
        const mockKey = Object.keys(mockData).find(k => {
          const kl = k.toLowerCase();
          const cl = constituency.toLowerCase();
          if (kl === cl) return true;
          if ((kl === 'mysore' || kl === 'mysuru') && (cl === 'mysore' || cl === 'mysuru')) return true;
          return false;
        });
        if (mockKey && mockData[mockKey]) {
          return res.json({ success: true, candidates: mockData[mockKey] });
        }
      } catch (mockErr) {
        console.error('Mock MLA fallback search failed:', mockErr);
      }
      res.status(404).json({ success: false, message: 'Not found' });
    }
  } catch (err) { res.status(500).json({ success: false }); }
});

// GET /api/kyc/mlas (list)
router.get('/mlas', async (req, res) => {
  try {
    const data = await getMLAData();
    // Merge scraped and mock keys to present a complete, rich list
    let keys = Object.keys(data);
    try {
      const mockPath = path.join(__dirname, '../data/mockMLAs.json');
      const mockRaw = fs.readFileSync(mockPath);
      const mockData = JSON.parse(mockRaw);
      keys = Array.from(new Set([...keys, ...Object.keys(mockData)]));
    } catch (mockErr) {}
    res.json({ success: true, constituencies: keys.sort() });
  } catch (err) { res.status(500).json({ success: false }); }
});

// Backward compatibility for old /api/kyc/:constituency
router.get('/:constituency', async (req, res) => {
  const data = await getMPData();
  const constituency = req.params.constituency;
  if (data[constituency]) {
    res.json({ success: true, candidates: data[constituency], constituency });
  } else {
    res.status(404).json({ success: false });
  }
});

router.get('/', async (req, res) => {
  const data = await getMPData();
  res.json({ success: true, constituencies: Object.keys(data).sort() });
});

module.exports = router;
