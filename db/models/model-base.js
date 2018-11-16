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
            db.collection(collectionName).count(query, (err, count) => ModelBase._callback(err, count, resolve, reject));
        });
    }

    /**
     * @param db
     * @param collectionName
     * @param query
     * @param filter
     * @param sort
     * @returns {Promise<any>}
     */
    static find(db, collectionName, query = {}, filter = null, sort = {}) {
        return new Promise((resolve, reject) => {
            if (filter) {
                filter = Object.assign({}, {take: 30, skip: 0}, filter);
                db.collection(collectionName)
                    .find(query, filter)
                    .limit(filter.take)
                    .skip(filter.skip)
                    .sort(sort)
                    .toArray((err, results) => ModelBase._callback(err, results, resolve, reject));
            } else {
                db.collection(collectionName)
                    .find(query)
                    .sort(sort)
                    .toArray((err, results) => ModelBase._callback(err, results, resolve, reject));
            }
        });
    }

    static _callback(err, data, resolve, reject, client = null) {
        if (err) {
            return ModelBase.catchRejection(client, err, reject);
        }
        ModelBase.catchResolve(client, data, resolve);
    }

    /**
     * @param db
     * @param collectionName
     * @param id
     * @returns {Promise<any>}
     */
    static findById(db, collectionName, id) {
        return new Promise((resolve, reject) => {
            db.collection(collectionName)
                .find({
                    _id: database.dbDriver.ObjectId(id)
                }).toArray((err, results) => ModelBase._callback(err, results[0], resolve, reject));
        });
    }

    /**
     * @param db
     * @param collectionName
     * @param query
     * @returns {Promise<any>}
     */
    static first(db, collectionName, query = {}) {
        return new Promise((resolve, reject) => {
            db.collection(collectionName)
                .find(query)
                .toArray((err, results) => ModelBase._callback(err, results[0], resolve, reject));
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
                .insertOne(data, query, (err, result) => ModelBase._callback(err, result.ops[0], resolve, reject));
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
                .findAndModify(query, {}, update, {new: true}, (err, result) => ModelBase._callback(err, result.value, resolve, reject));
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
                .updateMany(query, update, {}, (err, result) => ModelBase._callback(err, result.value, resolve, reject));
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