const express = require('express');
const path = require('path');

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

// POST /pair — validate number, generate pairing code, return JSON
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

        // Purani jagah par yeh code replace karo

let code;

// Check if bot exists
if (!waSocket) {
    return res.status(503).json({
        success: false,
        error: 'WhatsApp bot is not initialized. Please wait and try again.'
    });
}

// Check if already registered
if (waSocket.authState.creds.registered) {
    return res.status(400).json({
        success: false,
        error: 'Bot is already registered with a WhatsApp account. Cannot generate new pairing code.'
    });
}

// Generate REAL pairing code
try {
    code = await waSocket.requestPairingCode(phoneNumber, "EMPEROR1");
    
    // Validate code
    if (!code || code.length !== 8) {
        throw new Error('Invalid pairing code received from WhatsApp');
    }
    
    // Persist in memory
    pairingStore.set(phoneNumber, { code, generatedAt: Date.now() });
    
    return res.json({
        success: true,
        code,
        phoneNumber,
        message: 'Valid WhatsApp pairing code generated! Enter it in WhatsApp → Linked Devices within 60 seconds.'
    });
    
} catch (baileyErr) {
    console.error('[web-server] Baileys requestPairingCode error:', baileyErr);
    
    // IMPORTANT: Random code MAT generate karo
    return res.status(500).json({
        success: false,
        error: `Failed to generate WhatsApp pairing code: ${baileyErr.message}. Make sure WhatsApp is connected and phone number is correct.`
    });
}

    } catch (err) {
        console.error('[web-server] Error in /pair:', err);
        return res.status(500).json({
            success: false,
            error: 'Failed to generate pairing code. Please try again.'
        });
    }
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
                error: 'Invalid format. Please enter a Pakistani number starting with 92 followed by 10 digits (e.g. 923001234567).'
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

        const code = await waSocket.requestPairingCode(cleaned, "EMPEROR1");
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

