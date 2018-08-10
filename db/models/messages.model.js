const database = require('../index');
const collections = require('../collections/index');
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
                    return MessagesModel.catchRejection(client, err, reject);
                }
                this.insertOne(db, collections.MESSAGES, message)
                    .then(result => MessagesModel.catchResolve(client, result, resolve))
                    .catch(err => MessagesModel.catchRejection(client, err, reject));
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
                    return MessagesModel.catchRejection(client, err, reject);
                }

                this.find(db, collections.MESSAGES, query, filter)
                    .then(result => MessagesModel.catchResolve(client, result, resolve))
                    .catch(err => MessagesModel.catchRejection(client, err, reject));
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
                    return MessagesModel.catchRejection(client, err, reject);
                }

                const query = {
                    _id: database.dbDriver.ObjectId(id)
                };

                return this.first(db, collections.MESSAGES, query)
                    .then(result => MessagesModel.catchResolve(client, result, resolve))
                    .catch(err => MessagesModel.catchRejection(client, err, reject));

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
                    return MessagesModel.catchRejection(client, err, reject);
                }

                return this.findAndModify(db, collections.MESSAGES, message)
                    .then(result => MessagesModel.catchResolve(client, result, resolve))
                    .catch(err => MessagesModel.catchRejection(client, err, reject));
            });
        });
    }
}

module.exports = MessagesModel;