'use strict';
const h = require('../helpers');
const passport  = require('passport');
module.exports = ()=> {
    let routes = {
        'get': {
            '/': (req, res, next) => {
                res.render('login');
            },
            '/rooms': [h.isAuthenticated,(req, res, next) => {
                res.render('rooms',{
                    user:req.user
                });
                console.log(req.user.fullName);
            }],
            '/chat': (req, res, next) => {
                res.render('chat');
            },
            '/auth/facebook':passport.authenticate('facebook'),
            '/auth/facebook/callback':passport.authenticate('facebook',{
                successRedirect:'/rooms',
                failureRedirect:'/'
            }),
            '/logout':(req,res,next)=>{
                req.logout();
                res.redirect('/');
            }
        },
        'post': {

        },
        'NA':(req,res,next)=>{
            console.log('hehe')
            res.status(404).sendFile(process.cwd()+'/views/404.htm');

        }

    }


    return h.route(routes);

}