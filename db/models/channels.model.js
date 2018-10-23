const database = require('../index');
const collections = require('../collections/index');
const ModelBase = require('./model-base');

class ChannelsModel extends ModelBase {
    constructor() {
        super();
    }

    /**
     * @desc It creates a new channel
     * @param payload {name: string, members: array, authorId: string, createadAt: string}
     * @returns {Promise<any>}
     */
    saveChannel(payload) {
        return new Promise((resolve, reject) => {
            database.dbDriver.openConnection((err, client, db) => {
                if (err) {
                    return ChannelsModel.catchRejection(client, err, reject);
                }
                return this.insertOne(db, collections.CHANNELS, payload)
                    .then(result => ChannelsModel.catchResolve(client, result, resolve))
                    .catch(err => ChannelsModel.catchRejection(client, err, reject));
            });
        });
    }

    /**
     * @param id
     * @returns {Promise<any>}
     */
    getChannels(id) {
        const query = {
            members: {
                $elemMatch: {
                    memberId: {
                        $eq: id
                    },
                    confirmed: {
                        $eq: true
                    }
                }
            }
        };
        return new Promise((resolve, reject) => {
            database.dbDriver.openConnection((err, client, db) => {
                if (err) {
                    return ChannelsModel.catchRejection(client, err, reject);
                }
                this.find(db, collections.CHANNELS, query)
                    .then(result => ChannelsModel.catchResolve(client, result, resolve))
                    .catch(err => ChannelsModel.catchRejection(client, err, reject));
            });
        });
    }
}

module.exports = ChannelsModel;