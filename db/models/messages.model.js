const database = require('../../db/db');
const collections = require('../collections/collections');
const ModelBase = require('./model-base');

class MessagesModel extends ModelBase {
    constructor() {
        super();
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

    getMessages(userLoggedId, recipientId) {
        if (!recipientId) {
            throw new Error('recipientId is required');
        }
        if (!userLoggedId) {
            throw new Error('user is not logged');
        }
        return new Promise((resolve, reject) => {
            return database.dbDriver.openConncetion((err, client, db) => {
                if (err) {
                    client.close();
                    return reject(err);
                }
                const query = {
                    $or: [{
                        authorId: userLoggedId,
                        recipientId: recipientId
                    }, {
                        authorId: recipientId,
                        recipientId: userLoggedId
                    }]
                };
                this.find(db, query, collections.MESSAGES).then(data => {
                    client.close();
                    resolve(data);
                }).catch(err => {
                    client.close();
                    reject(err);
                });
            });
        });
    }
}

module.exports = MessagesModel;