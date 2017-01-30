var Discord = require('discord.js');
var client = new Discord.Client();
var botUserToken = process.env.BOT_TOKEN;
// create a bot and put its user token here -- can find this on discord.app (website, not client) under developers
var blizzardAPIKey = process.env.API_KEY;
// put blizzard apid key here.  google blizzard api and you'll see how to obtain a key (free)
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var ilvlApi = "https://us.api.battle.net/wow/character/{realm}/{character}?fields=items&locale=en_US&apikey="+blizzardAPIKey;
var itemApi = "https://us.api.battle.net/wow/item/{id}?locale=en_US&apikey="+blizzardAPIKey;
var statsApi = "https://us.api.battle.net/wow/character/{realm}/{character}?fields=stats&locale=en_US&apikey="+blizzardAPIKey;
var classNames = ["Warrior", "Paladin", "Hunter", "Rogue", "Priest", "Death Knight", "Shaman", "Mage", "Warlock", "Monk", "Druid", "Demon Hunter"];
var specNames = {//warrior
                 'Scaleshard': 'Protection', 
                 'Strom\'kar, the Warbreaker': 'Arms',
                 'Warswords of the Valarjar': 'Fury',
                 //paladin
                 'Oathseeker': 'Protection',
                 'Ashbringer': 'Retribution',
                 'The Silver Hand': 'Holy',
                 //hunter
                 'Thas\'dorah, Legacy of the Windrunners': 'Marksmanship',
                 'Talonclaw': 'Survival',
                 'Titanstrike': 'Beast Mastery',
                 //rogue
                 'The Kingslayers': 'Assassination',
                 'The Dreadblades': 'Outlaw',
                 'Fangs of the Devourer': 'Subtelty',
                 //priest
                 'T\'uure, Beacon of the Naaru': 'Holy',
                 'Light\'s Wrath': 'Discipline',
                 'Xal\'atath, Blade of the Black Empire': 'Shadow',
                 //death knight
                 'Maw of the Damned': 'Blood',
                 'Frostreaper': 'Frost',
                 'Apocalypse': 'Unholy',
                 //shaman
                 'The Fist of Ra-den': 'Elemental',
                 'Doomhammer': 'Enhancement',
                 'Sharas\'dal, Scepter of Tides': 'Restoration',
                 //mage
                 'Aluneth': 'Arcane',
                 'Felo\'melorn': 'Fire',
                 'Ebonchill': 'Frost',
                 //warlock
                 'Spine of Thal\'kiel': 'Demonology',
                 'Scepter of Sargeras': 'Destruction',
                 'Ulthalesh, the Deadwind Harvester': 'Affliction',
                 //monk
                 'Sheilun, Staff of the Mists': 'Mistweaver',
                 'Fists of the Heavens': 'Windwalker',
                 'Fu Zan, the Wanderer\'s Companion': 'Brewmaster',
                 //druid
                 'Fangs of Ashmane': 'Feral',
                 'Claws of Ursoc': 'Guardian',
                 'G\'Hanir, the Mother Tree': 'Restoration',
                 'Scythe of Elune': 'Balance',
                 //demon hunter
                 'Twinblades of the Deceiver': 'Havoc',
                 'Aldrachi Warblades': 'Vengeance'};

client.on('ready', () => {
    console.log("I am reborn!");
});

client.on('message', msg => {

    let prefix = "!";

    if (!msg.content.startsWith(prefix)) return;

    if (msg.content === prefix + "help") {
        msg.channel.sendMessage("I'm BlizzardAPI Bot!  Try " + prefix + "tellme {realm} {character} to get information!");
        return;
    }

    if (msg.content.startsWith(prefix + "tellme")) {
        var params = splitMessage(msg.content);
        var ilvlApiFill = apiFill(ilvlApi, params[0], params[1], '');
        var statsApiFill = apiFill(statsApi, params[0], params[1], '');
        var xhr = new XMLHttpRequest();
        xhr.open("GET", ilvlApiFill, true);
        xhr.onload = function (e) {

            if (xhr.readyState === 4) {
                var ilvlApiFillRes = JSON.parse(xhr.responseText);

                if (xhr.status === 200) {
                    var character = params[1];
                    var realm = params[0];
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
                    console.log(legendaryNames);
                    legendaryIds = arr2.filter(function(e){return e}); 
                    console.log(legendaryIds);
                    legendarySlot = arr3.filter(function(e){return e});
                    console.log(legendarySlot);

                    var thisClass = classNames[ilvlApiFillRes.class - 1];
                    var thisSpec = specNames[ilvlApiFillRes.items.mainHand.name];
                    

                    msg.channel.sendMessage(character[0].toUpperCase() + character.substring(1) + ' - ' + thisSpec + ' ' + thisClass + ' (' + avgIlvl+ '/'+avgIlvlE+' equipped)');
                    msg.channel.sendMessage('*** Artifact Weapon ***');
                    msg.channel.sendMessage(ilvlApiFillRes.items.mainHand.name + ' (' + ilvlApiFillRes.items.mainHand.itemLevel + ')');
                    

                    if (legendaryNames.length === 1) {
                        var xhr2 = new XMLHttpRequest();
                        xhr2.open("GET", statsApiFill, true);
                        xhr2.onload = function (e) {
                            if (xhr2.readyState === 4) {
                                var statsApiFillRes = JSON.parse(xhr2.responseText);

                                if (xhr2.status === 200) {
                                    msg.channel.sendMessage('*** Stats ***');
                                    msg.channel.sendMessage('**Crit**: ' + statsApiFillRes.stats.crit.toFixed(2) + '%' + 
                                                            ' **Haste**: ' + statsApiFillRes.stats.haste.toFixed(2) +'%' +
                                                            ' **Mastery**: ' + statsApiFillRes.stats.mastery.toFixed(2) +'%' +
                                                            ' **Vers**: ' + statsApiFillRes.stats.versatilityDamageDoneBonus.toFixed(2) +'%' +
                                                            '*** Legendaries ***'
                                                            );
                                    var xhr3 = new XMLHttpRequest();
                                    var itemApiFill = apiFill(itemApi, '', '', legendaryIds[0]);
                                    xhr3.open("GET", itemApiFill, true);
                                    xhr3.onload = function (e) {
                                        if (xhr3.readyState === 4) {
                                            var itemApiFillRes = JSON.parse(xhr3.responseText);
                                            if(xhr3.status === 200) {
                                                msg.channel.sendMessage(legendaryNames[0] + " (" + legendarySlot[0] + ") - " + itemApiFillRes.itemSpells[0].spell.description);
                                            } else {
                                                msg.channel.sendMessage(itemApiFillRes.reason);
                                            }  
                                        }
                                    }
                                    xhr3.onerror = function (e) {
                                        console.error(xhr3.statusText);
                                    };
                                    xhr3.send(null);
                                } else {
                                    console.error(statsApiFillRes.reason);
                                    msg.channel.sendMessage(statsApiFillRes.reason);
                                }
                            }
                        }
                        xhr2.onerror = function (e) {
                            console.error(xhr2.statusText);
                        }
                        xhr2.send(null);

                        

                    } else if (legendaryNames.length === 2) {
                        var xhr2 = new XMLHttpRequest();
                        xhr2.open("GET", statsApiFill, true);
                        xhr2.onload = function (e) {
                            if (xhr2.readyState === 4) {
                                var statsApiFillRes = JSON.parse(xhr2.responseText);
                                
                                if (xhr2.status === 200) {
                                    msg.channel.sendMessage('*** Stats ***');
                                    msg.channel.sendMessage('**Crit**: ' + statsApiFillRes.stats.crit.toFixed(2) + '%' + 
                                                            ' **Haste**: ' + statsApiFillRes.stats.haste.toFixed(2) +'%' +
                                                            ' **Mastery**: ' + statsApiFillRes.stats.mastery.toFixed(2) +'%' +
                                                            ' **Vers**: ' + statsApiFillRes.stats.versatilityDamageDoneBonus.toFixed(2) +'%' +
                                                            '*** Legendaries ***'
                                                            );

                                        var xhr3 = new XMLHttpRequest();
                                        var itemApiFillOne = apiFill(itemApi, '', '', legendaryIds[0]);
                                        xhr3.open("GET", itemApiFillOne, true);
                                        xhr3.onload = function (e) {
                                            if (xhr3.readyState === 4) {
                                                console.log("I'm second");
                                                var itemApiFillOneRes = JSON.parse(xhr3.responseText);
                                                if(xhr3.status === 200) {
                                                    console.log(legendarySlot[0]);
                                                    msg.channel.sendMessage(legendaryNames[0] + " (" + legendarySlot[0] + ") - " + itemApiFillOneRes.itemSpells[0].spell.description);
                                                } else {
                                                    msg.channel.sendMessage(itemApiFillOneRes.reason);
                                                }  
                                            }
                                        }
                                        xhr3.onerror = function (e) {
                                            console.error(xhr3.statusText);
                                        };
                                        xhr3.send(null);

                                        var xhr4 = new XMLHttpRequest();
                                        var itemApiFillTwo = apiFill(itemApi, '', '', legendaryIds[1]);
                                        xhr4.open("GET", itemApiFillTwo, true);
                                        xhr4.onload = function (e) {
                                            if (xhr4.readyState === 4) {
                                                var itemApiFillTwoRes = JSON.parse(xhr4.responseText);
                                                if(xhr4.status === 200) {
                                                    console.log(legendarySlot[1]);
                                                    msg.channel.sendMessage(legendaryNames[1] + " (" + legendarySlot[1] + ") - " + itemApiFillTwoRes.itemSpells[0].spell.description);
                                                } else {
                                                    msg.channel.sendMessage(itemApiFillTwoRes.reason);
                                                }  
                                            }
                                        }
                                        xhr4.onerror = function (e) {
                                            console.error(xhr4.statusText);
                                        };
                                        xhr4.send(null);
                                } else {
                                    console.error(statsApiFillRes.reason);
                                    msg.channel.sendMessage(statsApiFillRes.reason);
                                }
                            }
                        }
                        xhr2.onerror = function (e) {
                            console.error(xhr2.statusText);
                        }
                        xhr2.send(null);
                    
                    } else if (legendaryNames.length === 0) {
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