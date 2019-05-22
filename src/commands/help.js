const {prefix} = require('../config.json');
const thingsICanDo = "Things I can do: \n\n" +
                        prefix + "logs \n" +
                        prefix + "spreadsheet \n" +
                        prefix + "raiderio {realm, default dalaran} {name} \n" +
                        prefix + "leaderboard 3 or 5 \n" +
                        prefix + "twitch";

module.exports = {
    name: 'help',
    description: 'help',
    execute(msg, args) {
        if (args.length === 0) {
            msg.channel.send(thingsICanDo);
        }
    },
};