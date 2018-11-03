const database = require('../index');
class ModelBase {

    /**
     * @param db
     * @param collectionName
     * @param query
     * @returns {Promise<any>}
     */
    static count(db, collectionName, query = {}) {
        return new Promise((resolve, reject) => {
            db.collection(collectionName).count(query, (err, count) => {
                if (err) {
                    return ModelBase.catchRejection(null, err, reject);
                }
                return ModelBase.catchResolve(null, count, resolve);
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
    static find(db, collectionName, query = {}, filter = {}) {
        return new Promise((resolve, reject) => {
            db.collection(collectionName)
                .find(query, filter)
                .toArray((err, results) => {
                    if (err) {
                        return ModelBase.catchRejection(null, err, reject);
                    }
                    ModelBase.count(db, collectionName, query).then(count => ModelBase.catchResolve(null, {
                        results,
                        results_count: count
                    }, resolve)).catch(err => ModelBase.catchRejection(null, err, reject));
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
            db.collection(collectionName)
                .find({
                    _id: database.dbDriver.ObjectId(id)
                }).toArray((err, results) => {
                if (err) {
                    return ModelBase.catchRejection(null, err, reject);
                }
                return ModelBase.catchResolve(null, results[0], resolve);
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
            db.collection(collectionName)
                .find(query)
                .toArray((err, results) => {
                    if (err) {
                        return ModelBase.catchRejection(null, err, reject);
                    }
                    return ModelBase.catchResolve(null, results[0], resolve);
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
            db.collection(collectionName)
                .insertOne(data, query, (err, result) => {
                    if (err) {
                        return ModelBase.catchRejection(null, err, reject);
                    }
                    return ModelBase.catchResolve(null, result.ops[0], resolve);
                });
        });
    }

    /**
     * @param db
     * @param collectionName
     * @param data
     * @param query
     * @param update
     * @returns {Promise<any>}
     */
    findAndModify(db, collectionName, data, query = null, update = null) {
        return new Promise((resolve, reject) => {

            query = query || {_id: database.dbDriver.ObjectId(data._id)};

            delete data._id;

            update = update || {$set: data};

            db.collection(collectionName)
                .findAndModify(query, {}, update, {new: true}, (err, result) => {
                    if (err) {
                        return ModelBase.catchRejection(null, err, reject);
                    }
                    return ModelBase.catchResolve(null, result.value, resolve);
                });
        });
    }

    /**
     * @param db
     * @param collectionName
     * @param data
     * @param query
     * @param update
     * @returns {Promise<any>}
     */
    updateMany(db, collectionName, data, query = null, update = null) {
        return new Promise((resolve, reject) => {

            query = query || {};

            delete data._id;

            update = update || {$set: data};

            db.collection(collectionName)
                .updateMany(query, update, {}, (err, result) => {
                    if (err) {
                        return ModelBase.catchRejection(null, err, reject);
                    }
                    return ModelBase.catchResolve(null, result.value, resolve);
                });
        });
    }

    /**
     * @param client
     * @param err
     * @param next
     */
    static catchRejection(client = null, err = null, next = null) {
        client && client.close();
        typeof next === 'function' && next(err);
    }

    /**
     * @param client
     * @param data
     * @param next
     */
    static catchResolve(client = null, data = null, next = null) {
        client && client.close();
        typeof next === 'function' && next(data);
    }

}

module.exports = ModelBase;