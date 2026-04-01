const fs = require('fs')

//settings bot
global.connect = true
global.Bot_Name = "EMPEROR BUG BOT"
global.owner = "2347049474372"
global.Version = "𝟭.𝟬.𝟬"
global.Developer = "EMPEROR"
global.status = true
global.prefix = ["", "!", ".", ",", "🐤", "🗿"]; // Do Not Change!!

// Settings Event
global.welcome = true
global.antispam = true
global.autoread = true
global.owneroff = true

// Message
global.mess = {
    owner: "\`[ # 𝘿𝙀𝙉𝙄𝙀𝘿 𝘼𝘾𝘾𝙀𝙎𝙎 ]\` 𝙊𝙣𝙡𝙮 𝙛𝙤𝙧 𝙈𝙮 𝙊𝙬𝙣𝙚𝙧",
    group: "\`[ # 𝘿𝙀𝙉𝙄𝙀𝘿 𝘼𝘾𝘾𝙀𝙎𝙎 ]\` 𝙐𝙨𝙚𝙙 𝙞𝙣 𝙂𝙧𝙤𝙪𝙥 𝘾𝙝𝙖𝙩 𝙊𝙣𝙡𝙮",
    private: "\`[ # 𝘿𝙀𝙉𝙄𝙀𝘿 𝘼𝘾𝘾𝙀𝙎𝙎 ]\` 𝙋𝙧𝙞𝙫𝙖𝙩𝙚 𝘾𝙝𝙖𝙩 𝙊𝙣𝙡𝙮",
    success: "\`[ # 𝙑𝙀𝙍𝙄𝙁𝙄𝙀𝘿 𝙎𝙐𝘾𝘾𝙀𝙎𝙎𝙁𝙐𝙇 ✔ ]\`",
    premium: "\`[ # 𝘿𝙀𝙉𝙄𝙀𝘿 𝘼𝘾𝘾𝙀𝙎𝙎 ]\` 𝙁𝙤𝙧 𝙋𝙧𝙚𝙢𝙞𝙪𝙢 𝙐𝙨𝙚𝙧𝙨 𝙊𝙣𝙡𝙮",
    admin: "\`[ # 𝘿𝙀𝙉𝙄𝙀𝘿 𝘼𝘾𝘾𝙀𝙎𝙎 ]\` 𝙊𝙣𝙡𝙮 𝙛𝙤𝙧 𝙂𝙧𝙤𝙪𝙥 𝘼𝙙𝙢𝙞𝙣",
    botadmin: "\`[ # 𝘿𝙀𝙉𝙄𝙀𝘿 𝘼𝘾𝘾𝙀𝙎𝙎 ]\` 𝘽𝙤𝙩 𝙈𝙪𝙨𝙩 𝙗𝙚 𝘼𝙙𝙢𝙞𝙣 𝙝𝙚𝙧𝙚",
}

// Sticker name
global.packname = 'EMPEROR BUG BOT'
// Settings end here 

let file = require.resolve(__filename)
require('fs').watchFile(file, () => {
  require('fs').unwatchFile(file)
  console.log('\x1b[0;32m'+__filename+' \x1b[1;32mupdated!\x1b[0m')
  delete require.cache[file]
  require(file)
})
