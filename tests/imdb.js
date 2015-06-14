// Generated by CoffeeScript 1.8.0
(function() {
  var assert, expect, models, _ref;

  models = require('../models');

  _ref = require('chai'), assert = _ref.assert, expect = _ref.expect;

  describe('imdb', function() {
    var episode, season, serial;
    this.timeout(10000);
    serial = null;
    season = null;
    episode = null;
    afterEach(function(done) {
      return serial.save(done);
    });
    before(function(done) {
      return models.Serial.findOne({
        url: 'fargo'
      }, function(err, result) {
        expect(err).to.not.exist;
        expect(result).to.be.an('object');
        serial = result;
        return done();
      });
    });
    it('should getting id by name', function(done) {
      return serial.imdb_get_id_by_name(function(err) {
        expect(err).to.not.exist;
        expect(serial.imdb.id).to.have.length.above(0);
        return done();
      });
    });
    it('should getting main info', function(done) {
      return serial.imdb_get_main_info(function(err) {
        expect(err).to.not.exist;
        expect(serial.imdb.image_url).to.have.length.above(5);
        expect(serial.imdb.rating).to.have.length.above(0);
        expect(serial.imdb.description).to.have.length.above(5);
        return done();
      });
    });
    return it('should refresing', function(done) {
      return serial.imdb_refresh(function(err) {
        expect(err).to.not.exist;
        return done();
      });
    });
  });

  describe.skip('refresh all', function() {
    this.timeout(20000);
    return it('should refreshing all', function(done) {
      return models.Serial.imdb_refresh_all(function(err) {
        expect(err).to.not.exist;
        return done();
      });
    });
  });

}).call(this);