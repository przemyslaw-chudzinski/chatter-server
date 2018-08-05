const database = require('../index');
const collections = require('../collections/index');
const ModelBase = require('./model-base');

class UsersModel extends ModelBase {
    getUsers(query = {}, filter = {}) {

        return new Promise((resolve, reject) => {
            database.dbDriver.openConnection((err, client, db) => {
                if (err) {
                    client.close();
                    return reject(err);
                }

                this.find(db, collections.USERS, query, filter)
                    .then(data => resolve(data))
                    .then(() => client.close())
                    .catch(() => client.close())
                    .catch(err => reject(err));
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
                this.findById(db, collections.USERS, userId)
                    .then(item => resolve(item))
                    .then(() => client.close())
                    .catch(() => client.close())
                    .catch(err => reject(err));
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

                this.first(db, collections.USERS, query)
                    .then(data => resolve(data))
                    .then(() => client.close())
                    .catch(() => client.close())
                    .catch(err => reject(err));
            });
        });
    }
}

module.exports = UsersModel;