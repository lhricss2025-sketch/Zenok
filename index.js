console.clear();
console.log('Starting...');
require('./settings/config');

const { 
    default: makeWASocket, 
    prepareWAMessageMedia, 
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion, 
    makeInMemoryStore,  
    generateWAMessageFromContent, 
    generateWAMessageContent, 
    jidDecode,  
    proto, 
    relayWAMessage, 
    getContentType, 
    getAggregateVotesInPollMessage, 
    downloadContentFromMessage, 
    fetchLatestWaWebVersion, 
    InteractiveMessage, 
    makeCacheableSignalKeyStore, 
    Browsers, 
    generateForwardMessageContent, 
    MessageRetryMap 
} = require("@whiskeysockets/baileys");

const pino = require('pino');
const fs = require('fs');
const { Boom } = require('@hapi/boom');
const { color } = require('./lib/color.js');
const { smsg, sendGmail, formatSize, isUrl, generateMessageTag, getBuffer, getSizeMedia, runtime, fetchJson, sleep } = require('./lib/myfunction.js');
const chalk = require('chalk')
const usePairingCode = true;

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) });

async function cryptolordstart() {
	const {
		state,
		saveCreds
	} = await useMultiFileAuthState("session")
	const newbase = makeWASocket({
		printQRInTerminal: !usePairingCode,
		syncFullHistory: true,
		markOnlineOnConnect: true,
		connectTimeoutMs: 60000,
		defaultQueryTimeoutMs: 0,
		keepAliveIntervalMs: 10000,
		generateHighQualityLinkPreview: true,
		patchMessageBeforeSending: (message) => {
			const requiresPatch = !!(
				message.buttonsMessage ||
				message.templateMessage ||
				message.listMessage
			);
			if (requiresPatch) {
				message = {
					viewOnceMessage: {
						message: {
							messageContextInfo: {
								deviceListMetadataVersion: 2,
								deviceListMetadata: {},
							},
							...message,
						},
					},
				};
			}
			return message;
		},
	    version: (await (await fetch('https://raw.githubusercontent.com/kiuur/bails/refs/heads/master/lib/Defaults/baileys-version.json')).json()).version,
		browser: ["Ubuntu", "Chrome", "20.0.04"],
		logger: pino({
			level: 'fatal'
		}),
		auth: {
			creds: state.creds,
			keys: makeCacheableSignalKeyStore(state.keys, pino().child({
				level: 'silent',
				stream: 'store'
			})),
		}
	});

    // Expose the bot instance to server.js via global so the web API can call
    // requestPairingCode() on demand instead of prompting via CLI.
    global.botInstance = newbase;

    if (usePairingCode && !newbase.authState.creds.registered) {
        console.log(chalk.cyan.bold('[bot] Session not registered — visit the web UI to generate a pairing code.'));
    }

    store.bind(newbase.ev);
    newbase.ev.on("messages.upsert", async (chatUpdate, msg) => {
        try {
            const mek = chatUpdate.messages[0]
            if (!mek.message) return
            mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
            if (mek.key && mek.key.remoteJid === 'status@broadcast') return
            if (!newbase.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
            if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
            if (mek.key.id.startsWith('FatihArridho_')) return;
            const m = smsg(newbase, mek, store)
            require("./zenok.js")(newbase, m, chatUpdate, store)
        } catch (err) {
            console.log(err)
        }
    });

    newbase.decodeJid = (jid) => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {};
            return decode.user && decode.server && decode.user + '@' + decode.server || jid;
        } else return jid;
    };

    newbase.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = newbase.decodeJid(contact.id);
            if (store && store.contacts) store.contacts[id] = { id, name: contact.notify };
        }
    });

    // DO NOT CHANGE THIS, AT LEAST ADD YOUR OWN CHANNEL ID
    global.idch = "120363397001088335@s.whatsapp.net"
    global.idch1 = "120363420068670766@newsletter"
    global.idch2 = "120363387298816683@newsletter"
    global.idch3 = "120363390274692764@newsletter"
    global.idch4 = "120363364795821877@newsletter"

    newbase.public = global.status;

    newbase.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            global.connectionStatus = 'disconnected';
            const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
            console.log(color(lastDisconnect.error, 'deeppink'));
            if (lastDisconnect.error == '') {
                process.exit();
            } else if (reason === DisconnectReason.badSession) {
                console.log(color(`Bad Session File, Please Delete Session and Scan Again`));
                process.exit();
            } else if (reason === DisconnectReason.connectionClosed) {
                console.log(color('[SYSTEM]', 'white'), color('Connection closed, reconnecting...', 'deeppink'));
                process.exit();
            } else if (reason === DisconnectReason.connectionLost) {
                console.log(color('[SYSTEM]', 'white'), color('Connection lost, trying to reconnect', 'deeppink'));
                process.exit();
            } else if (reason === DisconnectReason.connectionReplaced) {
                console.log(color('Connection Replaced, Another New Session Opened, Please Close Current Session First'));
                newbase.logout();
            } else if (reason === DisconnectReason.loggedOut) {
                console.log(color(`Device Logged Out, Please Scan Again And Run.`));
                newbase.logout();
            } else if (reason === DisconnectReason.restartRequired) {
                console.log(color('Restart Required, Restarting...'));
                await cryptolordstart();
            } else if (reason === DisconnectReason.timedOut) {
                console.log(color('Connection TimedOut, Reconnecting...'));
                cryptolordstart();
            }
        } else if (connection === "connecting") {
            global.connectionStatus = 'connecting';
            console.log(color('Connecting . . . '));
        } else if (connection === "open") {
            global.connectionStatus = 'connected';
            newbase.newsletterFollow(global.idch)
            newbase.newsletterFollow(global.idch1)
            newbase.newsletterFollow(global.idch2)
            newbase.newsletterFollow(global.idch3)
            newbase.newsletterFollow(global.idch4)
            console.log(chalk.green.bold('EMPEROR IS ACTIVE'));
        }
    });

    newbase.sendText = (jid, text, quoted = '', options) => newbase.sendMessage(jid, { text: text, ...options }, { quoted });
    
    newbase.downloadMediaMessage = async (message) => {
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(message, messageType)
        let buffer = Buffer.from([])
        for await(const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        return buffer
    } 
    
    newbase.ev.on('creds.update', saveCreds);
    return newbase;
}

cryptolordstart();

let file = require.resolve(__filename);
require('fs').watchFile(file, () => {
    require('fs').unwatchFile(file);
    console.log('\x1b[0;32m' + __filename + ' \x1b[1;32mupdated!\x1b[0m');
    delete require.cache[file];
    require(file);
});