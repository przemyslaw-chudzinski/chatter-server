const EventEmitter = require('events');
const mongoDbEvents = require('./mongodb.events');

class MongoDbDDriver {
    get config() {
        return this._config;
    }

    get dbUrl() {
        return this._dbUrl;
    }

    constructor(mongodb, config) {
        this._prepareDefaultConfig();
        this._mongodb = mongodb;
        this._client = this._mongodb.MongoClient;
        this._eventEmitter = new EventEmitter();
        this._prepareConfig(config);
        this._validateConfig();
    }

    _prepareDefaultConfig() {
        this._defaultConfig = {
            dbName: null,
            host: 'localhost',
            port: 27017
        };
    }

    _prepareConfig(config = {}) {
        this._config = Object.assign({}, this._defaultConfig, config);
        this._dbUrl = `mongodb://${this._config.host}:${this._config.port}/${this._config.dbName}`;
    }

    _validateConfig() {
        if (typeof this._config.host === 'undefined' || this._config.host === null || this._config.host === '') {
            throw new Error('Host is required parameter');
        }

        if (typeof this._config.dbName === 'undefined' || this._config.dbName === null || this._config.dbName === '') {
            throw new Error('Database name is required parameter');
        }

        if (typeof this._config.port === 'undefined' || this._config.port === null || this._config.port === '') {
            throw new Error('Port is required parameter');
        }
    }

    openConnection(next) {
        this._client.connect(this._dbUrl, {
            useNewUrlParser: true
        }, (err, client) => {
            if (err) {
                return next(err, client, false);
            }
            const db = client.db(this._config.dbName);
            return next(false, client, db);
        });
    }

    ObjectId(_id) {
        return this._mongodb.ObjectId(_id);
    }
}

module.exports = MongoDbDDriver;