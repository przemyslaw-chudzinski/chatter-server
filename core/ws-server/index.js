const WebSocketServer = require('./ws-server');

let wsInstance = null;

// const getInstance = () => wsInstance;

const getInstance = () => {
    if (!wsInstance) {
        wsInstance = new WebSocketServer();
    }
    return wsInstance;
};

// const registerActions = (actions) => {
//     wsInstance.register(actions);
//     return wsInstance;
// };

const listen = () => wsInstance.listen();

module.exports = {
    getInstance,
    // registerActions,
    listen
};