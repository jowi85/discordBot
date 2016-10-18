var Discord = require('discord.js');
var client = new Discord.Client();
var botUserToken = process.env.BOT_TOKEN,
    // create a bot and put its user token here -- can find this on discord.app (website, not client) under developers
    blizzardAPIKey = process.env.API_KEY,
    // put blizzard apid key here.  google blizzard api and you'll see how to obtain a key (free)
    XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest,
    re = /.+\./gi;

client.on('message', msg => {

	let prefix = "!";

	if (!msg.content.startsWith(prefix)) return;

	if (msg.content.startsWith(prefix + "help")) {
		msg.channel.sendMessage("I'm BlizzardAPI Bot!  Some things I can do are: \n \n \t !ilvl.toonName.realmName - shows item level \n \n \t !achievements.toonName.realmName - shows achievement points");
	}

	if (msg.content.startsWith(prefix + "ilvl") || msg.content.startsWith(prefix + "achievements")) {
		var msgName = msg.content.split(".")[1];
		var msgRealm = msg.content.split(".")[2];
		var ilvlApi = "https://us.api.battle.net/wow/character/"+msgRealm+"/"+msgName+"?fields=items&locale=en_US&apikey="+blizzardAPIKey
		
		var xhr = new XMLHttpRequest();
		xhr.open("GET", ilvlApi, true);
		xhr.onload = function (e) {
	  		if (xhr.readyState === 4) {
	  			var apiRes = JSON.parse(xhr.responseText);
	    		if (xhr.status === 200) {
	    			if (msg.content.startsWith(prefix + "ilvl")) {
	    				var avgIlvl = apiRes.items.averageItemLevel;
	    				var avgIlvlE = apiRes.items.averageItemLevelEquipped;
	    				msg.channel.sendMessage(msgName+' - '+msgRealm+': '+avgIlvl+' ('+avgIlvlE+' equipped)');
	    			}
	    			if (msg.content.startsWith(prefix + "achievements")) {
	    				var achievePt = apiRes.achievementPoints;
	    				msg.channel.sendMessage(msgName+' - '+msgRealm+': '+achievePt+' points total');
	    			}
	    		} else {
	      			console.error(apiRes.reason);
	      			msg.channel.sendMessage(apiRes.reason);
	    		}
	  		}
		};
		xhr.onerror = function (e) {
  			console.error(xhr.statusText);
		};
		xhr.send(null);
	}
});

client.login(botUserToken);
