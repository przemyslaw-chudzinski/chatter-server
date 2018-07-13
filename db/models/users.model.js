const database = require('../../db/db');
const collections = require('../collections/collections');
const ModelBase = require('./model-base');

class UsersModel extends ModelBase {
    constructor(req = null, res = null) {
        super(req, res);
    }

    /**
     * @desc It gets users from database
     */
    getUsers(options = {}) {
        return new Promise((resolve, reject) => {
            return database.dbDriver.openConncetion(this._req, this._res, (client, db) => {
                return db.collection(collections.USERS).find({
                    _id: {
                        $ne: this.loggedUserObjectId
                    }
                }).toArray((err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    return db.collection(collections.USERS).countDocuments((err, count) => {
                        if (err) {
                            return reject(err);
                        }

                        client.close();

                        return resolve({
                            results: results.map(result => {
                                delete result.password;
                                return result;
                            }),
                            results_number: count
                        });
                    });
                });
            });
        });
    }

    /**
     * @desc It gets user by id from database
     * @param {string} userId
     */
    getUserById(userId) {
        if (!userId) {
            throw new Error('userId is required');
        }
        return new Promise((resolve, reject) => {
            return database.dbDriver.openConncetion(this._req, this._res, (client, db) => {
                return db.collection(collections.USERS).find({
                    _id: database.dbDriver.ObjectId(userId)
                }).toArray((err, results) => {
                    if (err) {
                        return reject(err);
                    }

                    client.close();

                    delete results[0].password;
                    delete results[0].active;
                    delete results[0].createdAt;
                    delete results[0].updatedAt;

                    return resolve(results[0]);
                });
            });
        });
    }
}

module.exports = UsersModel;