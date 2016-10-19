var Discord = require('discord.js');
var client = new Discord.Client();
var botUserToken = process.env.BOT_TOKEN,
    // create a bot and put its user token here -- can find this on discord.app (website, not client) under developers
    blizzardAPIKey = process.env.API_KEY,
    // put blizzard apid key here.  google blizzard api and you'll see how to obtain a key (free)
    XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

client.on('ready', () => {
	console.log("I am reborn!");
});

client.on('message', msg => {

	let prefix = "!";

	if (!msg.content.startsWith(prefix)) return;

	if (msg.content.startsWith(prefix)) {
		if (msg.content === prefix + "help") {
			msg.channel.sendMessage("I'm BlizzardAPI Bot!  Some things I can do are: \n \n \t !ilvl realm character - shows item level \n \n \t !achievements realm character - shows achievement points \n \n \t !legendary realm character - shows any equipped legendary and effect");
			return;
		}
		var splitMsg = msg.content.split(" ");
		var splitMsgL = splitMsg.length
		var type = splitMsg[0];
		if (splitMsgL === 4) {
			var realm = splitMsg[1] + " " + splitMsg[2];
			var name = splitMsg[3];
		} else if (splitMsgL === 3) {
			var realm = splitMsg[1];
			var name = splitMsg[2];
		}
		
		var ilvlApi = "https://us.api.battle.net/wow/character/"+realm+"/"+name+"?fields=items&locale=en_US&apikey="+blizzardAPIKey
		var xhr = new XMLHttpRequest();
		xhr.open("GET", ilvlApi, true);
		xhr.onload = function (e) {
	  		if (xhr.readyState === 4) {
	  			var apiRes = JSON.parse(xhr.responseText);
	    		if (xhr.status === 200) {
	    			if (type === prefix + "ilvl") {
	    				var avgIlvl = apiRes.items.averageItemLevel;
	    				var avgIlvlE = apiRes.items.averageItemLevelEquipped;
	    				msg.channel.sendMessage(name+' - '+realm+': '+avgIlvl+' ('+avgIlvlE+' equipped)');
	    			}
	    			if (type === prefix + "achievements") {
	    				var achievePt = apiRes.achievementPoints;
	    				msg.channel.sendMessage(name+' - '+realm+': '+achievePt+' points total');
	    			}
	    			if (type === prefix + "legendary") {
	    				hasLegendary = false;
	    				for (let i = 2; i < Object.keys(apiRes.items).length; i++) {
	    					var child = Object.keys(apiRes.items)[i];
	    					if (apiRes.items[child].quality === 5) {
	    						msg.channel.sendMessage(apiRes.items[child].name + " (" + child + ")");
	    						var id = apiRes.items[child].id;
	    						console.log(id);
	    						var hasLegendary = true;
	    						var itemApi = "https://us.api.battle.net/wow/item/"+id+"?locale=en_US&apikey="+blizzardAPIKey
	    						var xhr2 = new XMLHttpRequest();
	    						xhr2.open("GET", itemApi, true);
	    						xhr2.onload = function (e) {
	    							if (xhr2.readyState === 4) {
	    								var apiRes2 = JSON.parse(xhr2.responseText);
	    								if(xhr2.status === 200) {
	    									console.log(apiRes2.itemSpells[0].spell.description);
	    									msg.channel.sendMessage(apiRes2.itemSpells[0].spell.description);
	    								} else {
	      									console.error(apiRes2.reason);
	      									msg.channel.sendMessage(apiRes2.reason);
	    								}  
	    								
	    							}
	    						}
	    						xhr2.onerror = function (e) {
  								console.error(xhr.statusText);
								};
								xhr2.send(null);
	    					}	    					
	    				}
	    				if (hasLegendary === false) {
	    					msg.channel.sendMessage("No legendaries :(");
	    				}
	    				return;
	    			}
	    		} else {
	      			console.error(apiRes.reason);
	      			msg.channel.sendMessage(apiRes.reason);
	    		}
	  		}
	  		console.log(hasLegendary);
		};
		xhr.onerror = function (e) {
  			console.error(xhr.statusText);
		};
		xhr.send(null);
	}
});

client.login(botUserToken);
