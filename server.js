const app = require('./app');
const serverConfig = require('./config/http-server/server-dev');
const ws = require('nodejs-websocket');

app.listen(serverConfig.port, () => console.log('Http Server is running on http://localhost:' + serverConfig.port));

const serverWs = ws.createServer(conn => {

    conn.on('text', event => {

        event = JSON.parse(event);

        console.log('action', event.action);

        conn.userId = event.userId;

        if (event.action === 'USER_LOGGED') {
            //send to all clients that new user has joined
            // refactor it
            const data = JSON.stringify({
                action: 'CONTACT_STATUS_CHANGED',
                visibleContactsIds: serverWs.connections.map(c => c.userId)
            });
            serverWs.connections.forEach(c => {
                c.sendText(data)
            });

        }

        if (event.action === 'USER_LOGGED_OUT') {
            //send to all clients that new user has joined
            // refactor it
            const index = serverWs.connections.findIndex(c => c.userId === event.userId);
            if (index !== -1) {
                serverWs.connections.splice(index, 1);
            }
            const data = JSON.stringify({
                action: 'CONTACT_STATUS_CHANGED',
                visibleContactsIds: serverWs.connections.map(c => c.userId)
            });
            serverWs.connections.forEach(c => {
                c.sendText(data)
            });

        }

    });

    conn.on('close', event => {
        // refactor it
        const data = JSON.stringify({
            action: 'CONTACT_STATUS_CHANGED',
            contactId: conn.userId,
            visible: true,
            visibleContactsIds: serverWs.connections.map(c => c.userId)
        });
        serverWs.connections.forEach(c => {
            c.sendText(data)
        });
    });

    conn.on('error', event => {});

}).listen(8000, 'localhost', () => {
    console.log('Websocket Server is running on ws://localhost:8000');
});

module.exports = app;