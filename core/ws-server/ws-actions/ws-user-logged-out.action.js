const BaseAction = require('./ws-base.action');

class UserLoggedOutAction extends BaseAction {

    constructor() {
        super();
        this.actionName = this.actions.UserLoggedOut;
        // this.init();
    }

    afterInit() {
        const index = this._server.connections.findIndex(c => c.userId === this.event.userId);
        if (index !== -1) {
            this.server.connections.splice(index, 1);
        }
        // const _connections = this.server.connections && this.server.connections.filter(conn => conn.userId !== this.event.userId);
        // this.server.connections = _connections;
        this.server.sendToAll(this._data());
        console.log('user logged out!!!', this.server.connections.length);
    }

    _data() {
        const data = {
            action: this.actions.ContactStatusChanged,
            visibleContactsIds: this.server.connections.map(c => c.userId)
        };
        return JSON.stringify(data);
    }

}

module.exports = UserLoggedOutAction;