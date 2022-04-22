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

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
	new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
    new SlashCommandBuilder().setName('yourmom').setDescription('Something about your mom'),
];

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(TOKEN);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(CLIENTID, GUILDID),
			{ body: commands },
		);

        await rest.put(
			Routes.applicationGuildCommands(CLIENTID, MIDTOWNID),
			{ body: commands },
		);

        await rest.put(
			Routes.applicationGuildCommands(CLIENTID, KSLID),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();