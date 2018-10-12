const WebSocketServer = require('./ws-server');

let wsInstance = null;

const getInstance = () => wsInstance;

const createServer = () => {
    if (!wsInstance) {
        wsInstance = new WebSocketServer();
    }
    wsInstance.listen();
    return wsInstance;
};


module.exports = {
    getInstance,
    createServer
};