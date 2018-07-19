const database = require('../../db/db');
const collections = require('../collections/collections');
const ModelBase = require('./model-base');

class UsersModel extends ModelBase {
    getUsers(loggedUserId) {
        if (!loggedUserId) {
            throw new Error('loggedUserId is required parameter');
        }
        return new Promise((resolve, reject) => {
            database.dbDriver.openConnection((err, client, db) => {
                if (err) {
                    client.close();
                    return reject(err);
                }
                const query = {
                    _id: {
                        $ne: database.dbDriver.ObjectId(loggedUserId)
                    }
                };
                this.find(db, collections.USERS, query).then(data => {
                    client.close();
                    resolve(data);
                }).catch(err => {
                    client.close();
                    reject(err);
                });
            });
        });
    }

    getUserById(userId) {
        if (!userId) {
            throw new Error('userId is required parameter');
        }
        return new Promise((resolve, reject) => {
            database.dbDriver.openConnection((err, client, db) => {
                if (err) {
                    client.close();
                    return reject(err);
                }
                this.findById(db, collections.USERS, userId).then(item => {
                    client.close();
                    resolve(item);
                }).catch(err => {
                    client.close();
                    reject(err);
                });
            });
        });
    }

    getUserByEmail(email) {
        return new Promise((resolve, reject) => {
            database.dbDriver.openConnection((err, client, db) => {
                if (err) {
                    client.close();
                    reject(err);
                }
                const query = {
                    email: email
                };
                this.first(db, collections.USERS, query).then(data => {
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

module.exports = UsersModel;