const database = require('../index');
const collections = require('../collections/index');
const ModelBase = require('./model-base');

class UserModel extends ModelBase {
    constructor() {
        super();
    }

    /**
     *
     * @param query
     * @param filter
     * @returns {Promise<any>}
     */
    getUsers(query = {}, filter = {}) {
        return new Promise((resolve, reject) => {
            database.dbDriver.openConnection((err, client, db) => {
                if (err) {
                    UserModel.catchRejection(client, err, reject);
                }

                UserModel.find(db, collections.USERS, query, filter)
                    .then(result => UserModel.catchResolve(client, result, resolve))
                    .catch(err => UserModel.catchRejection(client, err, reject));
            });
        });
    }

    /**
     * @param userId
     * @returns {Promise<any>}
     */
    getUserById(userId) {
        if (!userId) {
            throw new Error('userId is required parameter');
        }
        return new Promise((resolve, reject) => {
            database.dbDriver.openConnection((err, client, db) => {
                if (err) {
                    UserModel.catchRejection(client, err, reject);
                }
                this.findById(db, collections.USERS, userId)
                    .then(result => UserModel.catchResolve(client, result, resolve))
                    .catch(err => UserModel.catchRejection(client, err, reject));
            });
        });
    }

    /**
     * @param email
     * @returns {Promise<any>}
     */
    getUserByEmail(email) {
        return new Promise((resolve, reject) => {
            database.dbDriver.openConnection((err, client, db) => {
                if (err) {
                    UserModel.catchRejection(client, err, reject);
                }
                const query = {
                    email
                };

                this.first(db, collections.USERS, query)
                    .then(result => UserModel.catchResolve(client, result, resolve))
                    .catch(err => UserModel.catchRejection(client, err, reject));
            });
        });
    }

    /**
     * @param objectId
     * @param user
     * @returns {Promise<any>}
     */
    updateUser(user) {
        return new Promise((resolve, reject) => {
            user.updatedAt = new Date();
            database.dbDriver.openConnection((err, client, db) => {
                if (err) {
                    UserModel.catchRejection(client, err, reject);
                }

                this.findAndModify(db, collections.USERS, user)
                    .then(result => UserModel.catchResolve(client, result, resolve))
                    .catch(err => UserModel.catchRejection(client, err, reject));
            });
        });
    }
}

module.exports = UserModel;