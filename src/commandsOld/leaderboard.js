const raiderioScore = "https://raider.io/api/v1/characters/profile?region=us&realm=dalaran&name=vname&fields=mythic_plus_scores_by_season%3Acurrent";
const apiCalls = require('../helpers/apiCalls');
const guildRoster = require('../helpers/guildRoster');


module.exports = {
    name: 'leaderboard',
    description: 'leaderboard',
    async execute(msg, args) {
        if (args.length === 1 && (args[0] === '3' || args[0] === '5')) {
            for (let i = 0; i < guildRoster.members.length; i++) {
                let body = await apiCalls.callEndpoint(raiderioScore.replace("vname", guildRoster.members[i].name));
                guildRoster.members[i].score = body.mythic_plus_scores_by_season[0].scores.all;
            }
            guildRoster.members.sort(compare);
            for (let i = 0; i < parseInt(args[0]); i++) {
                msg.channel.send(guildRoster.members[i].name + ": " + guildRoster.members[i].score);
            }
        }
        else {}
    }
};

function compare(a, b) {
    if (a.score > b.score) { return -1; }
    if (a.score < b.score) { return 1; }
    return 0;
}