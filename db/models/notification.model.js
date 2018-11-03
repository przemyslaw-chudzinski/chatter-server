const ModelBase = require('./model-base');
const database = require('../../db');
const collections = require('../collections');

class NotificationModel extends ModelBase {
    constructor() {
        super();
    }

    /**
     * @desc It creates new notification
     * @param payload {authorId: string, message: string, recipientIds: array}
     * @returns {Promise<any>}
     */
    saveNotification(payload) {
        payload.createdAt = new Date();
        payload.read = false;
        payload.readAt = null;
        return new Promise((resolve, reject) => {
            database.dbDriver.openConnection((err, client, db) => {
                if (err) {
                    return NotificationModel.catchRejection(client, err, reject);
                }
                return this.insertOne(db, collections.NOTIFICATIONS, payload)
                    .then(result => NotificationModel.catchResolve(client, result, resolve))
                    .catch(err => NotificationModel.catchRejection(client, err, reject));
            });
        });
    }

    /**
     * @desc It returns logged user notifications
     * @param id
     * @returns {Promise<any>}
     */
    getNotifications(id) {
        const query = {
            recipientIds: {
                $elemMatch: {
                    $eq: id
                }
            }
        };
        return new Promise((resolve, reject) => {
            return database.dbDriver.openConnection((err, client, db) => {
                if (err) {
                    return NotificationModel.catchRejection(client, err, reject);
                }

                NotificationModel.find(db, collections.NOTIFICATIONS, query)
                    .then(result => NotificationModel.catchResolve(client, result, resolve))
                    .catch(err => NotificationModel.catchRejection(client, err, reject));
            });
        });
    }

    /**
     * @param id
     * @returns {Promise<any>}
     */
    countUnreadNotifications(id) {
        return new Promise((resolve, reject) => {
            return database.dbDriver.openConnection((err, client, db) => {
                if (err) {
                    return NotificationModel.catchRejection(client, err, reject);
                }

                const query = {
                    recipientIds: {
                        $elemMatch: {
                            $eq: id
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