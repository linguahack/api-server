// Generated by CoffeeScript 1.8.0
(function() {
  var assert, expect, models, _ref;

  models = require('../models');

  _ref = require('chai'), assert = _ref.assert, expect = _ref.expect;

  describe('tmdb', function() {
    var serial;
    this.timeout(10000);
    serial = null;
    before(function(done) {
      return models.Serial.findOne({
        url: 'fargo'
      }, function(err, result) {
        expect(err).to.not.exist;
        serial = result;
        return done();
      });
    });
    afterEach(function(done) {
      return serial.save(done);
    });
    it('should search', function(done) {
      return serial.tmdb_search(function(err) {
        expect(err).to.not.exist;
        expect(serial.tmdb.id).to.be.a('string');
        return done();
      });
    });
    it('should getting main info', function(done) {
      return serial.tmdb_get_main_info(function(err) {
        expect(err).to.not.exist;
        expect(serial.tmdb.backdrop_path).to.be.a('string');
        expect(serial.tmdb.poster_path).to.be.a('string');
        return done();
      });
    });
    return it('should refreshing', function(done) {
      return serial.tmdb_refresh(function(err) {
        expect(err).to.not.exist;
        expect(serial.tmdb.backdrop_path).to.be.a('string');
        expect(serial.tmdb.poster_path).to.be.a('string');
        return done();
      });
    });
  });

  describe.skip('refresh all', function() {
    this.timeout(50000);
    return it('should refreshing all', function(done) {
      return models.Serial.tmdb_refresh_all(function(err) {
        expect(err).to.not.exist;
        return done();
      });
    });
  });

}).call(this);
