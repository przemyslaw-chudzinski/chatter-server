const database = require('../index');
const collections = require('../collections/index');
const ModelBase = require('./model-base');
const UsersModel = require('./user.model');
const async = require('async');

class MessageModel extends ModelBase {
    constructor() {
        super();
        this._usersModel = new UsersModel();
    }

    /**
     * @param message
     * @returns {Promise<any>}
     */
    saveMessage(message) {
        message.createdAt = new Date();
        message.updatedAt = null;
        return new Promise((resolve, reject) => {
            database.dbDriver.openConnection((err, client, db) => {
                if (err) {
                    return MessageModel.catchRejection(client, err, reject);
                }
                return this.insertOne(db, collections.MESSAGES, message)
                    .then(result => MessageModel.catchResolve(client, result, resolve))
                    .catch(err => MessageModel.catchRejection(client, err, reject));
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
                    return MessageModel.catchRejection(client, err, reject);
                }

                this.find(db, collections.MESSAGES, query, filter)
                    .then(result => MessageModel.catchResolve(client, result, resolve))
                    .catch(err => MessageModel.catchRejection(client, err, reject));
            });
        });
    }

    /**
     * @param recipientId
     * @returns {Promise<any>}
     */
    getUnreadMessages(recipientId) {
        return new Promise((resolve, reject) => {
            return database.dbDriver.openConnection((err, client, db) => {
                if (err) {
                    return MessageModel.catchRejection(client, err, reject);
                }

                const result = [];
                this._usersModel
                    .getUsers()
                    .then(data => {
                        data &&
                        async.each(data.results, (user, next) => {
                            user._id = user._id.toString();
                            const query = {
                                recipientId,
                                read: false,
                                authorId: user._id
                            };
                            if (user._id !== recipientId) {
                                this
                                    .count(db, collections.MESSAGES, query)
                                    .then(count => {
                                        const res = {
                                            authorId: user._id,
                                            count
                                        };
                                        result.push(res);
                                        next();
                                    })
                                    .catch(err => MessageModel.catchRejection(client, err, reject));
                            } else {
                                next();
                            }
                        }, err => {
                            if (err) {
                                return reject(err);
                            }
                            return resolve(result);
                        });
                    })
                    .catch(err => MessageModel.catchRejection(client, err, reject));
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
                    return MessageModel.catchRejection(client, err, reject);
                }

                const query = {
                    _id: database.dbDriver.ObjectId(id)
                };

                return this.first(db, collections.MESSAGES, query)
                    .then(result => MessageModel.catchResolve(client, result, resolve))
                    .catch(err => MessageModel.catchRejection(client, err, reject));

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
                    return MessageModel.catchRejection(client, err, reject);
                }
                message.updatedAt = new Date();
                return this.findAndModify(db, collections.MESSAGES, message)
                    .then(result => MessageModel.catchResolve(client, result, resolve))
                    .catch(err => MessageModel.catchRejection(client, err, reject));
            });
        });
    }

    /**
     * @param contactId
     * @returns {Promise<any>}
     */
    resetUnreadMessages(contactId) {
        return new Promise((resolve, reject) => {
            database.dbDriver.openConnection((err, client, db) => {
                if (err) {
                    return MessageModel.catchRejection(client, err, reject);
                }

                const payload = {
                    read: true,
                    readAt: new Date()
                };

                const query = {
                    authorId: contactId.toString()
                };

                return this
                    .updateMany(db, collections.MESSAGES, payload, query)
                    .then(result => MessageModel.catchResolve(client, result, resolve))
                    .catch(err => MessageModel.catchRejection(client, err, reject));
            });
        });
    }
}

module.exports = MessageModel;