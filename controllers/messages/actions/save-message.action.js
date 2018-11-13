const ActionBase = require('../../action-base');
const MessageModel = require('../../../db/models/message.model');

class SaveMessageAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this.auth = true;
    }

    action() {
        const newMessage = new MessageModel();
        newMessage.content = this.req.body.content;
        newMessage.authorId = this.loggedUserId;
        newMessage.recipientId = this.req.body.recipientId;
        newMessage.attachedFiles = this.req.body.attachedFiles;

        newMessage.save()
            .then(message => {
                this.res.status(200);
                        this.res.json(message);
                        this.wsServer.messageToContact(message);
            })
            .catch(err => this.simpleResponse('Internal server error', 500, err));
    }
}

module.exports = SaveMessageAction;