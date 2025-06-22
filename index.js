const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers
  ]
});

const BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE';
const GUILD_ID = 'YOUR_DISCORD_SERVER_ID';
const TARGET_CHANNEL_ID = 'CONFESSION_ROOM_CHANNEL_ID'; // where to move them

client.once('ready', () => {
  console.log(`Bot is ready!`);
});

app.post('/move-discord', async (req, res) => {
  const robloxUsername = req.body.robloxUsername;
  const discordTag = robloxToDiscord[robloxUsername]; // lookup

  if (!discordTag) {
    return res.status(400).send('User not linked.');
  }

  const guild = await client.guilds.fetch(GUILD_ID);
  const members = await guild.members.fetch();

  const member = members.find(m => m.user.tag === discordTag);

  if (!member) return res.status(404).send('Discord user not found');
  if (!member.voice.channel) return res.status(400).send('User not in VC');

  member.voice.setChannel(TARGET_CHANNEL_ID)
    .then(() => res.send('Moved'))
    .catch(err => {
      console.error(err);
      res.status(500).send('Failed to move user');
    });
});

// Example mapping: Replace this with real linking logic or DB
const robloxToDiscord = {
  "RobloxUser1": "DiscordUser#1234",
  "RobloxUser2": "TestUser#5678"
};

client.login(BOT_TOKEN);
app.listen(3000, () => console.log('Server running on port 3000'));