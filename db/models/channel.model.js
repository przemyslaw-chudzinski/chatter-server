const database = require('../index');
const collections = require('../collections/index');
const ModelBase = require('./model-base');

class ChannelModel extends ModelBase {
    constructor(name = null, members = [], authorId = null, createdAt = new Date(), updatedAt = null, _id = null) {
        super();
        this._id = _id;
        this.name = name;
        this.members = members;
        this.authorId = authorId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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
                    .then(result => ChannelModel.catchResolve(client, result, resolve))
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
                    .then(result => ChannelModel.catchResolve(client, result, resolve))
                    .catch(err => ChannelModel.catchRejection(client, err, reject));
            });
        });
    }
}

module.exports = ChannelModel;