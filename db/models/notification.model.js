const ModelBase = require('./model-base');
const database = require('../../db');
const collections = require('../collections');
const Collection = require('../../core/collection/collection');
const async = require('async');

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
        this.extra = notification.extra || {};
        this._id = notification._id ? database.dbDriver.ObjectId(notification._id) : null;
    }

    save() {
        return new Promise((resolve, reject) => database.dbDriver.openConnection((err, client, db) => {
            if (err) return NotificationModel.catchRejection(client, err, reject);
            return this.insertOne(db, collections.NOTIFICATIONS, this)
                .then(notifications => NotificationModel.catchResolve(client, new NotificationModel(notifications), resolve))
                .catch(err => NotificationModel.catchRejection(client, err, reject));
        }));
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

        const sort = {createdAt: -1};
        return new Promise((resolve, reject) => {
            return database.dbDriver.openConnection((err, client, db) => {
                if (err) return NotificationModel.catchRejection(client, err, reject);
                NotificationModel.find(db, collections.NOTIFICATIONS, query, null, sort)
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
                if (err) return NotificationModel.catchRejection(client, err, reject);
                const query = {
                    $and: [
                        {
                            recipientIds: {
                                $elemMatch: {
                                    $eq: loggedUserId,
                                }
                            }},
                        {
                            read: {
                                $eq: false
                            }
                        }
                    ]
                };
                return NotificationModel.count(db, collections.NOTIFICATIONS, query)
                    .then(result => NotificationModel.catchResolve(client, result, resolve))
                    .catch(err => NotificationModel.catchRejection(client, err, reject));
            });
        });
    }

    /**
     * @desc It returns single notification by id
     * @param notificationId
     * @returns {Promise<any>}
     */
    static getById(notificationId) {
        return new Promise((resolve, reject) => {
            database.dbDriver.openConnection((err, client, db) => {
                if (err) return NotificationModel.catchRejection(client, err, reject);
                return this.findById(db, collections.NOTIFICATIONS, notificationId)
                    .then(channel => NotificationModel.catchResolve(client, new NotificationModel(channel), resolve))
                    .catch(err => NotificationModel.catchRejection(client, err, reject));
            });
        });
    }

    /**
     * @desc It updated single notification model
     * @returns {Promise<any>}
     */
    update() {
        return new Promise((resolve, reject) => {
            database.dbDriver.openConnection((err, client, db) => {
                if (err) return NotificationModel.catchRejection(client, err, reject);
                this.updatedAt = new Date();
                return this.findAndModify(db, collections.NOTIFICATIONS, this)
                    .then(notification => NotificationModel.catchResolve(client, new NotificationModel(notification), resolve))
                    .catch(err => NotificationModel.catchRejection(client, err, reject));
            });
        });
    }

//     static markAsRead(userId) {
//         if (!userId) throw new Error('userId is required parameter');
//         return new Promise((resolve, reject) => {
//             database.dbDriver.openConnection(async (err, client, db) => {
//                 if (err) return NotificationModel.catchRejection(client, err, reject);
//                 const notifications = await NotificationModel.all(userId);
//                 async.each(notifications, function (notification, next) {
//
//                 }, function () {
//                     resolve();
//                 });
//             });
//         });
//     }
}

module.exports = NotificationModel;
