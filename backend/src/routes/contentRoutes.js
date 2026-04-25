const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/content/faqs?category=...
router.get('/faqs', async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM faqs WHERE is_active = true';
    let params = [];

    if (category) {
      query += ' AND category = $1';
      params.push(category);
    }

    query += ' ORDER BY id ASC';
    const result = await db.query(query, params);
    res.json({ faqs: result.rows });
  } catch (error) {
    console.error('FAQ error:', error);
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

// GET /api/content/knowledge?category=...
router.get('/knowledge', async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM knowledge_base';
    let params = [];

    if (category) {
      query += ' WHERE category = $1';
      params.push(category);
    }

    query += ' ORDER BY title ASC';
    const result = await db.query(query, params);
    res.json({ items: result.rows, category: category || 'all' });
  } catch (error) {
    console.error('Knowledge Base error:', error);
    res.status(500).json({ error: 'Failed to fetch knowledge base' });
  }
});

// GET /api/content/guide/:formType
router.get('/guide/:formType', async (req, res) => {
  try {
    const { formType } = req.params;
    const result = await db.query(
      'SELECT * FROM forms_guide WHERE form_type = $1 ORDER BY step_number ASC',
      [formType.toUpperCase()]
    );
    res.json({ formType, steps: result.rows });
  } catch (error) {
    console.error('Guide error:', error);
    res.status(500).json({ error: 'Failed to fetch form guide' });
  }
});

// GET /api/content/documents
router.get('/documents', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM accepted_documents ORDER BY display_order ASC');
    res.json({ documents: result.rows });
  } catch (error) {
    console.error('Documents error:', error);
    res.status(500).json({ error: 'Failed to fetch accepted documents' });
  }
});

module.exports = router;
