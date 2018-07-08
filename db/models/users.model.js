const database = require('../../db/db');
const collections = require('../collections/collections');
const ModelBase = require('./model-base');

class UsersModel extends ModelBase {
    constructor(req, res) {
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
                        $ne: this.userId
                    }
                }).toArray((err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    return db.collection(collections.USERS).countDocuments((err, count) => {
                        if (err) {
                            return reject(err);
                        }

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
}

module.exports = UsersModel;