/*
updates:
added getter method for route instead of field
added page.hook outside of model
new page instance created
*/

var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack', {
    logging: false
});

var Page = db.define('page', {
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    urlTitle: {
        type: Sequelize.STRING,
        allowNull: false
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM('open', 'closed')
    },
    date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
},
{
    getterMethods: {
        route: function() {
            //console.log('calculating the route');
            return '/wiki/' + this.urlTitle;
        }
    }
});

Page.hook('beforeValidate', function(page){
    //console.log('validating....');
    page.urlTitle = generateUrlTitle(page.title);
});

var User = db.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }

    }
});

Page.belongsTo(User, { as: 'author' });
//We include { as: 'author' } in order to be more descriptive about the relation itself, rather than a user being associated with a page more generically. Note that this aliasing will affect how we interact with this association later on.

function generateUrlTitle (title) {
    //console.log('generating url title');
    if (title) {
        // Removes all non-alphanumeric characters from title
        // And make whitespace underscore
        return title.replace(/\s+/g, '_').replace(/\W/g, '');
    }
    else {
        // Generates random 5 letter string
        return Math.random().toString(36).substring(2, 7);
    }
}

module.exports = {
  Page: Page,
  User: User,
  db: db
};
