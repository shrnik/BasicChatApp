'use strict';
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const config = require('../config');
const db = require('../db');

if(process.env.NODE_ENV === 'production') {
    // Initialize session with settings for production
    module.exports = session({
        secret: config.sessionSecret,
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({
            mongooseConnection: db.mongoose.connection
        })
    });
} else {
    // Initialize session with settings for dev
    module.exports = session({
        secret: config.sessionSecret,
        resave: false,
        saveUninitialized: true
    });
}