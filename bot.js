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

	if ((msg.content.startsWith(prefix + "ilvl")) || (msg.content.startsWith(prefix + "achievements")) || (msg.content.startsWith(prefix + "legendary"))) {
		var params = splitMessage(msg.content);
		var ilvlApiFill = apiFill(ilvlApi, params[0], params[1], '');
		var xhr = new XMLHttpRequest();
		xhr.open("GET", ilvlApiFill, true);
		xhr.onload = function (e) {

			if (xhr.readyState === 4) {
				var ilvlApiFillRes = JSON.parse(xhr.responseText);

				if (xhr.status === 200) {
					var avgIlvl = ilvlApiFillRes.items.averageItemLevel;
					var avgIlvlE = ilvlApiFillRes.items.averageItemLevelEquipped;
					var achievePt = ilvlApiFillRes.achievementPoints;
					var arr = new Array();
					var arr2 = new Array();
					var arr3 = new Array();
					for (let i = 2; i < Object.keys(ilvlApiFillRes.items).length; i++) {
						var armorType = Object.keys(ilvlApiFillRes.items)[i];
						if (ilvlApiFillRes.items[armorType].quality === 5) {
							arr[i] = ilvlApiFillRes.items[armorType].name
							arr2[i] = ilvlApiFillRes.items[armorType].id;
							arr3[i] = armorType;
						}
					}

					legendaryNames = arr.filter(function(e){return e});
					legendaryIds = arr2.filter(function(e){return e}); 
					legendarySlot = arr3.filter(function(e){return e});
					
					if (msg.content.startsWith(prefix + "ilvl")) {
						msg.channel.sendMessage(params[1]+' - '+params[0]+': '+avgIlvl+' ('+avgIlvlE+' equipped)');
					}
					
					if (msg.content.startsWith(prefix + "achievements")) {
						msg.channel.sendMessage(params[1]+' - '+params[0]+': '+achievePt+' points total');
					}

					if (msg.content.startsWith(prefix + "legendary") && legendaryNames.length === 1) {
						var itemApiFill = apiFill(itemApi, '', '', legendaryIds[0]);
						var xhr2 = new XMLHttpRequest();
						xhr2.open("GET", itemApiFill, true);
						xhr2.onload = function (e) {
							if (xhr2.readyState === 4) {
								var itemApiFillRes = JSON.parse(xhr2.responseText);
								if(xhr2.status === 200) {
									msg.channel.sendMessage(legendaryNames[0] + " (" + legendarySlot[0] + ") - " + itemApiFillRes.itemSpells[0].spell.description);
								} else {
  									msg.channel.sendMessage(itemApiFillRes.reason);
								}  
							}
						}
						xhr2.onerror = function (e) {
							console.error(xhr2.statusText);
						};
						xhr2.send(null);

    				} else if (msg.content.startsWith(prefix + "legendary") && legendaryNames.length === 2) {
    					var itemApiFillOne = apiFill(itemApi, '', '', legendaryIds[0]);
						var xhr2 = new XMLHttpRequest();
						xhr2.open("GET", itemApiFillOne, true);
						xhr2.onload = function (e) {
							if (xhr2.readyState === 4) {
								var itemApiFillOneRes = JSON.parse(xhr2.responseText);
								if(xhr2.status === 200) {
									msg.channel.sendMessage(legendaryNames[0] + " (" + legendarySlot[0] + ") - " + itemApiFillOneRes.itemSpells[0].spell.description);
								} else {
  									msg.channel.sendMessage(itemApiFillOneRes.reason);
								}  
							}
						}
						xhr2.onerror = function (e) {
							console.error(xhr2.statusText);
						};
						xhr2.send(null);

						var itemApiFillTwo = apiFill(itemApi, '', '', legendaryIds[1]);
						var xhr3 = new XMLHttpRequest();
						xhr3.open("GET", itemApiFillTwo, true);
						xhr3.onload = function (e) {
							if (xhr3.readyState === 4) {
								var itemApiFillTwoRes = JSON.parse(xhr3.responseText);
								if(xhr3.status === 200) {
									msg.channel.sendMessage(legendaryNames[1] + " (" + legendarySlot[1] + ") - " + itemApiFillTwoRes.itemSpells[0].spell.description);
								} else {
  									msg.channel.sendMessage(itemApiFillTwoRes.reason);
								}  
							}
						}
						xhr3.onerror = function (e) {
							console.error(xhr3.statusText);
						};
						xhr3.send(null);
					
    				} else if (msg.content.startsWith(prefix + "legendary") && legendaryNames.length === 0) {
    					msg.channel.sendMessage("No legendaries :(");
    				}

				}

			} else {
      			console.error(ilvlApiFillRes.reason);
      			msg.channel.sendMessage(ilvlApiFillRes.reason);
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