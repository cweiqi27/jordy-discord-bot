const fs = require('node:fs');
const { Client, Intents, Collection } = require('discord.js');
const { Player } = require('discord-player');

require('dotenv').config();
const TOKEN = process.env.DISCORD_TOKEN;

const intentsList = new Intents();
intentsList.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, 
    Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES);

const client = new Client({
    intents: intentsList
});


client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}


//COMMANDS
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) interaction.reply("Invalid command");

	try {
		await command.execute({interaction});
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

//EVENTS
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

//STREAM MUSIC
// const ytdl = require('ytdl-core');
// const {
// 	AudioPlayerStatus,
// 	StreamType,
// 	createAudioPlayer,
// 	createAudioResource,
// 	joinVoiceChannel,
// } = require('@discordjs/voice');

// const connection = joinVoiceChannel({
// 	channelId: voiceChannel.id,
// 	guildId: guild.id,
// 	adapterCreator: guild.voiceAdapterCreator,
// });

// const stream = ytdl('youtube link', { filter: 'audioonly' });
// const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
// const player = createAudioPlayer();

// player.play(resource);
// connection.subscribe(player);

// player.on(AudioPlayerStatus.Idle, () => connection.destroy());

client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})



client.login(TOKEN);