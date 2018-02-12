const Discord = require("discord.js");
const client = new Discord.Client();
const request = require("request");
const MongoClient = require('mongodb').MongoClient;
const streamToMongoDB = require("stream-to-mongo-db").streamToMongoDB;
const JSONStream = require("JSONStream");
const keys = require('./keys');
const vars = require('./variables');

client.on('ready', () => {
    console.log("I am reborn!");
    client.guilds.array()[0].defaultChannel.send("Battlecruiser operational.");
});

client.login(keys.BOT_TOKEN);

client.on("message", msg =>  {
    const prefix = "!";
    const regExMultipleBangs = /^![^!]*!/g;
    const regExSingleBang = /^![^!]*/g;
    const iCantDoThat = "Stop trying to break me!";
    const thingsICanDo = "Things I can do: \n\n" +
                          prefix + "tellme {realm} {character} \n" +
                          prefix + "pricecheck {itemName} \n" +
                          prefix + "logs \n" +
                          prefix + "spreadsheet \n" +
                          prefix + "argus \n" +
                          prefix + "cache";

    if (msg.content.match(regExMultipleBangs)) {
        msg.channel.send(iCantDoThat);
    } else if (msg.content.match(regExSingleBang)) {

        try {

            if (!msg.content.startsWith(prefix)) return;

            if (msg.content.startsWith(prefix + "help")) {
                msg.channel.send(thingsICanDo);
            }

            if (msg.content.startsWith(prefix + "spreadsheet")) {
                msg.channel.send(vars.wowAudit)
            }

            if (msg.content.startsWith(prefix + "argus")) {
                msg.channel.send(vars.argusGuide)
            }

            if (msg.content === prefix + "logs") {
                request.get({url: vars.logsAPI}, function optionalCallback(err, httpResponse) {
                    msg.channel.send(vars.logsURL + JSON.parse(httpResponse.body)[JSON.parse(httpResponse.body).length - 1].id);
                })
            }

            if (msg.content.startsWith(prefix + "cache")) {

                let start = 0;
                let number;
                let newNumber;

                let replyLocation = null;

                if (msg.author.lastMessage.channel.type === 'dm') {
                    replyLocation = msg.author;
                } else {
                    replyLocation = msg.guild.channels.find('name', 'raidbots')
                }

                const progressApiFill = apiFill(vars.progressApi, splitMessage(msg.content)[0], splitMessage(msg.content)[1], "");
                request.get({url: progressApiFill}, function optionalCallback(err, httpResponse) {
                    if (httpResponse.statusCode === 404 && JSON.parse(httpResponse.body).reason) {
                        replyLocation.send(JSON.parse(httpResponse.body).reason);
                    } else if (httpResponse.statusCode === 200) {
                        for (let x = 0; x <= JSON.parse(httpResponse.body).progression.raids[39].bosses.length - 1; x++) {
                            number = JSON.parse(httpResponse.body).progression.raids[39].bosses[x].mythicKills;
                            newNumber = start + number;
                            start = newNumber;
                        }
                        if (newNumber >= 13) {
                            replyLocation.send("You have " + newNumber + " mythic kills, " + splitMessage(msg.content)[1] + " -- you get a mythic cache!");
                        } else {
                            replyLocation.send("You have " + newNumber + " mythic kills, " + splitMessage(msg.content)[1])
                        }
                    }
                });
            }


            if (msg.content.startsWith(prefix + "tellme")) {

                let replyLocation = null;

                if (msg.author.lastMessage.channel.type === 'dm') {
                    replyLocation = msg.author;
                } else {
                    replyLocation = msg.guild.channels.find('name', 'raidbots')
                }

                if (splitMessage(msg.content) === undefined) {
                    replyLocation.send("You have to provide a realm and character name");
                } else {
                    const ilvlApiFill = apiFill(vars.ilvlApi, splitMessage(msg.content)[0], splitMessage(msg.content)[1], "");
                    const statsApiFill = apiFill(vars.statsApi, splitMessage(msg.content)[0], splitMessage(msg.content)[1], "");
                    let character, legendaryNames, legendaryIds, legendarySlot;

                    //first request for basic class and ilvl information
                    request.get({url: ilvlApiFill}, function optionalCallback(err, httpResponse) {
                        if (httpResponse.statusCode === 404 && JSON.parse(httpResponse.body).reason) {
                            replyLocation.send(JSON.parse(httpResponse.body).reason);
                        } else if (httpResponse.statusCode === 200) {
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

                            legendaryNames = arr.filter(function (e) {return e});
                            legendaryIds = arr2.filter(function (e) {return e});
                            legendarySlot = arr3.filter(function (e) {return e});

                            character = splitMessage(msg.content)[1];
                            replyLocation.send(character[0].toUpperCase() +
                                character.substring(1) + " - " + vars.specNames[ilvlApiFillRes.items.mainHand.name] + " " + vars.classNames[ilvlApiFillRes.class - 1] +
                                " (" + ilvlApiFillRes.items.averageItemLevel + "/" + ilvlApiFillRes.items.averageItemLevelEquipped + " equipped)");
                            replyLocation.send("*** Artifact Weapon *** - " +
                                ilvlApiFillRes.items.mainHand.name + " (" + ilvlApiFillRes.items.mainHand.itemLevel + ")");

                            //next request for stats
                            request.get({url: statsApiFill}, function optionalCallback(err, httpResponse) {
                                replyLocation.send(statsMessage(JSON.parse(httpResponse.body)));
                                //finally request for legendary item descriptions, if available
                                if (legendaryNames.length === 0) {
                                    replyLocation.send("***No legendaries :(***");
                                } else if (legendaryNames.length === 1) {
                                    const itemApiFill = apiFill(vars.itemApi, "", "", legendaryIds[0]);
                                    request.get({url: itemApiFill}, function optionalCallback(err, httpResponse) {
                                        const itemApiFillRes = JSON.parse(httpResponse.body);
                                        replyLocation.send("***Legendary*** - " + legendaryNames[0] + " (" + legendarySlot[0] + ") - " + itemApiFillRes.itemSpells[0].spell.description);
                                    });
                                } else if (legendaryNames.length === 2) {
                                    const itemApiFill = apiFill(vars.itemApi, "", "", legendaryIds[0]);
                                    request.get({url: itemApiFill}, function optionalCallback(err, httpResponse) {
                                        const itemApiFillRes = JSON.parse(httpResponse.body);
                                        replyLocation.send("***Legendary*** - " + legendaryNames[0] + " (" + legendarySlot[0] + ") - " + itemApiFillRes.itemSpells[0].spell.description);
                                    });
                                    const itemApiFill2 = apiFill(vars.itemApi, "", "", legendaryIds[1]);
                                    request.get({url: itemApiFill2}, function optionalCallback(err, httpResponse) {
                                        const itemApiFillRes2 = JSON.parse(httpResponse.body);
                                        replyLocation.send("***Legendary*** - " + legendaryNames[1] + " (" + legendarySlot[1] + ") - " + itemApiFillRes2.itemSpells[0].spell.description)
                                    });
                                }
                            });
                        }
                    });
                }
            }

            if (msg.content.startsWith(prefix + "pricecheck")) {
                if ((msg.content.split(prefix + "pricecheck"))[1] === "") {
                    msg.channel.send("You have to provide an item name");
                } else {
                    const lookupItem = msg.content.split(prefix + "pricecheck ")[1].replace(" ", "%20");
                    request.get({url:"https://www.wowhead.com/item="+lookupItem+"&xml"}, function optionalCallback(err, httpResponse) {
                        if (httpResponse.body.includes("Item not found!")) {
                            msg.channel.send(msg.content.split(prefix + "pricecheck")[1] + " is not a valid item name");
                        } else {
                            const lookupItemId = httpResponse.body.split("item id=\"")[1].split("\"")[0];
                            MongoClient.connect("mongodb://localhost:27017/test", function(err, db) {
                                if (err) {
                                    msg.channel.send("Something is wrong! Couldn't connect to db");
                                    db.close();
                                } else {
                                    db.collection('auctions').aggregate(
                                        {$match:
                                            {"item":parseInt(lookupItemId)}},
                                        {$group:
                                            {_id: "$quantity", avgAmnt: {$avg: "$buyout"}, count: {$sum:1}}},
                                        {$sort: {_id:-1}},
                                        function(err, result) {
                                            if (result.length === 0) {
                                                msg.channel.send(msg.content.split(prefix + "pricecheck ")[1] + " is not on the auction house");
                                                db.close();
                                            } else if (result.length === 1) {
                                                msg.channel.send(msg.content.split(prefix + "pricecheck ")[1] + ": " + convertPrice(result[0].avgAmnt) + "g per " + result[0]._id);
                                                db.close();
                                            } else if (result.length > 1) {
                                                msg.channel.send(msg.content.split(prefix + "pricecheck ")[1] + ": " + convertPrice(result[0].avgAmnt) + "g per " + result[0]._id + ", " +
                                                    (convertPrice(result[0].avgAmnt) / (result[0]._id)).toFixed(2) + "g per 1");
                                                db.close();
                                            }
                                        }
                                    );
                                }
                            });
                        }
                    });
                }
            }

            if (msg.content.startsWith(prefix + "??loadData")) {
                MongoClient.connect("mongodb://localhost:27017/test", function(err, db) {
                    db.dropDatabase(function(err, result) {
                       msg.channel.send("Dropped old db, rebuilding...");
                    });
                });
                request.get({url:vars.auctionApi}, function optionalCallback(err, httpResponse) {
                    const auctionJson = JSON.parse(httpResponse.body).files[0].url;
                    const outputDBConfig = {dbURL: "mongodb://localhost:27017/test", collection: "auctions"};
                    const writableStream = streamToMongoDB(outputDBConfig);
                    request.get({url:auctionJson})
                        .pipe(JSONStream.parse(['auctions', true]))
                        .pipe(writableStream);
                })
            }

        } catch (e) {

            console.log(msg.content);
            console.log(e);

        }
    }
});

function splitMessage (message) {
    const splitMsg = message.split(" ");

    if (splitMsg.length === 4) {
        return [splitMsg[1] + " " + splitMsg[2], splitMsg[3]];
    } else if (splitMsg.length === 3) {
        return [splitMsg[1], splitMsg[2]];
    } else if (splitMsg.length === 2) {
        return splitMsg[1];
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
        return parseInt((rawPrice/100).toFixed(2));
    } else if (rawPrice >= 100) {
        return parseFloat((rawPrice/10000).toFixed(2));
    }
}

function statsMessage (JSON) {
    return  "*** Stats *** - **Crit**: " + JSON.stats.crit.toFixed(2) + "%" +
        " **Haste**: " + JSON.stats.haste.toFixed(2) + "%" +
        " **Mastery**: " + JSON.stats.mastery.toFixed(2) + "%" +
        " **Vers**: " + JSON.stats.versatilityDamageDoneBonus.toFixed(2) + "%\n"
}