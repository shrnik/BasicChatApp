'use strict';

const express = require('express');
const app = express();
const chatApp = require('./app');

app.set('port',process.env.PORT||3000);
app.use(express.static('public'));//for loading static parts from public folder
app.set('view engine','ejs');

app.use('/',chatApp.router);

app.listen(app.get('port'),()=>{
    console.log('ChatApp running at Port:',app.get('port'));
});
