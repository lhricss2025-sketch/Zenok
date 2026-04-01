const express = require('express');
const path = require('path');

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Holds the Baileys socket instance once the bot connects
let waSocket = null;

/**
 * Called from index.js once the socket is ready so this server
 * can forward pairing-code requests to it.
 */
function setSocket(sock) {
    waSocket = sock;
}

// GET / — serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// POST /generate-code — validate number and request a pairing code
app.post('/generate-code', async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({
                success: false,
                error: 'Phone number is required.'
            });
        }

        // Accept numbers that start with 92 followed by 9 more digits (total 11 digits)
        const cleaned = String(phoneNumber).trim().replace(/\s+/g, '');
        if (!/^92\d{9}$/.test(cleaned)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid format. Please enter a Pakistani number starting with 92 followed by 9 digits (e.g. 923001234567).'
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

        return res.json({
            success: true,
            code: code,
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
