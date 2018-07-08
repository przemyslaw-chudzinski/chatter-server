const database = require('../../db/db');
const collections = require('../collections/collections');
const Jwt = require('../../core/jwt/jwt');

class UsersModel {
    constructor(req, res) {
        this._req = req;
        this._res = res;
        this._jwt = new Jwt;
    }

    /**
     * @desc It gets users from database
     */
    getUsers(options = {}) {
        const token = this._req.headers.authorization.split(' ')[1];
        const decodedToken = this._jwt.decode(token);
        const userId = database.dbDriver.ObjectId(decodedToken.user._id);
        return new Promise((resolve, reject) => {
            return database.dbDriver.openConncetion(this._req, this._res, (client, db) => {
                return db.collection(collections.USERS).find({
                    _id: {
                        $ne: userId
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