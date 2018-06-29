'use strict';

const express = require('express');
const app = express();
const chatApp = require('./app');
const passport = require('passport');

app.set('port',process.env.PORT||3000);
app.use(express.static('public'));//for loading static parts from public folder
app.set('view engine','ejs');

app.use(chatApp.session);
app.use(passport.initialize());
app.use(passport.session());
app.use('/',chatApp.router);

chatApp.ioServer(app).listen(app.get('port'),()=>{
    console.log('ChatApp running at Port:',app.get('port'));
});
