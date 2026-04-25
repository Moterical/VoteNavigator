const express = require('express');
const router = express.Router();

// GET /api/content/faq
router.get('/faq', async (req, res) => {
  // TODO: Fetch from Cloud SQL
  res.json({ faqs: [] });
});

// GET /api/content/glossary
router.get('/glossary', async (req, res) => {
  // TODO: Fetch from Cloud SQL
  res.json({ terms: [] });
});

// GET /api/content/guide/:formType
router.get('/guide/:formType', async (req, res) => {
  const { formType } = req.params;
  // TODO: Fetch from Cloud SQL
  res.json({ formType, steps: [] });
});

// GET /api/content/rights
router.get('/rights', async (req, res) => {
  // TODO: Fetch from Cloud SQL
  res.json({ rights: [] });
});

module.exports = router;
