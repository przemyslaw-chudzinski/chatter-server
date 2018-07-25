const database = require('../../db/db');
class ModelBase {

    /**
     * @param db
     * @param collectionName
     * @param query
     * @returns {Promise<any>}
     */
    count(db, collectionName, query = {}) {
        return new Promise((resolve, reject) => {
            db.collection(collectionName).count(query, (err, count) => {
                if (err) {
                    return reject(err);
                }
                resolve(count);
            });
        });
    }

    /**
     * @param db
     * @param collectionName
     * @param query
     * @param filter
     * @returns {Promise<any>}
     */
    find(db, collectionName, query = {}, filter = {}) {
        return new Promise((resolve, reject) => {
            db.collection(collectionName).find(query, filter).toArray((err, results) => {
                if (err) {
                    return reject(err);
                }
                this.count(db, collectionName, query).then(count => resolve({
                    results,
                    results_count: count
                })).catch(err => reject(err));
            });
        });
    }

    /**
     * @param db
     * @param collectionName
     * @param id
     * @returns {Promise<any>}
     */
    findById(db, collectionName, id) {
        return new Promise((resolve, reject) => {
            db.collection(collectionName).find({
                _id: database.dbDriver.ObjectId(id)
            }).toArray((err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results[0]);
            });
        });
    }

    /**
     * @param db
     * @param collectionName
     * @param query
     * @returns {Promise<any>}
     */
    first(db, collectionName, query = {}) {
        return new Promise((resolve, reject) => {
            db.collection(collectionName).find(query).toArray((err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results[0]);
            });
        });
    }

    /**
     * @param db
     * @param collectionName
     * @param data
     * @param query
     * @returns {Promise<any>}
     */
    insertOne(db, collectionName, data, query = {}) {
        return new Promise((resolve, reject) => {
            db.collection(collectionName).insertOne(data, query, (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve(result);
            });
        });
    }

    findAndModify(db, collectionName, data, query = null, update = null) {
        return new Promise((resolve, reject) => {

            query = query || {_id: database.dbDriver.ObjectId(data._id)};

            update = update || {$set: data};

            delete message._id;

            db.collection(collectionName).findAndModify(query, {}, update, {new: true}, (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve(result);
            });
        });
    }

    static catchRejection(client, err = null, next) {
        client && client.close();
        typeof next === 'function' && next(err);
    }

    static catchResolve(client, data = null, next) {
        client && client.close();
        typeof next === 'function' && next(data);
    }

}

module.exports = ModelBase;