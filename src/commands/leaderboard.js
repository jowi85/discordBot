const raiderioScore = "https://raider.io/api/v1/characters/profile?region=us&realm=dalaran&name=vname&fields=mythic_plus_scores_by_season%3Acurrent";
const apiCalls = require('../helpers/apiCalls');

const members = [
    {name: 'Tórz'},
    {name: 'Bearstick'},
    {name: 'Gynis'},
    {name: 'Chimlee'},
    {name: 'Rÿzer'},
    {name: 'Shaawa'},
    {name: 'Eeyr'},
    {name: 'Cedís'},
    {name: 'Brogainz'},
    {name: 'Stangmeister'}
];

module.exports = {
    name: 'leaderboard',
    description: 'leaderboard',
    async execute(msg, args) {
        if (args.length === 1 && (args[0] === '3' || args[0] === '5')) {
            for (let i = 0; i < members.length; i++) {
                let body = await apiCalls.callEndpoint(raiderioScore.replace("vname", members[i].name));
                members[i].score = body.mythic_plus_scores_by_season[0].scores.all;
            }
            members.sort(compare);
            for (let i = 0; i < parseInt(args[0]); i++) {
                msg.channel.send(members[i].name + ": " + members[i].score);
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