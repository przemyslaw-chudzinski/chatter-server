const database = require('../../db/db');
class ModelBase {

    count(db, query, collectionName) {
        return new Promise((resolve, reject) => {
            db.collection(collectionName).count(query, (err, count) => {
                if (err) {
                    return reject(err);
                }
                resolve(count);
            });
        });
    }

    find(db, query, collectionName) {
        return new Promise((resolve, reject) => {
            db.collection(collectionName).find(query).toArray((err, results) => {
                if (err) {
                    return reject(err);
                }
                this.count(db, query, collectionName).then(count => {
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

}

module.exports = ModelBase;