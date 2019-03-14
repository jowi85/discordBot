const raiderioScore = "https://raider.io/api/v1/characters/profile?region=us&realm=vrealm&name=vname&fields=mythic_plus_scores";
const apiCalls = require('../helpers/apiCalls');

module.exports = {
    name: 'raiderio',
    description: 'raiderio',
    execute(msg, args) {
        if (args.length === 1) {
            apiCalls.callEndpoint(raiderioScore.replace("vrealm", "dalaran").replace("vname", args[0])).then(function(body) {
                if (body.statusCode && body.statusCode === 400) {msg.channel.send(body.message)}
                else {msg.channel.send(body.mythic_plus_scores.all)}})}
        else if (args.length === 2) {
            apiCalls.callEndpoint(raiderioScore.replace("vrealm", args[0]).replace("vname", args[1])).then(function(body) {
                if (body.statusCode && body.statusCode === 400) {msg.channel.send(body.message)}
                else {msg.channel.send(body.mythic_plus_scores.all)}})}
        else {}
    },
};