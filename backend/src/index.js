const express = require('express');
const cors = require('cors');
require('dotenv').config({ override: true });

const chatRoutes = require('./routes/chatRoutes');
const contentRoutes = require('./routes/contentRoutes');
const electionRoutes = require('./routes/electionRoutes');
const kycRoutes = require('./routes/kycRoutes');
const translationRoutes = require('./routes/translationRoutes');
const boothRoutes = require('./routes/boothRoutes');
const civicRoutes = require('./routes/civicRoutes');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'VoteNavigator API' });
});

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/election', electionRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/translate', translationRoutes);
app.use('/api/booth', boothRoutes);
app.use('/api/civic', civicRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
});

app.listen(PORT, () => {
  console.log(`VoteNavigator API running on port ${PORT}`);
});

module.exports = app;
