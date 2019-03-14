const keys = require('../keys');
const logsURL = "https://www.warcraftlogs.com/reports/";
const logsAPI = "https://www.warcraftlogs.com:443/v1/reports/guild/Forgotten%20Prophets/Dalaran/US?api_key="+keys.LOG_KEY;
const apiCalls = require('../helpers/apiCalls');

module.exports = {
    name: 'logs',
    description: 'logs',
    execute(msg, args) {
        if (args.length === 0) {
            apiCalls.callEndpoint(logsAPI).then(function (body) {
                msg.channel.send(logsURL + body[0].id)
            });
        }
    },
};