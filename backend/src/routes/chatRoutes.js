const express = require('express');
const router = express.Router();

// POST /api/chat
// Main conversational endpoint — handled by Gemini + flow engine
router.post('/', async (req, res) => {
  try {
    const { message, sessionContext, language } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // TODO: Integrate Gemini service + intent detection
    res.json({
      reply: `Echo: ${message}`,
      intent: 'unknown',
      source: null,
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

module.exports = router;
