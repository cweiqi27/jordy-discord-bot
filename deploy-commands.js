const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENTID = process.env.CLIENT_ID;
const GUILDID = process.env.GUILD_ID;
const MIDTOWNID = process.env.MIDTOWN_ID;
const KSLID = process.env.KSL_ID;

const fs = require('node:fs');
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(TOKEN);

rest.put(Routes.applicationGuildCommands(CLIENTID, GUILDID), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

rest.put(Routes.applicationGuildCommands(CLIENTID, MIDTOWNID), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);

rest.put(Routes.applicationGuildCommands(CLIENTID, KSLID), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);