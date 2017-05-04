const Discord = require("discord.js");
const client = new Discord.Client();
const request = require("request");
const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const props = require('./utils/properties');

client.on('ready', () => {
    console.log("I am reborn!");
});

client.login(props.botUserToken);

client.on("message", msg => {
    const prefix = "!";

    if (!msg.content.startsWith(prefix)) return;

    if (msg.content === prefix + "help") {
        msg.channel.sendMessage("Use " + prefix + "tellme {realm} {character} to get information!");
    }

    if (msg.content.startsWith(prefix + "tellme")) {
        const ilvlApiFill = apiFill(props.ilvlApi, splitMessage(msg.content)[0], splitMessage(msg.content)[1], "");
        const statsApiFill = apiFill(props.statsApi, splitMessage(msg.content)[0], splitMessage(msg.content)[1], "");
        let character, legendaryNames, legendaryIds, legendarySlot;

        //first request for basic class and ilvl information
        request.get({url:ilvlApiFill}, function optionalCallback(err, httpResponse) {
            //iterate through and find legendary items, put them in arrays
            const ilvlApiFillRes = JSON.parse(httpResponse.body);
            let arr = new Array(), arr2 = new Array(), arr3 = new Array();
            for (let i = 2; i < Object.keys(ilvlApiFillRes.items).length; i++) {
                const armorType = Object.keys(ilvlApiFillRes.items)[i];
                if (ilvlApiFillRes.items[armorType].quality === 5) {
                    arr[i] = ilvlApiFillRes.items[armorType].name;
                    arr2[i] = ilvlApiFillRes.items[armorType].id;
                    arr3[i] = armorType;
                }
            }
            legendaryNames = arr.filter(function(e){return e});
            legendaryIds = arr2.filter(function(e){return e});
            legendarySlot = arr3.filter(function(e){return e});

            character = splitMessage(msg.content)[1];
            msg.channel.sendMessage(character[0].toUpperCase() +
                character.substring(1) + " - " + props.specNames[ilvlApiFillRes.items.mainHand.name] + " " + props.classNames[ilvlApiFillRes.class - 1] +
                " (" + ilvlApiFillRes.items.averageItemLevel + "/" + ilvlApiFillRes.items.averageItemLevelEquipped + " equipped)");
            msg.channel.sendMessage("*** Artifact Weapon *** - " +
                ilvlApiFillRes.items.mainHand.name + " (" + ilvlApiFillRes.items.mainHand.itemLevel + ")");

            //next request for stats
            request.get({url:statsApiFill}, function optionalCallback(err, httpResponse) {
                msg.channel.sendMessage(statsMessage(JSON.parse(httpResponse.body)));
                //finally request for legendary item descriptions, if available
                if (legendaryNames.length === 0) {
                    msg.channel.sendMessage("***No legendaries :(***");
                } else if (legendaryNames.length === 1) {
                    const itemApiFill = apiFill(props.itemApi, "", "", legendaryIds[0]);
                    request.get({url:itemApiFill}, function optionalCallback(err, httpResponse) {
                        const itemApiFillRes = JSON.parse(httpResponse.body);
                        msg.channel.sendMessage("***Legendary*** - " + legendaryNames[0] + " (" + legendarySlot[0] + ") - " + itemApiFillRes.itemSpells[0].spell.description);
                    });
                } else if (legendaryNames.length === 2) {
                    const itemApiFill = apiFill(props.itemApi, "", "", legendaryIds[0]);
                    request.get({url:itemApiFill}, function optionalCallback(err, httpResponse) {
                        const itemApiFillRes = JSON.parse(httpResponse.body);
                        msg.channel.sendMessage("***Legendary*** - " + legendaryNames[0] + " (" + legendarySlot[0] + ") - " + itemApiFillRes.itemSpells[0].spell.description);
                    });
                    const itemApiFill2 = apiFill(props.itemApi, "", "", legendaryIds[1]);
                    request.get({url:itemApiFill2}, function optionalCallback(err, httpResponse) {
                        const itemApiFillRes2 = JSON.parse(httpResponse.body);
                        msg.channel.sendMessage("***Legendary*** - " + legendaryNames[1] + " (" + legendarySlot[1] + ") - " + itemApiFillRes2.itemSpells[0].spell.description)
                    });
                }
            });
        });
    }

    if (msg.content.startsWith(prefix + "pricecheck")) {
        const lookupItem = msg.content.split(prefix + "pricecheck ")[1].replace(" ", "%20");

        request.get({url:"https://www.wowhead.com/item="+lookupItem+"&xml"}, function optionalCallback(err, httpResponse) {
            if (httpResponse.body.includes("Item not found!")) {
                msg.channel.sendMessage(msg.content.split(prefix + "pricecheck")[1] + " is not a valid item name.");

            } else {
                const lookupItemId = httpResponse.body.split("item id=\"")[1].split("\"")[0];
                console.log(lookupItemId);

                MongoClient.connect(props.mongodburl, function(err, db) {
                    if (err) {
                        msg.channel.sendMessage("Joey only has the database locally.  Ask him to turn it on!");
                        db.close();
                    } else {
                        db.collection('auctions').aggregate(
                            {$match:
                                {"item":parseInt(lookupItemId)}},
                            {$group:
                                {_id: null, avgAmnt: {$avg: {$divide: ["$buyout","$quantity"]}}}},
                            {$sort: {_id: -1}},
                            function(err, result) {
                                console.log(result);
                                if (result.length === 0) {
                                    msg.channel.sendMessage(msg.content.split(prefix + "pricecheck ")[1] + " is not on the auction house");
                                    db.close();
                                } else {
                                    msg.channel.sendMessage(msg.content.split(prefix + "pricecheck ")[1] + ": " + convertPrice(result[0].avgAmnt) + " (average buyout per one)");
                                    db.close();
                                }
                            }
                        );
                    }
                });
            }
        });
    }
});

function splitMessage (message) {
    const splitMsg = message.split(" ");

    if (splitMsg.length === 4) {
        return [splitMsg[1] + " " + splitMsg[2], splitMsg[3]];
    } else if (splitMsg.length === 3) {
        return [splitMsg[1], splitMsg[2]];
    }
}

function apiFill (endpoint, realm, character, id) {
    if (realm === "" && character === "") {
        return endpoint.replace("{id}", id);
    } else if (id === "") {
        return endpoint.replace("{realm}", realm).replace("{character}", encodeURIComponent(character));
    }
}

function convertPrice (rawPrice) {
    if (rawPrice < 100) {
        return "0." + (rawPrice/100).toString().split(".")[1] + "g";
    } else if (rawPrice >= 100) {
        return (rawPrice/10000).toString().split(".")[0] + "." + (rawPrice/10000).toString().split(".")[1].substring(0,2) + "g";
    }
}

function statsMessage (JSON) {
    return  "*** Stats *** - **Crit**: " + JSON.stats.crit.toFixed(2) + "%" +
        " **Haste**: " + JSON.stats.haste.toFixed(2) + "%" +
        " **Mastery**: " + JSON.stats.mastery.toFixed(2) + "%" +
        " **Vers**: " + JSON.stats.versatilityDamageDoneBonus.toFixed(2) + "%\n"
}