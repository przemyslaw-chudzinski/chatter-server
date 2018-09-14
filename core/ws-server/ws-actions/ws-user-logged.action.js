const BaseAction = require('./ws-base.action');

class UserLoggedAction extends BaseAction {

    constructor() {
        super();
        this.actionName = this.actions.UserLogged;
        // this.init();
    }

    afterInit() {
        console.log('user logged in', this.server.connections.length);
        this.server.sendToAll(this._data());
    }

    _data() {
        const data = {
            action: this.actions.ContactStatusChanged,
            visibleContactsIds: this.server.connections.map(c => c.userId)
        };
        return JSON.stringify(data);
    }

}

module.exports = UserLoggedAction;