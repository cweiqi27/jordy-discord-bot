const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('yourmom')
        .setDescription('Something nice about your mom'),
    async execute(interaction) {
        await interaction.reply('Your mom');
        await interaction.deleteReply();
    }
}