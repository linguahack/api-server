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
      },
      episodes: [{
        number: 1,
        fsto: {
          files: [{
            quality: '1080',
            file_id: 3328586
          }]
        }
      }]
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
        expect(result.en_folder_id).to.be.a('number');
      });
    });
  });

  describe('episodes', function() {
    it('should parse files', function() {
      return parser.parseEpisodes(serial, serial.seasons[0])
      .then(function(files) {
        expect(files).to.have.length.least(1);
        expect(files[0].number).to.be.a.number;
        expect(files[0].file_id).to.be.a.number;
        expect(files[0].quality).to.be.a.string;
      });
    });
  });

  describe('link', function() {
    it('should parse video links', function() {
      return parser.parseLink(serial, serial.seasons[0].episodes[0].fsto.files[0])
      .then(function(files) {
        expect(files).to.have.length.least(1);
        expect(files[0].number).to.be.a.number;
        expect(files[0].file_id).to.be.a.number;
        expect(files[0].quality).to.be.a.string;
        expect(files[0].link).to.be.a.string;
      });
    });
  });


});

var fs_urls = [
  "http://fs.to/video/serials/iw8ypXjXXom7QpgYXsvU2Y-vo-vse-tyazhkije.html",
  "http://fs.to/video/serials/iLb46RC7QyNB7FLUnLcC0U-igra-prestolov.html",
  "http://fs.to/video/serials/iw8Mx62PJkI9ELIKM8UlLa-ostanovis-i-gori.html",
  "http://fs.to/video/serials/i4ELwy5R56vkIPRo6tF9fj2-druzya.html",
  "http://fs.to/video/serials/iMaZjNRFmTPd4WWhmFElAA-kak-ya-vstretil-vashu-mamu.html",
  "http://fs.to/video/serials/iMb0cUQyusQCvXDNKahvLa-fargo.html",
  "http://fs.to/video/serials/iM7yOFI1uKKPZ6VZKZd9D2-nastoyashhij-detektiv.html"
];
