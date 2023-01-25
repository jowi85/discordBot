const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spreadsheet')
        .setDescription('Replies with FP\'s wowaudit spreadsheet!'),
    async execute(interaction) {
        await interaction.reply('https://wowaudit.com/sheet/us/dalaran/forgotten-prophets/main');
    },
};