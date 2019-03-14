const wowAudit = "https://wowaudit.com/us/dalaran/forgotten-prophets";

module.exports = {
    name: 'spreadsheet',
    description: 'spreadsheet',
    execute(msg, args) {
        if (args.length === 0) {
            msg.channel.send(wowAudit);
        }
    },
};