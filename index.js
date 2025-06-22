// Load packages
const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const bodyParser = require('body-parser');

// Load environment variables
const BOT_TOKEN = process.env.BOT_TOKEN;
const GUILD_ID = process.env.GUILD_ID;

// Check for required variables
if (!BOT_TOKEN || !GUILD_ID) {
  console.error("❌ BOT_TOKEN and/or GUILD_ID are missing in environment variables.");
  process.exit(1);
}

// Set up Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates
  ]
});

// Set up Express app
const app = express();
app.use(bodyParser.json());

// Example Roblox-to-Discord user mapping (replace with real system or database)
const robloxToDiscord = {
  "LanceDainiel123": "lancesfp",
  "meijikko": "viancaloveskisshia"
  "lenieyel": "lenie_yel",
  "jongwon447": "ivangino__94395"
  "abrielqt": "itzmekennethcanaynay24",
  "sorbet_moonrabbit": "maxwellisinthehouse_03221"
  "JhiroMalabanaa": "jjiru_.",
  "cboyxzz": "cboyxzz._80287"
  "Rex118898": "rey880050",
  "cherryblossomon_top": "hana090942"
  "jggjkgkgkgkg": "jggjkgkgkgkg",
  "soa_zja": "ashleng0882"
  "hbt_zoro": "ramen.fxdd",
  "nhiell_5": "Cadena626273"
  "shuveeeishereyall": "maxwellisinthehouse_03221"
};

// Move user to requested voice channel
app.post('/move-discord', async (req, res) => {
  const { robloxUsername, channelId } = req.body;

  if (!robloxUsername || !channelId) {
    return res.status(400).send('robloxUsername and channelId are required.');
  }

  const discordTag = robloxToDiscord[robloxUsername];
  if (!discordTag) {
    return res.status(404).send('Roblox user is not linked to a Discord user.');
  }

  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    const members = await guild.members.fetch();
    const member = members.find(m => m.user.tag === discordTag);

    if (!member) return res.status(404).send('Discord user not found.');
    if (!member.voice.channel) return res.status(400).send('User is not in a voice channel.');

    await member.voice.setChannel(channelId);
    console.log(`✅ Moved ${member.user.tag} to channel ${channelId}`);
    res.send('User moved.');
  } catch (error) {
    console.error('❌ Error moving user:', error);
    res.status(500).send('Failed to move user.');
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT}`);
});

// Login bot
client.login(BOT_TOKEN).then(() => {
  console.log("🤖 Discord bot logged in successfully.");
}).catch(err => {
  console.error("❌ Invalid bot token:", err);
});