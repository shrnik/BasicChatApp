'use strict';
const router  = require('express').Router();
const db = require('../db')
const crypto = require('crypto');

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

let findRoomByName = (allrooms, room) => {
    let findRoom = allrooms.findIndex((element) => {
        if(element.room === room) {
            return true;
        } else {
            return false;
        }
    });
    return findRoom > -1 ? true : false;
}


//Generate Unique room ID

let randomHex=()=>{
    return crypto.randomBytes(24).toString('hex');
}



let findRoomById = (allrooms, roomID) => {
    return allrooms.find((element, index, array) => {
        if(element.roomID === roomID) {
            return true;
        } else {
            return false;
        }
    });
}


// Add a user to a chatroom
let addUserToRoom = (allrooms, data, socket) => {
    // Get the room object
    let getRoom = findRoomById(allrooms, data.roomID);
    if(getRoom !== undefined) {
        let userID = socket.request.session.passport.user;

        let checkUser = getRoom.users.findIndex((element) => {
            if(element.userID === userID) {
                return true;
            } else {
                return false;
            }
        });


        if(checkUser > -1) {
            getRoom.users.splice(checkUser, 1);
        }

        getRoom.users.push({
            socketID: socket.id,
            userID,
            user: data.user,
            userPic: data.userPic
        });
        socket.join(data.roomID);

        return getRoom;
    }
}

let removeUserFromRoom = (allrooms, socket) => {
    for(let room of allrooms) {
        // Find the user
        let findUser = room.users.findIndex((element, index, array) => {
            if(element.socketID === socket.id) {
                return true;
            } else {
                return false;
            }
            // return element.socketID === socket.id ? true : false
        });

        if(findUser > -1) {
            socket.leave(room.roomID);
            room.users.splice(findUser, 1);
            return room;
        }
    }
}
module.exports={
    route,
    findOne,
    createNewUser,
    findByID,
    isAuthenticated,
    findRoomByName,
    randomHex,
    findRoomById,
    addUserToRoom,
    removeUserFromRoom
};