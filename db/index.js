const mongodb = require('mongodb');
const MongoDbDDriver = require('./drivers/mongodb/mongodb.driver');

module.exports = {
    dbDriver: new MongoDbDDriver(mongodb)
};