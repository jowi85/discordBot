const keys = require('./keys');

const ilvlApi = "https://us.api.battle.net/wow/character/{realm}/{character}?fields=items&locale=en_US&apikey="+keys.API_KEY;
exports.ilvlApi = ilvlApi;
const itemApi = "https://us.api.battle.net/wow/item/{id}?locale=en_US&apikey="+keys.API_KEY;
exports.itemApi = itemApi;
const statsApi = "https://us.api.battle.net/wow/character/{realm}/{character}?fields=stats&locale=en_US&apikey="+keys.API_KEY;
exports.statsApi = statsApi;
const auctionAPI = "https://us.api.battle.net/wow/auction/data/dalaran?locale=en_US&apikey="+keys.API_KEY;
exports.auctionApi = auctionAPI;
const progressAPI = "https://us.api.battle.net/wow/character/{realm}/{character}?fields=progression&locale=en_US&apikey="+keys.API_KEY;
exports.progressApi = progressAPI;

const wowAudit = "https://wowaudit.com/us/dalaran/forgotten-prophets";
exports.wowAudit = wowAudit;

const argusGuide = "https://cdn.discordapp.com/attachments/231181456108421121/385163828121436180/677903.jpg";
exports.argusGuide = argusGuide;

const logsURL = "https://www.warcraftlogs.com/reports/";
exports.logsURL = logsURL;
const logsAPI = "https://www.warcraftlogs.com:443/v1/reports/guild/Forgotten%20Prophets/Dalaran/US?api_key="+keys.LOG_KEY;
exports.logsAPI = logsAPI;

const classNames = ["Warrior", "Paladin", "Hunter", "Rogue", "Priest", "Death Knight", "Shaman", "Mage", "Warlock", "Monk", "Druid", "Demon Hunter"];
exports.classNames = classNames;
const specNames = {
    //warrior
    'Scaleshard': 'Protection', 'Strom\'kar, the Warbreaker': 'Arms', 'Warswords of the Valarjar': 'Fury',
    //paladin
    'Oathseeker': 'Protection', 'Ashbringer': 'Retribution', 'The Silver Hand': 'Holy',
    //hunter
    'Thas\'dorah, Legacy of the Windrunners': 'Marksmanship', 'Talonclaw': 'Survival', 'Titanstrike': 'Beast Mastery',
    //rogue
    'The Kingslayers': 'Assassination', 'The Dreadblades': 'Outlaw', 'Fangs of the Devourer': 'Subtelty',
    //priest
    'T\'uure, Beacon of the Naaru': 'Holy', 'Light\'s Wrath': 'Discipline', 'Xal\'atath, Blade of the Black Empire': 'Shadow',
    //death knight
    'Maw of the Damned': 'Blood', 'Frostreaper': 'Frost', 'Apocalypse': 'Unholy',
    //shaman
    'The Fist of Ra-den': 'Elemental', 'Doomhammer': 'Enhancement', 'Sharas\'dal, Scepter of Tides': 'Restoration',
    //mage
    'Aluneth': 'Arcane', 'Felo\'melorn': 'Fire', 'Ebonchill': 'Frost',
    //warlock
    'Spine of Thal\'kiel': 'Demonology', 'Scepter of Sargeras': 'Destruction', 'Ulthalesh, the Deadwind Harvester': 'Affliction',
    //monk
    'Sheilun, Staff of the Mists': 'Mistweaver', 'Fists of the Heavens': 'Windwalker', 'Fu Zan, the Wanderer\'s Companion': 'Brewmaster',
    //druid
    'Fangs of Ashamane': 'Feral', 'Claws of Ursoc': 'Guardian', 'G\'Hanir, the Mother Tree': 'Restoration', 'Scythe of Elune': 'Balance',
    //demon hunter
    'Twinblades of the Deceiver': 'Havoc', 'Aldrachi Warblades': 'Vengeance'};
exports.specNames = specNames;