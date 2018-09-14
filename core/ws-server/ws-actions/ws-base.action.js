const wsActions = require('../ws-server-actions');

class BaseAction {

    constructor() {
        this._server = null;
        this._event = null;
        this._actionName = null;
        this._actions = wsActions;
    }

    get actions() {
        return this._actions;
    }

    get event() {
        return this._event;
    }

    set event(event) {
        this._event = event;
    }

    get actionName() {
        return this._actionName;
    }

    set actionName(name) {
        this._actionName = name;
    }

    get server() {
        return this._server;
    }

    set server(server) {
        this._server = server;
    }

    init(event, server) {
        this.event = event;
        this.server = server;
        if (this.event && this.event.action === this.actionName) {
            console.log('init');
            this.afterInit();
        }
    }

    /**
     * @desc Override it
     */
    afterInit() {
        console.log('xyz')
    }

}

module.exports = BaseAction;