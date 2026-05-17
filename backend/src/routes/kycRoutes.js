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
    return {}; // Empty if no fallback
  }
}

// GET /api/kyc/mps/:constituency
router.get('/mps/:constituency', async (req, res) => {
  try {
    const data = await getMPData();
    const constituency = req.params.constituency;
    if (data[constituency]) {
      res.json({ success: true, candidates: data[constituency] });
    } else {
      res.status(404).json({ success: false, message: 'Not found' });
    }
  } catch (err) { res.status(500).json({ success: false }); }
});

// GET /api/kyc/mps (list)
router.get('/mps', async (req, res) => {
  try {
    const data = await getMPData();
    res.json({ success: true, constituencies: Object.keys(data).sort() });
  } catch (err) { res.status(500).json({ success: false }); }
});

// GET /api/kyc/mlas/:constituency
router.get('/mlas/:constituency', async (req, res) => {
  try {
    const data = await getMLAData();
    const constituency = req.params.constituency;
    if (data[constituency]) {
      res.json({ success: true, candidates: data[constituency] });
    } else {
      res.status(404).json({ success: false, message: 'Not found' });
    }
  } catch (err) { res.status(500).json({ success: false }); }
});

// GET /api/kyc/mlas (list)
router.get('/mlas', async (req, res) => {
  try {
    const data = await getMLAData();
    res.json({ success: true, constituencies: Object.keys(data).sort() });
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
