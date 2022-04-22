const { Client, Intents } = require('discord.js');
require('dotenv').config();

const TOKEN = process.env.DISCORD_TOKEN;

const intentsList = new Intents();
intentsList.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, 
    Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES);

const client = new Client({
    intents: intentsList
});

client.once('ready', () => {
	console.log('Ready!');
});

client.login(TOKEN);