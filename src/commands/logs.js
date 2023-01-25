const {SlashCommandBuilder} = require("discord.js");
const apiCalls = require('../helpers/apiCalls');
const { warcraftlogsClientId, warcraftlogsClientSecret } = require('../config.json');
const warcraftlogsOauth = "https://www.warcraftlogs.com/oauth/token";
const warcraftlogsEndpoint = "https://www.warcraftlogs.com/api/v2/client";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('logs')
        .setDescription('Replies with most recent WarcraftLogs link!'),
    async execute(interaction) {
        let body = await apiCalls.callEndpointWithToken(warcraftlogsEndpoint, warcraftlogsOauth, warcraftlogsClientId, warcraftlogsClientSecret)
        await interaction.reply("https://www.warcraftlogs.com/reports/" + body.data.reportData.reports.data[0].code);
    },
};