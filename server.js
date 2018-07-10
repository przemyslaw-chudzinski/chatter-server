const app = require('./app');
const serverConfig = require('./config/http-server/server-dev');
const WebSocketServer = require('./core/ws-server/ws-server');

app.listen(serverConfig.port, () => console.log('Http Server is running on http://localhost:' + serverConfig.port));

const server = new WebSocketServer();
server.listen();

module.exports = app;