
const router = require('koa-router')();
var jsonwebtoken = require('jsonwebtoken');

const bodyParser = require('../lib/body_parser');
const auth = require('../lib/auth');
var libpass = require('../lib/password');

const User = require('../models/user');
var Session = require('../models/session');


const login = function *(login, password) {
  var user = yield User.findOne({login});
  var isOk = user && user.password && (yield libpass.compare(password, user.password));
  if (isOk) {
    var token = yield auth.createSession(user);
    return {token};
  } else {
    return {message: 'invalid credentials'};
  }
}

const logout = function *(token) {
  var uid = jsonwebtoken.decode(token);
  var session = yield Session.findOne({uid});
  yield session.remove();
  this.body = {succes: true};
}

router.post('/login', bodyParser, function *() {
  this.body = yield* login(this.request.params.login, this.request.params.password);
})

router.post('/logout', auth.authenticate, function *() {
  this.body = yield* logout(this.request.headers.token);
})

router.post('/register', auth.authenticate, bodyParser, function*() {

  var user = new User();
  user.login = this.request.params.login;
  user.password = yield libpass.hash(this.request.params.password);
  try {
    user = yield user.save();
  } catch (e) {
    return this.body = {success: false};
  }
  var token = yield auth.createSession(user);
  this.body = {token};
})

module.exports = router;
