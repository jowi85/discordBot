const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require('fs');
const path = require('path');

const {prefix} = require('./config.json');
const keys = require('./keys');

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync(path.resolve(__dirname, "./commands")).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {

    console.log("I am reborn!");
    client.guilds.array()[0].defaultChannel.send("Ishnu'alah");

});

client.on('message', msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    const args = msg.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;

    try {
        client.commands.get(command).execute(msg, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});

client.login(keys.BOT_TOKEN);

