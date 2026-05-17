const express = require('express');
const router = express.Router();
const voterService = require('../services/voterService');

// GET /api/booth/districts - Get all available districts
router.get('/districts', (req, res) => {
  const result = voterService.getDistricts();
  res.json(result);
});

// GET /api/booth/constituencies/:districtId - Get constituencies for a district
router.get('/constituencies/:districtId', (req, res) => {
  const { districtId } = req.params;
  const result = voterService.getConstituencies(districtId);
  res.json(result);
});

// GET /api/booth/list/:constituencyId - Get booths for a constituency
router.get('/list/:constituencyId', (req, res) => {
  const { constituencyId } = req.params;
  const result = voterService.getBooths(constituencyId);
  res.json(result);
});

module.exports = router;
