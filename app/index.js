'use strict';
//Social Authentication
require('./auth')();

//IO server

let ioServer = (app,credentials)=>{
    app.locals.chatrooms = [];
    const server = require('https').Server(credentials,app);
    const io  = require('socket.io')(server);
    io.use((socket,next)=>{
        require('./session')(socket.request,{},next);
    });
    require('./socket')(io,app);
    return server;
}

module.exports = {
    router:require('./routes')(),
    session:require('./session'),
    ioServer,
}