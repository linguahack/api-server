'use strict';

var Parser = require('../parsers/fsto').Parser;
var chai = require('chai');
var assert = chai.assert, expect = chai.expect;

describe.only('fsto', function() {

  var serial = {
    fsto: {
      id: 'iMb0cUQyusQCvXDNKahvLa',
      url: 'fargo'
    },
    seasons: [{
      number: 1,
      fsto: {
        folder_id: 335355,
        en_folder_id: 707923
      }
    }]
  };

  var parser = new Parser;

  describe('name and image', function() {
    it('should parse name and image', function() {
      return parser.parseNameAndImage(serial)
      .then(function(result) {
        assert.typeOf(result.name, 'string');
        assert.typeOf(result.image_url, 'string');
      });
    });
  });

  describe('seasons', function() {
    it('should parse seasons', function() {
      return parser.parseSeasons(serial)
      .then(function(seasons) {
        expect(seasons).to.have.length.least(1);
        let season = seasons[0];
        expect(season.number).to.be.a('number');
        expect(season.folder_id).to.be.a('number');
      });
    });
  });
  
  describe('translation', function() {
    it('should parse a translation', function() {
      return parser.parseTranslation(serial, serial.seasons[0])
      .then(function(result) {
        console.log(result);
        expect(result.en_folder_id).to.be.a('number');
      });
    });
  });

});

describe.skip('fstoold', function() {


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

