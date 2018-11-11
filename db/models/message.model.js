const database = require('../index');
const collections = require('../collections/index');
const ModelBase = require('./model-base');
const UserModel = require('./user.model');
const async = require('async');
const Collection = require('../../core/collection/collection');

class MessageModel extends ModelBase {
    constructor(message = {}) {
        super();
        this.content = message.content || null;
        this.recipientId = message.recipientId || null;
        this.read = message.read || false;
        this.readAt = message.readAt || null;
        this.createdAt = message.createdAt || new Date();
        this.updatedAt = message.updatedAt || null;
        this.authorId = message.authorId || null;
        this._id = message._id ? database.dbDriver.ObjectId(message._id) : null;
    }

    save() {
        return new Promise((resolve, reject) => {
            database.dbDriver.openConnection((err, client, db) => {
                if (err) {
                    return MessageModel.catchRejection(client, err, reject);
                }
                return this.insertOne(db, collections.MESSAGES, this)
                    .then(message => MessageModel.catchResolve(client, new MessageModel(message), resolve))
                    .catch(err => MessageModel.catchRejection(client, err, reject));
            });
        });
    }

    /**
     * @desc It returns all collection
     * @param authorId
     * @param recipientId
     * @returns {Promise<any>}
     */
    static all(authorId, recipientId) {
        const query = {
            $or: [{
                authorId,
                recipientId,
            }, {
                authorId: recipientId,
                recipientId: authorId
            }]
        };

        return new Promise((resolve, reject) => {
            return database.dbDriver.openConnection((err, client, db) => {
                if (err) {
                    return MessageModel.catchRejection(client, err, reject);
                }

                UserModel.find(db, collections.MESSAGES, query)
                    .then(messages => MessageModel.catchResolve(client, new Collection(messages, this), resolve))
                    .catch(err => MessageModel.catchRejection(client, err, reject));
            });
        });

    }

    /**
     * @param recipientId
     * @returns {Promise<any>}
     */
    static getUnreadMessages(recipientId) {
        return new Promise((resolve, reject) => {
            return database.dbDriver.openConnection((err, client, db) => {
                if (err) {
                    return MessageModel.catchRejection(client, err, reject);
                }

                const result = [];
                UserModel.all().then(usersCollection => {
                    usersCollection.length &&
                        async.each(usersCollection.items, (user, next) => {
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
                            return MessageModel.catchResolve(client, new Collection(result), resolve);
                        });
                    })
                    .catch(err => MessageModel.catchRejection(client, err, reject));
            });
        });
    }

    /**
     *
     * @param messageId
     * @returns {Promise<any>}
     */
    static getById(messageId) {
        return new Promise((resolve, reject) => {
            database.dbDriver.openConnection((err, client, db) => {
                if (err) {
                    return MessageModel.catchRejection(client, err, reject);
                }

                const query = {
                    _id: database.dbDriver.ObjectId(messageId)
                };

                return this.first(db, collections.MESSAGES, query)
                    .then(message => MessageModel.catchResolve(client, new MessageModel(message), resolve))
                    .catch(err => MessageModel.catchRejection(client, err, reject));

            });
        });
    }

    /**
     * @returns {Promise<any>}
     */
    update() {
        return new Promise((resolve, reject) => {
            database.dbDriver.openConnection((err, client, db) => {
                if (err) {
                    return MessageModel.catchRejection(client, err, reject);
                }
                this.updatedAt = new Date();
                return this.findAndModify(db, collections.MESSAGES, this)
                    .then(message => MessageModel.catchResolve(client, new MessageModel(message), resolve))
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

    /**
     * @desc It checks passed id belongs to message author
     * @param authorId
     * @returns {boolean}
     */
    isAuthor(authorId) {
        return this.authorId === authorId;
    }
}

module.exports = MessageModel;