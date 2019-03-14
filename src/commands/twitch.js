module.exports = {
    name: 'twitch',
    description: 'twitch',
    execute(msg, args) {
        if (args.length === 0) {
            msg.channel.send(
                getTwitchLink("ryzer1393") +
                getTwitchLink("eidle_w") +
                getTwitchLink("ryee85") +
                getTwitchLink("horizon_92") +
                getTwitchLink("coldmedinagaming") +
                getTwitchLink("bearstick"));
        }
    },
};

function getTwitchLink(username) {
    return "\<https://www.twitch.tv/" + username + "\>\n";
}