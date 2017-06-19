const express = require( 'express' );
const wikiRouter = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;

wikiRouter.get('/', function(req, res, next) {
    Page.findAll({
        attributes: ['title', 'urlTitle']
    })
    .then(function(allPages){
        res.render('index', {pages: allPages});
    })
    .catch(next);
});

//why is the post request has to be '/'? Because the form action is /wiki and not /add!!!
wikiRouter.post('/', function(req, res, next) {
    //Find a row that matches the query, or build and save the row if none is found The successful result of the promise will be (instance, created) - Make sure to use .spread()
    console.log('submitted post ');
    User.findOrCreate({
        where: {
            name: req.body.authorname,
            email: req.body.email
        }
    })
    .then(function (values) {

        var user = values[0]; //user's name

        var page = Page.build({
            title: req.body.title,
            content: req.body.content
        });
        console.log('built page');
        return page.save().then(function (savedPage) {
            return savedPage.setAuthor(user);
        });

    })
    .then(function (newPage) {
    res.redirect(newPage.route);
    })
    .catch(next);
    //console.log('page defined');
    // STUDENT ASSIGNMENT:
    // make sure we only redirect *after* our save is complete!
    // note: `.save` returns a promise or it can take a callback.
    // page.save().then(function(savedPage){
    //     res.redirect(savedPage.route); // route virtual FTW
    // }).catch(next);

});

wikiRouter.get('/add', function(req, res, next) {
    res.render('addpage');
});

wikiRouter.get('/:urlTitle', function (req, res, next) {
    Page.findOne({
        where: {
            urlTitle: req.params.urlTitle
        },
        include: [
            {model: User, as: 'author'}
        ]
    })
    .then(function(foundPage){
        // page instance will have a .author property
        // as a filled in user object ({ name, email })
        if (foundPage === null) {
            res.status(404).send();
        } else {
            res.render('wikipage', {page: foundPage});
        }
    })
    .catch(next);
});

module.exports = wikiRouter;

