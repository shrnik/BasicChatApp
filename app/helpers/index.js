'use strict';
const router  = require('express').Router();
const db = require('../db')

let _registerRoutes = (routes, method) => {
    for (let key in routes) {
        if (typeof routes[key] === 'object' && routes[key] != null && !(routes[key] instanceof Array)) {
            _registerRoutes(routes[key], key);
        }
        else {
            if (method === 'get') {
                router.get(key, routes[key]);
            }
            else if (method === 'post') {
                router.post(key, routes[key]);
            }
            else{
                router.use(routes[key]);
            }

        }

    }
};

let route = routes =>{
    _registerRoutes(routes);
    return router;
};
// Find a single user based on a key
let findOne = profileID =>{
    return db.userModel.findOne({
        'profileID':profileID
    });

};
//Promisified findID
let findByID = id=>{
    return new Promise((resolve,reject)=>{
        db.userModel.findById(id,(error,user)=>{
            if(error) {
                reject(error);
            }else{
                resolve(user);
            }
        });
    })

};

//Middleware for authetication

let isAuthenticated=(req,res,next)=>{
    if(req.isAuthenticated()){
        next();
    }
    else{
        res.redirect('/');
    }
}





// Create a new user and returns that instance

let createNewUser = profile =>{
    return new Promise((resolve,reject) =>{
        let newChatUser = db.userModel({
            profileID:profile.id,
            fullName:profile.displayName,
            profilePic:profile.photos[0].value||''
        });
        newChatUser.save(error=>{
            if(error) {
                reject(error);
            }else{
                resolve(newChatUser);
            }
        })
    })
};

module.exports={
    route,
    findOne,
    createNewUser,
    findByID,
    isAuthenticated
};