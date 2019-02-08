class MongoDbDriver {

    constructor(mongodb) {
        this._mongodb = mongodb;
        this._client = this._mongodb.MongoClient;
    }

    openConnection(next) {
        this._client.connect(process.env.DB_URL, {seNewUrlParser: true}, (err, client) => err ? next(err, client, false) : next(false, client, client.db()));
    }

    ObjectId(_id) {
        return this._mongodb.ObjectId(_id);
    }
}

module.exports = MongoDbDriver;
