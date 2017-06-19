const express = require( 'express' );
const routesRouter = express.Router();
const wikiRouter = require('./wiki');
const userRouter = require('./user');
// ...
routesRouter.use('/wiki', wikiRouter);

// or, in one line: router.use('/wiki', require('./wiki'));

routesRouter.use('/user', userRouter);

module.exports = routesRouter;

