const express = require('express');
const router = express.Router();
const { getChatResponse } = require('../services/geminiService');
const db = require('../config/db');

// POST /api/chat
// Main AI chat endpoint
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // 1. Simple Keyword Search in DB for context (Naive RAG)
    const keywords = message.split(' ').filter(w => w.length > 3);
    let contextRows = [];

    if (keywords.length > 0) {
      const dbQuery = `
        SELECT title as item_title, full_explanation as content FROM knowledge_base 
        WHERE title ILIKE ANY($1) OR abbreviation ILIKE ANY($1)
        UNION
        SELECT question as item_title, answer as content FROM faqs
        WHERE question ILIKE ANY($1)
        LIMIT 3
      `;
      const searchPattern = keywords.map(k => `%${k}%`);
      const dbResult = await db.query(dbQuery, [searchPattern]);
      contextRows = dbResult.rows.map(r => ({ title: r.item_title, full_explanation: r.content }));
    }

    // 2. Get AI Response from service
    const aiResponse = await getChatResponse(message, contextRows);

    // 3. Return response
    res.json({
      message: aiResponse,
      contextUsed: contextRows.length > 0 ? contextRows.map(r => r.title) : [],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Something went wrong with the AI assistant. Please try again later.' });
  }
});

module.exports = router;
