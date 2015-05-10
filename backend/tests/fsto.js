

var models = require('../models');
var chai = require('chai');
var assert = chai.assert, expect = chai.expect;

describe.only('fsto', function() {
  var episode, season, serial;
  this.timeout(40000);
  var fs_url = "http://fs.to/video/serials/iMb0cUQyusQCvXDNKahvLa-fargo.html";

  before(function() {
    return models.Serial.findOne({
      url: 'fargo'
    }).exec()
    .then(function(result) {
      if (!serial) {
        serial = result;
      }
      if (!season) {
        season = serial.seasons[0];
      }
      if (!episode) {
        episode = season.episodes[0];
      }
    });
  });

  afterEach(function() {
    return serial.save();
  });

  describe('full url', function() {
    it('should save url and id', function() {
      serial.fsto.full_url = fs_url;
      assert.typeOf(serial.fsto.url, 'string');
      assert.typeOf(serial.fsto.id, 'string');
    });
  });

  describe('get name and image', function() {
    it('should get name and image', function() {
      return serial.fs_get_name_and_image()
      .then(function() {
        assert.typeOf(serial.fsto.name, 'string');
        assert.typeOf(serial.fsto.image_url, 'string');
      });
    });
  });

  describe('get seasons', function() {
    it('should get seasons', function() {
      return serial.fs_get_seasons()
      .then(function() {
        expect(serial.seasons).to.have.length.least(1);
        season = serial.seasons[0];
        expect(season.number).to.be.a('number');
        expect(season.fsto.folder_id).to.be.a('number');
      });
    });
  });

  describe('get translation', function() {
    it('should get a translation', function() {
      return season.fs_get_translation()
      .then(function() {
        expect(season.fsto.en_folder_id).to.be.a('number');
      });
    });
  });

  describe('get episodes', function() {
    it('should get episodes', function() {
      return season.fs_get_episodes()
      .then(function() {
        expect(season.episodes).to.have.length.least(1);
        episode = season.episodes[0];
        expect(episode.fsto.files).to.have.length.least(1);
        expect(episode.fsto.files[0].file_id).to.be.a.number;
        expect(episode.fsto.files[0].quality).to.have.length.least(1);
      });
    });
  });

  describe('get link', function() {
    it('should get video link', function() {
      return episode.fsto.files[0].get_link();
    });
  });

  describe('update links', function() {
    it('should update links', function() {
      return serial.fs_update_links();
    });
  });
});

describe.skip('from urls', function() {
  var fs_urls;
  this.timeout(600000);
  fs_urls = [
    "http://fs.to/video/serials/iw8ypXjXXom7QpgYXsvU2Y-vo-vse-tyazhkije.html",
    "http://fs.to/video/serials/iLb46RC7QyNB7FLUnLcC0U-igra-prestolov.html",
    "http://fs.to/video/serials/iw8Mx62PJkI9ELIKM8UlLa-ostanovis-i-gori.html",
    "http://fs.to/video/serials/i4ELwy5R56vkIPRo6tF9fj2-druzya.html",
    "http://fs.to/video/serials/iMaZjNRFmTPd4WWhmFElAA-kak-ya-vstretil-vashu-mamu.html",
    "http://fs.to/video/serials/iMb0cUQyusQCvXDNKahvLa-fargo.html",
    "http://fs.to/video/serials/iM7yOFI1uKKPZ6VZKZd9D2-nastoyashhij-detektiv.html"
  ];

  before(function() {
    return models.Serial.remove({}).exec();
  });
  it('should make it all', function() {
    return models.Serial.fs_serial_from_urls(fs_urls);
  });
});

