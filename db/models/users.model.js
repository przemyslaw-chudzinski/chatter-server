const database = require('../index');
const collections = require('../collections/index');
const ModelBase = require('./model-base');

class UsersModel extends ModelBase {
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
                    UsersModel.catchRejection(client, err, reject);
                }

                this.find(db, collections.USERS, query, filter)
                    .then(result => UsersModel.catchResolve(client, result, resolve))
                    .catch(err => UsersModel.catchRejection(client, err, reject));
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
                    UsersModel.catchRejection(client, err, reject);
                }
                this.findById(db, collections.USERS, userId)
                    .then(result => UsersModel.catchResolve(client, result, resolve))
                    .catch(err => UsersModel.catchRejection(client, err, reject));
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
                    UsersModel.catchRejection(client, err, reject);
                }
                const query = {
                    email: email
                };

                this.first(db, collections.USERS, query)
                    .then(result => UsersModel.catchResolve(client, result, resolve))
                    .catch(err => UsersModel.catchRejection(client, err, reject));
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
            database.dbDriver.openConnection((err, client, db) => {
                if (err) {
                    UsersModel.catchRejection(client, err, reject);
                }

                this.findAndModify(db, collections.USERS, user)
                    .then(result => UsersModel.catchResolve(client, result, resolve))
                    .catch(err => UsersModel.catchRejection(client, err, reject));
            });
        });
    }
}

module.exports = UsersModel;