const wowAudit = "https://wowaudit.com/us/dalaran/forgotten-prophets";

module.exports = {
    name: 'spreadsheet',
    description: 'spreadsheet',
    execute(msg) {
        msg.channel.send(wowAudit);
    },
};