const request = require("request");
const keys = require('../keys');
const wowOauth = "https://us.battle.net/oauth/token";

exports.getAccessToken = function() {
    let options = {url: wowOauth,
        auth: {user:keys.wowClientId, password:keys.wowClientSecret},
        form: {grant_type: "client_credentials"},
        json: true};
    return new Promise(function(resolve, reject) {
        request.post(options, function(err, res, body) {
            if (!err) {resolve(body)}
            else {reject(err)}
        })
    })
};

exports.callEndpoint = async function(endpoint) {
    let options = {url: endpoint, json: true};
    return new Promise(function(resolve, reject) {
        request.get(options, function(err, res, body) {
            if (!err) {resolve(body)}
            else {reject(err)}
        })
    })
};

exports.callWowEndpoint = async function(endpoint) {
    let token = await getAccessToken(),
        headers = {'Authorization': 'Bearer ' + token.access_token},
        options = {url: endpoint, headers: headers, json: true};
    return new Promise(function(resolve, reject) {
        request.get(options, function(err, res, body) {
            if (!err) {resolve(body)}
            else {reject(err)}
        })
    })
};