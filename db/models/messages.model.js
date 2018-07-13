const database = require('../../db/db');
const collections = require('../collections/collections');
const ModelBase = require('./model-base');

class MessagesModel extends ModelBase {
    constructor(req = null, res = null) {
        super(req, res);
    }

    saveMessage(message) {
        return new Promise((resolve, reject) => {
            return database.dbDriver.openConncetion(this._req, this._req, (client, db) => {
                return db.collection(collections.MESSAGES).insertOne(message, (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve();
                });
            });
        });
    }
}

module.exports = MessagesModel;