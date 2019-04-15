const database = require('../index');
const collections = require('../collections/index');
const ModelBase = require('./model-base');
const Collection = require('../../core/collection/collection');

class UserModel extends ModelBase {
    constructor(user) {
        super();
        if (user) {
            this.firstName = user.firstName || null;
            this.lastName = user.lastName || null;
            this.email = user.email || null;
            this.password = user.password || null;
            this.createdAt = user.createdAt || new Date();
            this.updatedAt = user.updatedAt || null;
            this.confirmed = user.confirmed || false;
            this.avatar = user.avatar || null;
            this._id = user._id ? database.dbDriver.ObjectId(user._id) : null;
        }
    }

    /**
     * @desc It returns collection without logged user
     * @param loggedUserId
     * @returns {Promise<any>}
     */
    static all(loggedUserId) {
        const query = {
            _id: {
                $ne: database.dbDriver.ObjectId(loggedUserId)
            }
        };
        return new Promise((resolve, reject) => {
            database.dbDriver.openConnection((err, client, db) => {
                if (err) return UserModel.catchRejection(client, err, reject);
                UserModel.find(db, collections.USERS, query)
                    .then(users => UserModel.catchResolve(client, new Collection(users, this), resolve))
                    .catch(err => UserModel.catchRejection(client, err, reject));
            });
        });
    }

    /**
     * @param userId
     * @returns {Promise<any>}
     */
    static getById(userId) {
        if (!userId) throw new Error('userId is required parameter');
        return new Promise((resolve, reject) => {
            database.dbDriver.openConnection((err, client, db) => {
                if (err) return UserModel.catchRejection(client, err, reject);
                UserModel.findById(db, collections.USERS, userId)
                    .then(user => UserModel.catchResolve(client, new UserModel(user), resolve))
                    .catch(err => UserModel.catchRejection(client, err, reject));
            });
        });
    }

    /**
     * @param email
     * @returns {Promise<any>}
     */
    static getByEmail(email) {
        return new Promise((resolve, reject) => {
            database.dbDriver.openConnection((err, client, db) => {
                if (err) return UserModel.catchRejection(client, err, reject);
                const query = {email};
                this.first(db, collections.USERS, query)
                    .then(user => UserModel.catchResolve(client, new UserModel(user), resolve))
                    .catch(err => UserModel.catchRejection(client, err, reject));
            });
        });
    }

    /**
     * @param objectId
     * @param user
     * @returns {Promise<any>}
     */
    update() {
        return new Promise((resolve, reject) => {
            this.updatedAt = new Date();
            database.dbDriver.openConnection((err, client, db) => {
                if (err) return UserModel.catchRejection(client, err, reject);
                this.findAndModify(db, collections.USERS, this)
                    .then(() => UserModel.catchResolve(client, this, resolve))
                    .catch(err => UserModel.catchRejection(client, err, reject));
            });
        });
    }
}

module.exports = UserModel;
