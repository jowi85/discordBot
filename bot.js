var Discord = require('discord.js');
var client = new Discord.Client();
var botUserToken = process.env.BOT_TOKEN;
// create a bot and put its user token here -- can find this on discord.app (website, not client) under developers
var blizzardAPIKey = process.env.API_KEY;
// put blizzard apid key here.  google blizzard api and you'll see how to obtain a key (free)
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var ilvlApi = "https://us.api.battle.net/wow/character/{realm}/{character}?fields=items&locale=en_US&apikey="+blizzardAPIKey;
var itemApi = "https://us.api.battle.net/wow/item/{id}?locale=en_US&apikey="+blizzardAPIKey;

client.on('ready', () => {
	console.log("I am reborn!");
});

client.on('message', msg => {

	let prefix = "!";

	if (!msg.content.startsWith(prefix)) return;

	if (msg.content === prefix + "help") {
		msg.channel.sendMessage("I'm BlizzardAPI Bot!  Some things I can do are: \n \n \t !ilvl realm character - shows item level \n \n \t !achievements realm character - shows achievement points \n \n \t !legendary realm character - shows any equipped legendary and effect");
		return;
	}

	if ((msg.content.startsWith(prefix + "ilvl")) || (msg.content.startsWith(prefix + "achievements")) || (msg.content.startsWith(prefix + "legendary")) || (msg.content.startsWith(prefix + "yradnegel"))) {
		//parse message and fill in endpoint url
		var params = splitMessage(msg.content);
		var ilvlApiFill = apiFill(ilvlApi, params[0], params[1], '');
		//make a request to ilvl api
		var xhr = new XMLHttpRequest();
		xhr.open("GET", ilvlApiFill, true);
		xhr.onload = function (e) {
			//if endpoint is called successfully and response has 200 status
			if (xhr.readyState === 4) {
				var ilvlApiFillRes = JSON.parse(xhr.responseText);
				if (xhr.status === 200) {
					var avgIlvl = ilvlApiFillRes.items.averageItemLevel;
					var avgIlvlE = ilvlApiFillRes.items.averageItemLevelEquipped;
					var achievePt = ilvlApiFillRes.achievementPoints;
					//return ilvl
					if (msg.content.startsWith(prefix + "ilvl")) {
						msg.channel.sendMessage(params[1]+' - '+params[0]+': '+avgIlvl+' ('+avgIlvlE+' equipped)');
					}
					//return achievement points
					if (msg.content.startsWith(prefix + "achievements")) {
						msg.channel.sendMessage(params[1]+' - '+params[0]+': '+achievePt+' points total');
					}
					if (msg.content.startsWith(prefix + "legendary") && params[1].toLowerCase() !== "chimley") {
						//set hasLegendary to false.  will only change to true if for loop finds a quality 5.  otherwise no second api call is made
						var hasLegendary = false;
						//parse through all items listed in ilvl api.  if any of the equipped items has status 5 (legendary), store the itemId of the legendary,
						//make second call to item api, and retrieve description of what the legendary property is for that itemId.
						for (let i = 2; i < Object.keys(ilvlApiFillRes.items).length; i++) {
							var armorType = Object.keys(ilvlApiFillRes.items)[i];
							//if there is a legendary, store itemId to use below.
							if (ilvlApiFillRes.items[armorType].quality === 5) {
								msg.channel.sendMessage(ilvlApiFillRes.items[armorType].name + " (" + armorType + ")");
								var itemId = ilvlApiFillRes.items[armorType].id;
								//sets hasLegendary to true bot doesn't return 'No Legendary :(' message.
								hasLegendary = true;
								//makes second call to item api with stored itemId.
								var itemApiFill = apiFill(itemApi, '', '', itemId);
								var xhr2 = new XMLHttpRequest();
								xhr2.open("GET", itemApiFill, true);
								xhr2.onload = function (e) {
									if (xhr2.readyState === 4) {
	    								var itemApiFillRes = JSON.parse(xhr2.responseText);
	    								if(xhr2.status === 200) {
	    									msg.channel.sendMessage(itemApiFillRes.itemSpells[0].spell.description);
	    								} else {
	      									msg.channel.sendMessage(itemApiFillRes.reason);
	    								}  
	    							}
								}
								xhr2.onerror = function (e) {
  									console.error(xhr2.statusText);
								};
								xhr2.send(null);
							}
	    				}
	    				//if the for loop didn't find any item with quality 5, skip the second call and return 'No Legendary :('.
	    				if (hasLegendary === false) {
	    					msg.channel.sendMessage("No legendaries :(");
						}
						return;
					}
					if (msg.content.startsWith(prefix + "legendary") && params[1].toLowerCase() === "chimley") {
						//set hasLegendary to false.  will only change to true if for loop finds a quality 5.  otherwise no second api call is made
						msg.channel.sendMessage("Chimley? No, I don't want to. \n \n \n \n I'll only do it if you can retype the command and spell 'legendary' backwards...muhahaha");
					}
					if (msg.content.startsWith(prefix + "yradnegel") && params[1].toLowerCase() === "chimley") {
						//set hasLegendary to false.  will only change to true if for loop finds a quality 5.  otherwise no second api call is made
						msg.channel.sendMessage("As you wish...");
						var hasLegendary = false;
						//parse through all items listed in ilvl api.  if any of the equipped items has status 5 (legendary), store the itemId of the legendary,
						//make second call to item api, and retrieve description of what the legendary property is for that itemId.
						for (let i = 2; i < Object.keys(ilvlApiFillRes.items).length; i++) {
							var armorType = Object.keys(ilvlApiFillRes.items)[i];
							//if there is a legendary, store itemId to use below.
							if (ilvlApiFillRes.items[armorType].quality === 5) {
								msg.channel.sendMessage(ilvlApiFillRes.items[armorType].name + " (" + armorType + ")");
								var itemId = ilvlApiFillRes.items[armorType].id;
								//sets hasLegendary to true bot doesn't return 'No Legendary :(' message.
								hasLegendary = true;
								//makes second call to item api with stored itemId.
								var itemApiFill = apiFill(itemApi, '', '', itemId);
								var xhr2 = new XMLHttpRequest();
								xhr2.open("GET", itemApiFill, true);
								xhr2.onload = function (e) {
									if (xhr2.readyState === 4) {
	    								var itemApiFillRes = JSON.parse(xhr2.responseText);
	    								if(xhr2.status === 200) {
	    									msg.channel.sendMessage(itemApiFillRes.itemSpells[0].spell.description);
	    								} else {
	      									msg.channel.sendMessage(itemApiFillRes.reason);
	    								}  
	    							}
								}
								xhr2.onerror = function (e) {
  									console.error(xhr2.statusText);
								};
								xhr2.send(null);
							}
	    				}
	    				//if the for loop didn't find any item with quality 5, skip the second call and return 'No Legendary :('.
	    				if (hasLegendary === false) {
	    					msg.channel.sendMessage("No legendaries :(");
						}
						return;
					}
				} else {
	      			console.error(ilvlApiFillRes.reason);
	      			msg.channel.sendMessage(ilvlApiFillRes.reason);
				}
			}
		}
		xhr.onerror = function (e) {
			console.error(xhr.statusText);
		}
		xhr.send(null);
	}
});

function splitMessage (message) {
	var splitMsg = message.split(" ");
	var splitMsgL = splitMsg.length
	if (splitMsgL === 4) {
		var realm = splitMsg[1] + " " + splitMsg[2];
		var character = splitMsg[3];
		var splitMessageR = [realm, character];
	} else if (splitMsgL === 3) {
		var realm = splitMsg[1];
		var character = splitMsg[2];
		var splitMessageR = [realm, character];
	}
	return splitMessageR;
}

function apiFill (endpoint, realm, character, id) {
	if (realm === '' && character === '') {
		var api = endpoint.replace("{id}", id);
		return api;
	} else if (id === '') {
		var api = endpoint.replace("{realm}", realm).replace("{character}", character);
		return api;
	}
}

client.login(botUserToken);