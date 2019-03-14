const {prefix} = require('../config.json');
const thingsICanDo = "Things I can do: \n\n" +
                        prefix + "logs \n" +
                        prefix + "spreadsheet \n" +
                        prefix + "raiderio {realm, default dalaran} {name} \n" +
                        prefix + "twitch";

module.exports = {
    name: 'help',
    description: 'help',
    execute(msg) {
        msg.channel.send(thingsICanDo);
    },
};