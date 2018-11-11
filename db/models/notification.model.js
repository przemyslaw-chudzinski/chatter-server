const ModelBase = require('./model-base');
const database = require('../../db');
const collections = require('../collections');
const Collection = require('../../core/collection/collection');

class NotificationModel extends ModelBase {
    constructor(notification = {}) {
        super();
        this.createdAt = notification.createdAt || new Date();
        this.updatedAt = notification.updatedAt || null;
        this.read = notification.read || false;
        this.readAt = notification.readAt || null;
        this.message = notification.message || null;
        this.recipientIds = notification.recipientIds || [];
        this.authorId = notification.authorId || null;
        this._id = notification._id ? database.dbDriver.ObjectId(notification._id) : null;
    }

    save() {
        return new Promise((resolve, reject) => {
            database.dbDriver.openConnection((err, client, db) => {
                if (err) {
                    return NotificationModel.catchRejection(client, err, reject);
                }
                return this.insertOne(db, collections.NOTIFICATIONS, this)
                    .then(notifications => NotificationModel.catchResolve(client, new NotificationModel(notifications), resolve))
                    .catch(err => NotificationModel.catchRejection(client, err, reject));
            });
        });
    }

    /**
     * @param loggedUserId
     * @returns {Promise<any>}
     */
    static all(loggedUserId) {
        const query = {
            recipientIds: {
                $elemMatch: {
                    $eq: loggedUserId
                }
            }
        };
        return new Promise((resolve, reject) => {
            return database.dbDriver.openConnection((err, client, db) => {
                if (err) {
                    return NotificationModel.catchRejection(client, err, reject);
                }

                NotificationModel.find(db, collections.NOTIFICATIONS, query)
                    .then(notifications => NotificationModel.catchResolve(client, new Collection(notifications, this), resolve))
                    .catch(err => NotificationModel.catchRejection(client, err, reject));
            });
        });
    }

    /**
     *
     * @param loggedUserId
     * @returns {Promise<any>}
     */
    static countUnreadNotifications(loggedUserId) {
        return new Promise((resolve, reject) => {
            return database.dbDriver.openConnection((err, client, db) => {
                if (err) {
                    return NotificationModel.catchRejection(client, err, reject);
                }

                const query = {
                    recipientIds: {
                        $elemMatch: {
                            $eq: loggedUserId
                        }
                    }
                };

                return NotificationModel.count(db, collections.NOTIFICATIONS, query)
                    .then(result => NotificationModel.catchResolve(client, result, resolve))
                    .catch(err => NotificationModel.catchRejection(client, err, reject));
            });
        });
    }
}

module.exports = NotificationModel;