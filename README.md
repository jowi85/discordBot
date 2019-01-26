# discordBot

#### Setup Instructions:

1) Install nodeJS on your machine.

2) Clone the repo.  Once cloned, navigate to the `discordBot/` folder and run `npm install`.

3) Make sure to define all values in `keys.js`.  
    a) `BOT_TOKEN` is your access token from discord. https://discordpy.readthedocs.io/en/rewrite/discord.html for more information.
    
    b) `LOG_KEY` is your access token from warcraftlogs.
    
    c) `wowClientId` and `wowClientSecret` are from blizzard's api development portal. https://develop.battle.net/ for more information.

4) The bot can be started in an IDE of your choice or via command line with the syntax `node bot.js` from within the
`discordBot/` directory.
