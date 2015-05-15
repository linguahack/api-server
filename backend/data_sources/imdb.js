// Generated by CoffeeScript 1.8.0
(function() {
  var async, cheerio, request;
  cheerio = require('cheerio');
  module.exports = this;

  this.append_to_schemas = function(schemas) {
    schemas.serial_schema.virtual("imdb.full_url").get(function() {
      return "http://www.imdb.com/title/" + this.imdb.id;
    });
    schemas.serial_schema.virtual("imdb.full_url").set(function(url) {
      var regex;
      regex = /title\/([a-zA-Z\d]+)/;
      return this.imdb.id = regex[1];
    });
    schemas.serial_schema.methods.imdb_get_search_url = function() {
      var name;
      name = this.name.toLowerCase().replace(' ', '+');
      return "http://www.imdb.com/xml/find?json=1&nr=1&tt=on&q=" + name;
    };
    schemas.serial_schema.methods.imdb_get_id_by_name = function(cb) {
      var url;
      url = this.imdb_get_search_url();
      return request({
        url: url
      }, (function(_this) {
        return function(err, response, body) {
          var json, serial, _ref, _ref1;
          if (err) {
            cb(err);
            return;
          }
          json = JSON.parse(body);
          serial = ((_ref = json.title_popular) != null ? _ref[0] : void 0) || ((_ref1 = json.title_exact) != null ? _ref1[0] : void 0);
          _this.imdb.id = serial.id;
          return cb(null);
        };
      })(this));
    };
    schemas.serial_schema.methods.imdb_get_main_info = function(cb) {
      return request({
        url: this.imdb.full_url
      }, (function(_this) {
        return function(err, response, body) {
          var $;
          if (err) {
            cb(err);
            return;
          }
          $ = cheerio.load(body);
          _this.imdb.image_url = ($('#img_primary img')).attr('src');
          _this.imdb.rating = ($('#overview-top [itemprop="ratingValue"]')).text();
          _this.imdb.description = ($('#overview-top p[itemprop="description"]')).text();
          return cb(null);
        };
      })(this));
    };
    schemas.serial_schema.methods.imdb_refresh = function(cb) {
      var tasks;
      tasks = [];
      if (this.imdb.id == null) {
        tasks.push(this.imdb_get_id_by_name.bind(this));
      }
      tasks.push(this.imdb_get_main_info.bind(this));
      tasks.push(this.save.bind(this));
      return async.series(tasks, cb);
    };
    return schemas.serial_schema.statics.imdb_refresh_all = function(cb) {
      return this.find({}, (function(_this) {
        return function(err, results) {
          return async.each(results, function(serial, cb) {
            return serial.imdb_refresh(cb);
          }, cb);
        };
      })(this));
    };
  };

}).call(this);
