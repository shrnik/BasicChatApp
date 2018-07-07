'use strict';
const fs = require( 'fs' );

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

const privateKey = fs.readFileSync('./key.pem');
const certificate = fs.readFileSync('./cert.pem');
const credentials = {key: privateKey, cert: certificate,requestCert: false,
    rejectUnauthorized: false};

chatApp.ioServer(app,credentials).listen(app.get('port'),()=>{
    console.log('ChatApp running at Port:',app.get('port'));
});
