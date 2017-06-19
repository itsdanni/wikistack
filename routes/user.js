const express = require( 'express' );
const userRouter = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;

userRouter.get('/', function(req, res, next) {
    User.findAll({}).then(function(foundUsers){
        res.render('users', { users: foundUsers });
    }).catch(next);
});

userRouter.get('/:userId', function(req, res, next) {

    var userPromise = User.findById(req.params.userId);//returns a promise
    //find all pages with that userid
    var pagesPromise = Page.findAll({
        where: {
            authorId: req.params.userId
        }
    });
    //wait for two promises to resolve, how does it know which one returns first????
    Promise.all([
        userPromise,
        pagesPromise
    ])
    .then(function(values) {
        var user = values[0];
        var pages = values[1];
        res.render('user', { user: user, pages: pages });
    })
    .catch(next);

});

module.exports = userRouter;

