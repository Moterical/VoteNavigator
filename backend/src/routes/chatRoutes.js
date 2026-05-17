const express = require('express');
const router = express.Router();
const { getChatResponse } = require('../services/aiService');
const db = require('../config/db');

// POST /api/chat
// Main AI chat endpoint
router.post('/', async (req, res) => {
  // Debug: Check if env is loaded
  if (!process.env.GROQ_API_KEY) {
    console.error('ERROR: GROQ_API_KEY is undefined. Env loading failed.');
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // 1. Simple Keyword Search in DB for context (Bypassed for now)
    let contextRows = [];
    /*
    const keywords = message.split(' ').filter(w => w.length > 3);
    if (keywords.length > 0) {
      try {
        const dbQuery = `...`;
        ...
      } catch (dbError) { ... }
    }
    */

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
