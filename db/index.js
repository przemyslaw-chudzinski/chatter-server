const mongodb = require('mongodb');
const MongoDbDDriver = require('./drivers/mongodb/mongodb.driver');

module.exports = {
    dbDriver: new MongoDbDDriver(mongodb, {
        dbName: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT
    })
};