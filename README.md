# discordBot

#### Setup Instructions:
1) Install _mongodb_ on the machine to run the bot.  

    a.  after installed, you'll need to run `mongod` to turn on the db server
    
    b.  `mongo` can be run to open the client and look at the dbs
    

2) Install nodeJS on the machine to run the bot, preferably version 6.x.x or higher.

3) Clone the repo.  Once cloned, navigate to the `/discordBot/` folder and run `npm install`.

4) To populate your database for the first time, navigate to `/discordBot/utils/` and run `fetchData.js` and `loadData.js`.
    Both of these may take a few moments to run, depending.  Note that `fetchData.js` currently returns AH data for US-Dalaran
    server only.  To change this, update `const auctionAPI` in `/discordBot/utils/properties.js`.

5) The bot can now be started with 

    `env BOT_TOKEN=bottoken env API_KEY=apikey node bot.js`
    
    You will have to provide `BOT_TOKEN` (discord) and `API_KEY` (wow api) and include them in your startup.