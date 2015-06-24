'use strict'

var cheerio = require('cheerio');
var request = require('request-promise');
var _ = require('../utils/utils');

class Parser {

  fullUrl(serial) {
    return `http://fs.to/video/serials/${serial.fsto.id}-${serial.fsto.url}.html`;
  }


  playerUrl(serial) {
    return "http://fs.to/video/serials/view/" + serial.fsto.id;
  }

  frameUrl(serial) {
    return 'http://fs.to/video/serials/view_iframe/' + serial.fsto.id;
  }

  commonQueryParams(serial, folder_id) {
    if (folder_id == null) {
      folder_id = 0;
    }
    return {
      ajax: 1,
      r: Math.random(),
      id: serial.fsto.id,
      download: 1,
      view: 1,
      view_embed: 0,
      blocked: 0,
      folder_quality: null,
      folder_lang: null,
      folder_translate: null,
      folder: folder_id
    };
  }

  parseNameAndImage(serial) {
    return request({
      url: this.fullUrl(serial)
    })
    .then(function(body) {
      var $ = cheerio.load(body);
      return {
        name: ($('div.b-tab-item__title-origin')).html(),
        image_url: ($('.poster-main img')).attr('src')
      };
    });
  }

  parseSeasons(serial) {
    return request({
      url: this.fullUrl(serial),
      qs: this.commonQueryParams(serial)
    })
    .then(function(body) {
      var $ = cheerio.load(body);
      var seasons = [];

      var season_regex = /(\d+) сезон/;
      var link_name_regex = /fl(\d+)/;

      ($('li.folder a.link-simple')).each(function(i, elem) {
        elem = $(elem);
        var number = season_regex.exec(elem.text());
        number = number ? +number[1] : null;
        if (number) {
          var folder_id = +link_name_regex.exec(elem.attr('name'))[1];
          seasons.push({number, folder_id});
        }
      });
      return seasons;
    });
  }

  parseTranslation(serial, season) {
    return request({
      url: this.fullUrl(serial),
      qs: this.commonQueryParams(serial, season.fsto.folder_id)
    })
    .then(function(body) {
      let $ = cheerio.load(body);

      let link_name_regex = /fl(\d+)/;
      let elem = $('li.folder a.link-subtype.m-en');

      let elem_id = link_name_regex.exec(elem.attr('name'));
      elem_id = elem_id ? elem_id[1] : elem_id;
      if (elem_id == null) {
        throw new Error('cannot parse body' + serial.name + season.number);
      }
      return {en_folder_id: +elem_id};
    });
  }

  parseEpisodes(serial, season) {
    return request({
      url: this.fullUrl(serial),
      qs: this.commonQueryParams(serial, season.fsto.en_folder_id)
    })
    .then(function(body) {
      var $ = cheerio.load(body);

      var file_id_from_link_regex = /file=(\d+)/;
      var episodes_from_text = /Серия (\d+)/;
      var qualities = ['hdtvrip', '720', '1080'];
      var files = [];
      for (var i = 0; i < qualities.length; i++) {
        var quality = qualities[i];
        ($("li.video-" + quality + " a.b-file-new__link-material")).each(function(i, elem) {
          elem = $(elem);
          let file_id = file_id_from_link_regex.exec(elem.attr('href'))[1];
          let number = episodes_from_text.exec(elem.text())[1];
          if (number) {
            files.push({
              number : number,
              quality: quality,
              file_id: file_id
            });
          }
        });
      }
      return files;
    });
  }
  
}

class Controller {

  constructor() {
    this.parser = new Parser();
  }

  updateSeason(serial, parsedSeason) {
    var season = serial.seasons.filter(function(season) { return season.number = parsedSeason.number; })[0];
    if (!season) {
      serial.seasons.push(serial.seasons.create({number: parsedSeason.number}));
      season = serial.seasons[serial.seasons.length - 1];
    }
    season.fsto.folder_id = parsedSeason.folder_id;
    return parseTranslation(serial, season)
    .then(function (result) {
      season.fsto.en_folder_id = result.en_folder_id;
    })
  }

  updateSerial(serial) {
    var controller = this;
    return this.parser.parseSeasons(serial)
    .then(function(parsedSeasons) {
      var promiseChain = Promise.resolve();
      for (var parsedSeason of parsedSeasons) {
        promiseChain = promiseChain.then(
          (
            function(parsedSeason) {return controller.updateSeason.bind(controller, serial, parsedSeason);}
          )(parsedSeason)
        );
      }
    })
  }

}

module.exports = {Parser, Controller};


var Fsto = {};

Fsto.setFullUrl = function(serial, url) {
  var regex;
  regex = /serials\/([\da-zA-Z]*)-(.*)\.html/.exec(url);
  serial.fsto.id = regex[1];
  serial.fsto.url = regex[2];
};


Fsto.serialFromUrl = function(url, model) {
  //TODO: this function
  var serial = new model;
  serial.fsto.full_url = url;
  var promise = serial
  .fs_get_name_and_image()
  .then(serial.fs_get_seasons.bind(serial));

  for (var i = 0; i < serial.seasons.length; ++i) {
    var season = serial.seasons[i];
    promise = promise
    .then(season.fs_get_translation.bind(season))
    .then(season.fs_get_episodes.bind(season));
  }
  promise = promise
  .then(serial.fs_update_links.bind(serial))
  .then(function() {
    serial.name = serial.fsto.name;
    serial.generate_url();
  })
  .then(serial.save.bind(serial));
  return promise;
};

Fsto.serialFromUrls = function(urls, model) {
  var promises = urls.map(function(url) {
    return Fsto.serialFromUrl(url, model);
  });
  return Promise.all(promises);
};
