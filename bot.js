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
                      prefix + "spreadsheet \n";

client.login(keys.BOT_TOKEN);

client.on('ready', () => {

    console.log("I am reborn!");
    client.guilds.array()[0].defaultChannel.send("Battlecruiser operational.");

});

client.on("message", msg =>  {

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
                request.get({url: vars.logsAPI}, function optionalCallback(err, httpResponse) {
                    msg.channel.send(vars.logsURL + JSON.parse(httpResponse.body)[0].id);
                })
            }

        } catch (e) {

            console.log(msg.content);
            console.log(e);

        }
    }
});

client.on("error", console.error);
