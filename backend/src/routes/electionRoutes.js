const express = require('express');
const router = express.Router();

// GET /api/election/schedule/:state
router.get('/schedule/:state', async (req, res) => {
  const { state } = req.params;
  // TODO: Fetch from Cloud SQL
  res.json({ state, phases: [] });
});

// GET /api/election/phases
router.get('/phases', async (req, res) => {
  // TODO: Fetch all phases from Cloud SQL
  res.json({ phases: [] });
});

module.exports = router;
