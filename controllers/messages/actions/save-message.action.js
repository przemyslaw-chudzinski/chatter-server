const ActionBase = require('../../action-base');
const MessageModel = require('../../../db/models/message.model');

const _prepareMessage = Symbol();

class SaveMessageAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this.auth = true;
    }

    async action() {
        const messageModel = this[_prepareMessage]();
        try {
            const savedMessageModel = await messageModel.save();
            this.simpleResponse(null, 200, savedMessageModel);
            this.wsServer.messageToContact(savedMessageModel);
        } catch (e) {
            this.simpleResponse('Internal server error', 500);
        }
    }

    /**
     * @returns {MessageModel}
     */
    [_prepareMessage]() {
        const messageModel = new MessageModel();
        messageModel.content = this.req.body.content;
        messageModel.authorId = this.loggedUserId;
        messageModel.recipientId = this.req.body.recipientId;
        messageModel.attachedFiles = this.req.body.attachedFiles;
        return messageModel;
    }
}

module.exports = SaveMessageAction;
