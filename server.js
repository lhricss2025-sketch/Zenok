'use strict';

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Bot state shared with index.js ────────────────────────────────────────────
// index.js writes to global.botInstance and global.connectionStatus so this
// server can read them without a circular dependency.
global.botInstance = null;
global.connectionStatus = 'disconnected'; // 'connecting' | 'connected' | 'disconnected'

// ── Routes ────────────────────────────────────────────────────────────────────

/**
 * GET /api/connection-status
 * Returns the current WhatsApp connection state.
 */
app.get('/api/connection-status', (req, res) => {
  res.json({ status: global.connectionStatus });
});

/**
 * POST /api/request-pairing-code
 * Body: { phoneNumber: "92XXXXXXXXXX" }
 * Calls newbase.requestPairingCode() and returns the 8-character code.
 */
app.post('/api/request-pairing-code', async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber || !/^92\d{10}$/.test(phoneNumber)) {
    return res.status(400).json({
      error: 'Invalid phone number. Use format 92XXXXXXXXXX (92 + 10 digits).'
    });
  }

  if (!global.botInstance) {
    return res.status(503).json({
      error: 'Bot is not ready yet. Please wait a moment and try again.'
    });
  }

  if (global.botInstance.authState?.creds?.registered) {
    return res.status(400).json({
      error: 'This session is already registered. No pairing code needed.'
    });
  }

  try {
    const code = await global.botInstance.requestPairingCode(phoneNumber, 'EMPEROR1');
    console.log(`[server] Pairing code generated for ${phoneNumber}: ${code}`);
    res.json({ code });
  } catch (err) {
    console.error('[server] requestPairingCode error:', err);
    res.status(500).json({
      error: err.message || 'Failed to generate pairing code. Please try again.'
    });
  }
});

// ── Serve index.html for any unmatched route (SPA fallback) ───────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Start server then boot the bot ────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[server] Web UI running on http://0.0.0.0:${PORT}`);
  // Boot the bot after the HTTP server is up
  require('./index.js');
});
