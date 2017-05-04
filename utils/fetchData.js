const request = require('request');
const fs = require('fs');
const props = require('./properties');

request.get({url:props.auctionApi}, function optionalCallback(err, httpResponse) {
    const auctionJson = JSON.parse(httpResponse.body).files[0].url;
    request.get({url:auctionJson}).pipe(fs.createWriteStream('../data/auctions.json'), function optionalCallback (err, result) {
        console.log(result);
    });
});