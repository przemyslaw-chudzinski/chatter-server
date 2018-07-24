const database = require('../../db/db');
const collections = require('../collections/collections');
const ModelBase = require('./model-base');

class MessagesModel extends ModelBase {
    constructor() {
        super();
    }

    saveMessage(message) {
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

    getMessages(query = {}, filter = {}) {

        return new Promise((resolve, reject) => {
            return database.dbDriver.openConnection((err, client, db) => {
                if (err) {
                    client.close();
                    return reject(err);
                }

                this.find(db, collections.MESSAGES, query, filter).then(data => {
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