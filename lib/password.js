

var bcrypt = require('bcryptjs');

exports.hash = function(password) {
  return new Promise(function(resolve, reject) {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) return reject(err);
      bcrypt.hash(password, salt, function(err, hash) {
        if (err) return reject(err);
        resolve(hash);
      });
    });
  });
};

exports.compare = function(password, hash) {
  return new Promise(function(resolve, reject) {
    bcrypt.compare(password, hash, function(err, res) {
      if (err) return reject(err);
      resolve(res);
    })
  })
};

exports.isValid = function(password) {
  return /^.{6,40}$/.test(password || '');
};

exports.changePassword = function(user, password) {
  if (!exports.isValid(password)) {
    return Promise.resolve({success: false, message: 'invalid new password'});
  }
  return Promise.resolve()
  .then(function() {
    return exports.hash(password);
  })
  .then(function(hash) {
    user.password = hash;
    return user.save();
  })
  .then(function() {
    return {success: true};
  })
}