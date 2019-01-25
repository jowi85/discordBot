const keys = require('./keys');

const wowAudit = "https://wowaudit.com/us/dalaran/forgotten-prophets";
exports.wowAudit = wowAudit;

const logsURL = "https://www.warcraftlogs.com/reports/";
exports.logsURL = logsURL;
const logsAPI = "https://www.warcraftlogs.com:443/v1/reports/guild/Forgotten%20Prophets/Dalaran/US?api_key="+keys.LOG_KEY;
exports.logsAPI = logsAPI;

const wowOauth = "https://us.battle.net/oauth/token";
exports.wowOauth = wowOauth;
const wowTokenEndpoint = "https://us.api.blizzard.com/data/wow/token/?namespace=dynamic-us";
exports.wowTokenEndpoint = wowTokenEndpoint;
