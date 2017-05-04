const MongoClient = require('mongodb').MongoClient;
const props = require('./properties');
const data = require('../data/auctions.json');

MongoClient.connect(props.mongodburl, function(err, db) {
    if (err) {console.log(err);
    } else {
        db.dropCollection("auctions", function(err, collection) {
            if (err) {console.log(err);}
        });
        for (let i = 0; i < data.auctions.length; i++) {
            db.collection("auctions").insertMany([data.auctions[i]], function(err, r) {
                if (err) {
                    db.close();
                } else {
                    //can i make this show me a successful number of rows added?
                    db.close();
                }
            });
        }
    }
});
