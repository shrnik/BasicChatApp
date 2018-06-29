'use strict';
const passport  = require('passport');
const config = require('../config');
const h = require('../helpers');
const FacebookStrategy  = require('passport-facebook').Strategy;
const db = require('../db')

module.exports = ()=>{
    passport.serializeUser((user,done)=>{
        done(null,user.id);
    });

    passport.deserializeUser((id,done)=>{
        //FInd user
        // h.findByID(id)
        //     .then(user=>{
        //         console.log(
        //             "This outputs a complete" +
        //             "User Profile object when the user logs in.",
        //             user.fullName);
        //         done(null,user);
        //     })
        //     .catch(error =>console.log('Error when deserializing '));
        db.userModel.findById(id, function(err, user) {done(err, user);
        });
    });



    let authProcessor = (accessToken, refreshToken,profile,done)=>{

    h.findOne(profile.id)
        .then(result=>{
            if(result) {
                done(null, result);
            }else{
                //Create a new User and return
                h.createNewUser(profile)
                    .then(newChatUser=>done(null,newChatUser))
                    .catch(error=>console.log('Error while creating new User'))
            }
        })
    }

    passport.use(new FacebookStrategy(config.fb,authProcessor));
}