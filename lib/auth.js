

var generateUid = require('uid-safe').sync;
var jsonwebtoken = require('jsonwebtoken');

var User = require('../models/user');
var Session = require('../models/session');

var secret = require('../config.json').secret;


exports.createSession = function(user) {
  var session = new Session();
  session.uid = generateUid(24);
  session.userId = user.id;
  return session.save()
  .then(function() {
    return jsonwebtoken.sign(session.uid, secret);
  })
};


var getUid = function(token) {
  return new Promise(function(resolve, reject) {
    jsonwebtoken.verify(token, secret, function(err, uid) {
      if (err) {
        return reject(err);
      }
      resolve(uid);
    })
  });
};

exports.getUid = getUid;

exports.authenticate = function *(next) {
  var token = this.request.headers.token;
  if (!token) {
    this.status = 401;
    this.body = {message: "missing token"};
    return;
  }

  try {
    var uid = yield getUid(token);
  } catch (e) {
    this.status = 401;
    this.body = {message: "invalid token"};
    return;
  }
  var session = yield Session.findOne({uid: uid});

  if (!session) {
    this.status = 401;
    this.body = {message: "invalid token"};
    return;
  }
  this.state.userId = session.userId;
  session.lastActivity = Date.now();
  session.save();
  yield next;
};
