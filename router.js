'use strict';

let Router = require('koa-router');
let controllers = require('./controllers');

// 定时导入每日题库
controllers.dailyQuestionContoller.addTask();

// 前端用路由
var router = new Router();

// 无须session验证路由
let apiRouter = new Router({prefix: '/api'});

// 用户登录
apiRouter.post('/accounts/login', controllers.accountContoller.login);
// 添加用户
apiRouter.post('/accounts', controllers.accountContoller.add);

// 需要session验证路由
let apiAuthRouter = new Router({prefix: '/api'});

// session控制
apiAuthRouter.use(function* (next) {
  var account = this.session.account;
  if (account && account.id) {
    yield next;
  } else {
    let err = new Error('no login!');
    err.status = 403;
    throw err;
  }
});

// 添加标签
apiAuthRouter.post('/labels', controllers.labelContoller.add);
// 删除标签
apiAuthRouter.del('/labels/:id', controllers.labelContoller.del);
// 修改标签
apiAuthRouter.put('/labels/:id', controllers.labelContoller.update);
// 查询所有标签
apiAuthRouter.get('/labels', controllers.labelContoller.getAll);

// 添加问题
apiAuthRouter.post('/questions', controllers.questionContoller.add);
// 获取问题
apiAuthRouter.get('/questions', controllers.dailyQuestionContoller.getTask);
// 获取更多问题
apiAuthRouter.get('/questions/more', controllers.dailyQuestionContoller.getMoreTask);

// 回答问题
apiAuthRouter.post('/answers', controllers.answerContoller.add);

//
apiAuthRouter.get('/answers', controllers.answerContoller.getAnswer);

exports.router = router;
exports.apiRouter = apiRouter;
exports.apiAuthRouter = apiAuthRouter;