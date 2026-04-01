const express = require('express');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Holds the Baileys socket instance once the bot connects
let waSocket = null;

// In-memory store for recently generated pairing codes
// Map<phoneNumber, { code, generatedAt }>
const pairingStore = new Map();

// Purge entries older than 5 minutes every minute
setInterval(() => {
    const cutoff = Date.now() - 5 * 60 * 1000;
    for (const [key, val] of pairingStore.entries()) {
        if (val.generatedAt < cutoff) pairingStore.delete(key);
    }
}, 60 * 1000);

/**
 * Called from index.js once the socket is ready so this server
 * can forward pairing-code requests to it.
 */
function setSocket(sock) {
    waSocket = sock;
}

/**
 * Validate a Pakistani phone number.
 * Must start with 92 and be exactly 12 digits total.
 */
function validatePakistaniNumber(raw) {
    const cleaned = String(raw).trim().replace(/[\s\-().+]/g, '');
    if (!/^92\d{10}$/.test(cleaned)) return null;
    return cleaned;
}

// GET / — serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// GET /success — serve the success page
app.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'success.html'));
});

// POST /pair — validate number, request a REAL pairing code from Baileys, return JSON
app.post('/pair', async (req, res) => {
    try {
        const raw = req.body.phoneNumber || req.body.phone_number || '';

        if (!raw) {
            return res.status(400).json({
                success: false,
                error: 'Phone number is required.'
            });
        }

        const phoneNumber = validatePakistaniNumber(raw);
        if (!phoneNumber) {
            return res.status(400).json({
                success: false,
                error: 'Invalid format. Enter a Pakistani number starting with 92 followed by 10 digits (e.g. 923001234567).'
            });
        }

        // Reject immediately if the bot socket is not yet available
        if (!waSocket) {
            console.warn('[web-server] /pair called but waSocket is not ready yet.');
            return res.status(503).json({
                success: false,
                error: 'Bot is still starting up. Please wait a few seconds and try again.'
            });
        }

        // Reject if this session is already linked — a pairing code would be meaningless
        if (waSocket.authState.creds.registered) {
            console.warn('[web-server] /pair called but session is already registered.');
            return res.status(400).json({
                success: false,
                error: 'This bot session is already linked to a WhatsApp account.'
            });
        }

        // Always request a real code from Baileys — never fall back to a random one
        let code;
        try {
            console.log(`[web-server] Requesting pairing code for ${phoneNumber} …`);
            code = await waSocket.requestPairingCode(phoneNumber);
            console.log(`[web-server] Pairing code received for ${phoneNumber}: ${code}`);
        } catch (baileyErr) {
            console.error('[web-server] Baileys requestPairingCode error:', baileyErr);
            return res.status(500).json({
                success: false,
                error: 'WhatsApp rejected the pairing request. Make sure the number is registered on WhatsApp and try again.'
            });
        }

        // Persist in memory so /verify can check it later
        pairingStore.set(phoneNumber, { code, generatedAt: Date.now() });

        return res.json({
            success: true,
            code,
            phoneNumber,
            message: 'Pairing code generated! Enter it in WhatsApp → Linked Devices within 60 seconds.'
        });

    } catch (err) {
        console.error('[web-server] Error in /pair:', err);
        return res.status(500).json({
            success: false,
            error: 'Failed to generate pairing code. Please try again.'
        });
    }
});

// GET /verify — check whether the bot session is now fully registered/connected
app.get('/verify', (req, res) => {
    const connected = !!(waSocket && waSocket.authState.creds.registered);
    return res.json({
        success: true,
        connected,
        message: connected
            ? 'Bot is connected and the session is active.'
            : 'Bot is not yet connected or the session is not registered.'
    });
});

// POST /generate-code — legacy alias kept for backwards compatibility
app.post('/generate-code', async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({ success: false, error: 'Phone number is required.' });
        }

        const cleaned = validatePakistaniNumber(phoneNumber);
        if (!cleaned) {
            return res.status(400).json({
                success: false,
                error: 'Invalid format. Please enter a Pakistani number starting with 92 followed by 10 digits (e.g. 9230012345678).'
            });
        }

        if (!waSocket) {
            return res.status(503).json({
                success: false,
                error: 'Bot is not connected yet. Please wait a moment and try again.'
            });
        }

        if (waSocket.authState.creds.registered) {
            return res.status(400).json({
                success: false,
                error: 'This bot session is already linked to a WhatsApp account.'
            });
        }

        const code = await waSocket.requestPairingCode(cleaned);
        pairingStore.set(cleaned, { code, generatedAt: Date.now() });

        return res.json({
            success: true,
            code,
            phoneNumber: cleaned,
            message: 'Pairing code generated successfully! Enter it in WhatsApp within 60 seconds.'
        });

    } catch (err) {
        console.error('[web-server] Error generating pairing code:', err);
        return res.status(500).json({
            success: false,
            error: 'Failed to generate pairing code. Please try again.'
        });
    }
});

function startWebServer() {
    app.listen(PORT, () => {
        console.log(`[web-server] Running at http://localhost:${PORT}`);
    });
}

module.exports = { startWebServer, setSocket };

