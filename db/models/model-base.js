const database = require('../../db/db');
class ModelBase {

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

    find(db, collectionName, query = {}) {
        return new Promise((resolve, reject) => {
            db.collection(collectionName).find(query).toArray((err, results) => {
                if (err) {
                    return reject(err);
                }
                this.count(db, collectionName, query).then(count => {
                    resolve({
                        results,
                        results_count: count
                    });
                }).catch(err => {
                    reject(err)
                });
            });
        });
    }

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

}

module.exports = ModelBase;