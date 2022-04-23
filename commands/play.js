const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Client } = require('discord.js');
const { QueryType } = require('discord-player');

// const { VoiceChannel } = require('discord.js');
// const { Player } = require('discord-player');
// const player = new Player();
// BUGS TO FIX

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play music from youtube")
        .addSubcommand((subcommand) => 
            subcommand
                .setName("song")
                .setDescription("Play the song from the link/URL")
                .addStringOption((option) => option.setName("url").setDescription("song url").setRequired(true))
        ),
        execute: async ({ client, interaction }) => {
            if(!interaction.member.voice.channel) {
                return interaction.editReply("You need to be in a voice channel")
            }

            const queue = await client.player.createQueue(interaction.guild)
            if(!queue.connection) await queue.connect(interaction.member.voice.channel)

            let embed = new MessageEmbed();

            if(interaction.option.getSubCommand() === "song") {
                let url = interaction.option.getString("url")
                const result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_VIDEO
                })
                if(result.tracks.length === 0) 
                    return interaction.editReply("No results");

                const song = result.tracks[0]
                await queue.addTrack(song)
                embed
                    .setDescription(`[${song.title}](${song.url}) has been added to the queue.`)
                    .setThumbnail(song.thumbnail)
                    .setPoster({ text: `Duration: ${song.duration}` })
                
            } 

            if (!queue.playing) await queue.play()
            await interaction.editReply({
                embeds: [embed]
            })
        }
}


