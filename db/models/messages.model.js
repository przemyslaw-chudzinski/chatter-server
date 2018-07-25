const database = require('../../db/db');
const collections = require('../collections/collections');
const ModelBase = require('./model-base');

class MessagesModel extends ModelBase {
    constructor() {
        super();
    }

    /**
     * @param message
     * @returns {Promise<any>}
     */
    saveMessage(message) {
        return new Promise((resolve, reject) => {
            database.dbDriver.openConnection((err, client, db) => {
                if (err) {
                    return reject(err);
                }
                this.insertOne(db, collections.MESSAGES, message)
                    .then(item => resolve(item))
                    .catch(err => reject(err))
                    .finally(() => client.close());
            });
        });
    }

    /**
     * @param query
     * @param filter
     * @returns {Promise<any>}
     */
    getMessages(query = {}, filter = {}) {
        return new Promise((resolve, reject) => {
            return database.dbDriver.openConnection((err, client, db) => {
                if (err) {
                    client.close();
                    return reject(err);
                }

                this.find(db, collections.MESSAGES, query, filter)
                    .then(data => resolve(data))
                    .then(() => client.close())
                    .catch(() => client.close())
                    .catch(err => reject(err));
            });
        });
    }

    /**
     * @param id
     * @returns {Promise<any>}
     */
    getMessageById(id) {
        return new Promise((resolve, reject) => {
            database.dbDriver.openConnection((err, client, db) => {
                if (err) {
                    client.close();
                    return reject(err);
                }

                const query = {
                    _id: database.dbDriver.ObjectId(id)
                };

                return this.first(db, collections.MESSAGES, query)
                    .then(result => resolve(result))
                    .catch(err => reject(err))
                    .then(() => client.close())
                    .catch(() => client.close());

            });
        });
    }

    /**
     * @param message
     * @returns {Promise<any>}
     */
    updateMessage(message) {
        return new Promise((resolve, reject) => {
            database.dbDriver.openConnection((err, client, db) => {
                if (err) {
                    client.close();
                    return reject(err);
                }

                return this.findAndModify(db, collections.MESSAGES, message)
                    .then(result => resolve(result))
                    .catch(err => reject(err))
                    .then(() => client.close())
                    .catch(() => client.close());

            });
        });
    }
}

module.exports = MessagesModel;