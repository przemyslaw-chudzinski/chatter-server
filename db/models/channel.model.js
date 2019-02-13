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
        return new Promise((resolve, reject) => database.dbDriver.openConnection((err, client, db) => {
            if (err) return ChannelModel.catchRejection(client, err, reject);
            return this.insertOne(db, collections.CHANNELS, this)
                .then(channel => ChannelModel.catchResolve(client, new ChannelModel(channel), resolve))
                .catch(err => ChannelModel.catchRejection(client, err, reject));
        }));
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
                if (err) return ChannelModel.catchRejection(client, err, reject);
                ChannelModel.find(db, collections.CHANNELS, query)
                    .then(channels => ChannelModel.catchResolve(client, new Collection(channels, this), resolve))
                    .catch(err => ChannelModel.catchRejection(client, err, reject));
            });
        });
    }

    /**
     * @desc It returns single channel by id
     * @param channelId
     * @returns {Promise<any>}
     */
    static getById(channelId) {
        return new Promise((resolve, reject) => {
            database.dbDriver.openConnection((err, client, db) => {
                if (err) return ChannelModel.catchRejection(client, err, reject);
                return this.findById(db, collections.CHANNELS, channelId)
                    .then(channel => ChannelModel.catchResolve(client, new ChannelModel(channel), resolve))
                    .catch(err => ChannelModel.catchRejection(client, err, reject));
            });
        });
    }

    /**
     * @returns {Promise<any>}
     */
    update() {
        return new Promise((resolve, reject) => {
            database.dbDriver.openConnection((err, client, db) => {
                if (err) return ChannelModel.catchRejection(client, err, reject);
                this.updatedAt = new Date();
                return this.findAndModify(db, collections.CHANNELS, this)
                    .then(channel => ChannelModel.catchResolve(client, new ChannelModel(channel), resolve))
                    .catch(err => ChannelModel.catchRejection(client, err, reject));
            });
        });
    }

    /**
     * @returns {Promise<any>}
     */
    deleteById() {
        return new Promise((resolve, reject) => {
            database.dbDriver.openConnection((err, client, db) => {
                if (err) return ChannelModel.catchRejection(client, err, reject);
                this.deleteOneById(db, collections.CHANNELS, this._id)
                    .then(data => ChannelModel.catchResolve(client, data, resolve))
                    .catch(err => ChannelModel.catchRejection(client, err, reject));
            });
        });
    }

    /**
     * @param userId
     * @returns {Promise<any>}
     */
    acceptInvitation(userId) {
        return new Promise((resolve, reject) => {
            const members = [...this.members];
            const index = members.findIndex(m => !m.confirmed && m.memberId === userId);
            if (index !== -1) {
                members[index].confirmed = true;
                members[index].confirmedAt = new Date();
                this.members = members;
                return this.update()
                    .then(channel => resolve(new ChannelModel(channel)))
                    .catch(err => reject(err));
            }
            return reject({reason: "Member either confirmed nor does't exist"});
        });
    }
}

module.exports = ChannelModel;
