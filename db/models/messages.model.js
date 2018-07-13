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

    getMessages(recipientId) {
        if (!recipientId) {
            throw new Error('recipientId is required');
        }
        if (!this.loggedUserId) {
            throw new Error('user is not logged');
        }
        return new Promise((resolve, reject) => {
            return database.dbDriver.openConncetion(this._req, this._res, (client, db) => {
                const query = {
                    $or: [{
                        authorId: this.loggedUserId,
                        recipientId: recipientId
                    }, {
                        authorId: recipientId,
                        recipientId: this.loggedUserId
                    }]
                };

                db.collection(collections.MESSAGES).find(query).toArray((err, results) => {
                    if (err) {
                        client.close();
                        return reject(err);
                    }
                    db.collection(collections.MESSAGES).count(query, (err, count) => {
                        if (err) {
                            client.close();
                            return reject(err);
                        }
                        client.close();
                        return resolve({
                            results: results,
                            results_count: count
                        });
                    });
                });
            });
        });
    }
}

module.exports = MessagesModel;