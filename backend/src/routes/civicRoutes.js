const express = require('express');
const router = express.Router();
const civicService = require('../services/civicService');

// GET /api/civic/representative/:constituencyId
router.get('/representative/:constituencyId', (req, res) => {
  const { constituencyId } = req.params;
  const result = civicService.getRepresentative(constituencyId);
  res.json(result);
});

// POST /api/civic/draft-complaint
router.post('/draft-complaint', async (req, res) => {
  const { issueDescription, repName, areaName, evidenceType } = req.body;
  
  if (!issueDescription || !repName || !areaName) {
    return res.status(400).json({ success: false, message: "Missing required fields." });
  }

  const result = await civicService.generateComplaintDraft(issueDescription, repName, areaName, evidenceType);
  res.json(result);
});

module.exports = router;
