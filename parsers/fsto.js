'use strict'

var cheerio = require('cheerio');
var request = require('request-promise');
var utils = require('../utils/utils');

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
        throw new Error(`cannot parse body of ${serial.name} season ${season.number}`);
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
      var files = [];
      ($("li.b-file-new")).each(function(i, elem) {
        var quality = $('.video-qulaity', elem).text();
        elem = $('a.b-file-new__link-material', elem);
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
      return files;
    });
  }
  
  parseUrl(url) {
    var regex = /serials\/([\da-zA-Z]*)-(.*)\.html/.exec(url);
    return {
      id: regex[1],
      url: regex[2]
    }
  }
}

class Controller {

  constructor() {
    this.parser = new Parser();
  }

  updateEpisode(season, parsedEpisode) {
    var episode = utils.getItem(season.episodes, {number: +parsedEpisode.number});
    var file = utils.getItem(episode.fsto.files, {file_id: +parsedEpisode.file_id}, 'file_id');
    file.quality = parsedEpisode.quality;
  }

  updateSeason(serial, parsedSeason) {
    var controller = this;
    var season = utils.getItem(serial.seasons, {number: parsedSeason.number});
    season.fsto.folder_id = parsedSeason.folder_id;
    return this.parser.parseTranslation(serial, season)
    .then(function (result) {
      season.fsto.en_folder_id = result.en_folder_id;
      return controller.parser.parseEpisodes(serial, season);
    })
    .then(function(parsedEpisodes) {
      var promiseChain = Promise.resolve();
      for (var parsedEpisode of parsedEpisodes) {
        promiseChain = promiseChain.then(controller.updateEpisode.bind(controller, season, parsedEpisode));
      }
      return promiseChain;
    });
  }

  updateSerial(serial) {
    var controller = this;
    return this.parser.parseSeasons(serial)
    .then(function(parsedSeasons) {
      var promiseChain = Promise.resolve();
      for (var parsedSeason of parsedSeasons) {
        promiseChain = promiseChain.then(controller.updateSeason.bind(controller, serial, parsedSeason));
      }
      return promiseChain;
    })
    .then(function() {
      return serial;
    })
  }

}

module.exports = {Parser, Controller};
