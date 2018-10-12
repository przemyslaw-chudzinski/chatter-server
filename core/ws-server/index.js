const WebSocketServer = require('./ws-server');

let wsInstance = null;

const getInstance = () => {
    if (!wsInstance) {
        wsInstance = new WebSocketServer();
    }
    return wsInstance;
};

const listen = () => wsInstance.listen();

module.exports = {
    getInstance,
    listen
};