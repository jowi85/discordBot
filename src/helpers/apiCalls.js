const request = require("request");

exports.getAccessToken = function(oauth, clientId, clientSecret) {
    let options = {url: oauth,
        auth: {user:clientId, password:clientSecret},
        form: {grant_type: "client_credentials"},
        json: true};
    return new Promise(function(resolve, reject) {
        request.post(options, function(err, res, body) {
            if (!err) {resolve(body)}
            else {reject(err)}
        })
    })
};

exports.callEndpointWithToken = async function(endpoint, oauth, clientId, clientSecret) {
    let token = await exports.getAccessToken(oauth, clientId, clientSecret),
        headers = {'Authorization': 'Bearer ' + token.access_token},
        options = {url: endpoint, headers: headers, body: {"query":"{reportData {reports(guildID: 268796, limit: 1) {data {code}}}}"}, json: true};
    return new Promise(function(resolve, reject) {
        request.post(options, function(err, res, body) {
            if (!err) {resolve(body)}
            else {reject(err)}
        })
    })
};