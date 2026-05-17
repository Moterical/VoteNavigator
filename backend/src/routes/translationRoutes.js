const express = require('express');
const router = express.Router();
const { translateObject } = require('../services/translationService');

// POST /api/translate
router.post('/', async (req, res) => {
  try {
    const { content, targetLang } = req.body;
    
    if (!content || !targetLang) {
      return res.status(400).json({ success: false, message: 'Missing content or targetLang' });
    }

    const translated = await translateObject(content, targetLang);
    
    res.json({
      success: true,
      translated
    });
  } catch (error) {
    console.error('Translation route error:', error);
    res.status(500).json({ success: false, message: 'Translation failed' });
  }
});

module.exports = router;
