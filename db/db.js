const mongodb = require('mongodb');
const MongoDbDDriver = require('./drivers/mongodb/mongodb.driver');

module.exports = {
    dbDriver: new MongoDbDDriver(mongodb, {
        dbName: 'chatter_db',
        host: 'localhost',
        port: 27017
    })
};