const Discord = require("discord.js");
const client = new Discord.Client();
const request = require("request");
const keys = require('./keys');
const vars = require('./variables');

const prefix = "!";
const regExMultipleBangs = /^![^!]*!/g;
const regExSingleBang = /^![^!]*/g;
const iCantDoThat = "Stop trying to break me!";
const thingsICanDo = "Things I can do: \n\n" +
                      prefix + "logs \n" +
                      prefix + "spreadsheet \n" +
                      prefix + "tokenprice";

client.login(keys.BOT_TOKEN);

client.on('ready', () => {

    console.log("I am reborn!");
    client.guilds.array()[0].defaultChannel.send("Battlecruiser operational.");

});

client.on("message", msg => {

    if (msg.content.match(regExMultipleBangs)) {
        msg.channel.send(iCantDoThat);

    } else if (msg.content.match(regExSingleBang)) {

        try {

            if (!msg.content.startsWith(prefix)) return;

            if (msg.content.startsWith(prefix + "help")) {
                msg.channel.send(thingsICanDo);
            }

            if (msg.content.startsWith(prefix + "spreadsheet")) {
                msg.channel.send(vars.wowAudit)
            }

            if (msg.content === prefix + "logs") {
                callEndpoint(vars.logsAPI).then(function(body) {
                    msg.channel.send(vars.logsURL + body[0].id)
                });
            }

            if (msg.content === prefix + "tokenprice") {
                callWowEndpoint(vars.wowTokenEndpoint).then(function(body) {
                    msg.channel.send(parseInt(body.price)/10000);
                });
            }

            if (msg.content.startsWith(prefix + "raiderio")) {
                    let msgSplit = msg.content.split(" "),
                        realm = msgSplit[1],
                        toon = msgSplit[2];
                    if (msgSplit.length !== 3) {}
                    else {callEndpoint(vars.raiderioScore.replace("vrealm", realm).replace("vname", toon)).then(function(body) {
                        if (body.statusCode && body.statusCode === 400) {
                            msg.channel.send(body.message)
                        } else {
                            msg.channel.send(body.mythic_plus_scores.all);
                        }});
                    }
            }

        } catch (e) {

            console.log(msg.content);
            console.log(e);

        }
    }
});

client.on("error", console.error);

function getAccessToken() {
    let options = {url: vars.wowOauth,
                   auth: {user:keys.wowClientId, password:keys.wowClientSecret},
                   form: {grant_type: "client_credentials"},
                   json: true};
    return new Promise(function(resolve, reject) {
        request.post(options, function(err, res, body) {
            if (!err) {resolve(body)}
            else {reject(err)}
        })
    })
}

async function callEndpoint(endpoint) {
    let options = {url: endpoint, json: true};
    return new Promise(function(resolve, reject) {
        request.get(options, function(err, res, body) {
            if (!err) {resolve(body)}
            else {reject(err)}
        })
    })
}

async function callWowEndpoint(endpoint) {
    let token = await getAccessToken(),
        headers = {'Authorization': 'Bearer ' + token.access_token},
        options = {url: endpoint, headers: headers, json: true};
    return new Promise(function(resolve, reject) {
        request.get(options, function(err, res, body) {
            if (!err) {resolve(body)}
            else {reject(err)}
        })
    })
}
