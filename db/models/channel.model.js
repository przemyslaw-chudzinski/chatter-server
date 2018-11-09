const database = require('../index');
const collections = require('../collections/index');
const ModelBase = require('./model-base');
const Collection = require('../../core/collection/collection');

class ChannelModel extends ModelBase {
    constructor(channel = {}) {
        super();
        this._id = channel._id ? database.dbDriver.ObjectId(channel._id) : null;
        this.name = channel.name || null;
        this.members = channel.members || [];
        this.authorId = channel.authorId || null;
        this.createdAt = channel.createdAt || null;
        this.updatedAt = channel.updatedAt || null;
    }

    /**
     * @desc It creates a new channel
     * @returns {Promise<any>}
     */
    save() {
        return new Promise((resolve, reject) => {
            database.dbDriver.openConnection((err, client, db) => {
                if (err) {
                    return ChannelModel.catchRejection(client, err, reject);
                }
                return this.insertOne(db, collections.CHANNELS, this)
                    .then(channel => ChannelModel.catchResolve(client, new ChannelModel(channel), resolve))
                    .catch(err => ChannelModel.catchRejection(client, err, reject));
            });
        });
    }

    /**
     * @desc It returns all channels
     * @param loggedUserId
     * @returns {Promise<any>}
     */
    static all(loggedUserId) {
        const query = {
            members: {
                $elemMatch: {
                    memberId: {
                        $eq: loggedUserId
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
                    return ChannelModel.catchRejection(client, err, reject);
                }
                ChannelModel.find(db, collections.CHANNELS, query)
                    .then(channels => ChannelModel.catchResolve(client, new Collection(channels, this), resolve))
                    .catch(err => ChannelModel.catchRejection(client, err, reject));
            });
        });
    }
}

module.exports = ChannelModel;