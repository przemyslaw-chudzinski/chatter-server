const ModelBase = require('./model-base');
const database = require('../../db/db');
const collections = require('../collections/collections');

class NotificationsModel extends ModelBase {
    constructor() {
        super();
    }

    saveNotification(recipientId, content) {
        return new Promise((resolve, reject) => {
            if (err) {
                client.close();
                return reject(err);
            }
            // insert item to db
        });
    }

    getNotifications(recipientId) {
        return new Promise((resolve, reject) => {
            database.dbDriver.openConnection((err, client, db) => {
                if (err) {
                    client.close();
                    return reject(err);
                }
                const query = {
                    recipientId
                };
                this.find(db, collections.NOTIFICATIONS, query).then(data => {
                    client.close();
                    resolve(data);
                }).catch(err => {
                    client.close();
                    reject(err);
                });
            });
        });
    }

    // markAsRead(notificationId) {

    // }
}

module.exports = NotificationsModel;