const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/election/schedule/:state
router.get('/schedule/:state', async (req, res) => {
  try {
    const { state } = req.params;
    const result = await db.query(
      'SELECT * FROM election_events WHERE state ILIKE $1 AND is_active = true ORDER BY polling_date ASC',
      [state]
    );
    res.json({ state, schedule: result.rows });
  } catch (error) {
    console.error('Election schedule error:', error);
    res.status(500).json({ error: 'Failed to fetch election schedule' });
  }
});

// GET /api/election/phases
router.get('/phases', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT phase_number, polling_date, ARRAY_AGG(state) as states FROM election_events WHERE is_active = true GROUP BY phase_number, polling_date ORDER BY phase_number ASC'
    );
    res.json({ phases: result.rows });
  } catch (error) {
    console.error('Election phases error:', error);
    res.status(500).json({ error: 'Failed to fetch election phases' });
  }
});

module.exports = router;
