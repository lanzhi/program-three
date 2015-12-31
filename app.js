'use strict';

let path = require('path');
let app = require('koa')();
let bodyParser = require('koa-bodyparser');
let session = require('koa-generic-session');
let MongoStore = require('koa-generic-session-mongo');
let mount = require('koa-mount');
let staticServer = require('koa-static');
let views = require('koa-views');
let config = require('./config');
let logger = require('./middlewares/logger');
let routers = require('./router');
let errorhandler = require('./middlewares/errorhandler');

app.use(errorhandler());

app.use(logger);
app.use(bodyParser());
app.use(mount('/public', staticServer(path.join(__dirname, 'public'), {maxage: config.staticServerMaxAge})));
app.use(views('views', {default: 'jade'}));

app.keys = config.sessionSecret;
app.use(session({
  store: new MongoStore({
    url: config.db
  })
}));

// 跳转到首页
routers.router.get('/', function* () {
  if (!this.session.account) {
    yield this.render('login');
  } else {
    yield this.render('question');
  }
});

routers.router.get('/getQuestion', function* () {
  if (!this.session.account) {
    yield this.render('login');
  } else {
    yield this.render('question');
  }
});

app.use(routers.router.routes());
app.use(routers.apiRouter.routes());
app.use(routers.apiAuthRouter.routes());

app.listen(config.port);
console.log("listening on port %d in %s mode", config.port, process.env.NODE_ENV != 'production' ? 'debug' : 'production');
