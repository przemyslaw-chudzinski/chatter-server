const database = require('../../db/db');
const collections = require('../collections/collections');
const ModelBase = require('./model-base');

class MessagesModel extends ModelBase {
    constructor() {
        super();
    }

    saveMessage(message) {
        console.log('save message', message);
        return new Promise((resolve, reject) => {
            database.dbDriver.openConnection((err, client, db) => {
                if (err) {
                    return reject(err);
                }
                this.insertOne(db, collections.MESSAGES, message).then(item => {
                    client.close();
                    resolve(item);
                }).catch(err => {
                    client.close();
                    reject(err);
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
            return database.dbDriver.openConnection((err, client, db) => {
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
                this.find(db, collections.MESSAGES, query).then(data => {
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