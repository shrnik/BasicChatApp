'use strict';
const session  = require('express-session');
const MongoStore = require('connect-mongo')(session);

if(process.env.NODE_ENV ==='production'){
    //Initialize session with prod settings
}else{
    //Initialize
}