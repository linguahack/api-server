
var cheerio = require('cheerio');
var request = require('request-promise');
var Promise = require('promise');
var fsto_common = require('../common/fsto');


var Fsto = {

  getPlayerUrl: function(serial) {
    return "http://fs.to/video/serials/view/" + serial.fsto.id;
  },

  getFullUrl: function(serial) {
    return "http://fs.to/video/serials/" + serial.fsto.id + "-" + serial.fsto.url + ".html";
  },

  setFullUrl: function(serial, url) {
    var regex;
    regex = /serials\/([\da-zA-Z]*)-(.*)\.html/.exec(url);
    serial.fsto.id = regex[1];
    serial.fsto.url = regex[2];
  },

  getNameAndImage: function(serial) {
    return request({
      url: Fsto.getFullUrl(serial)
    })
    .then(function(body) {
      var $ = cheerio.load(body);
      serial.fsto.name = ($('div.b-tab-item__title-origin')).html();
      serial.fsto.image_url = ($('.poster-main img')).attr('src');
    });
  },

  commonQueryParams: function(serial, folder_id) {
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
  },

  getSeasons: function(serial) {
    return request({
      url: Fsto.getFullUrl(serial),
      qs: Fsto.commonQueryParams(serial)
    })
    .then(function(body) {
      var $ = cheerio.load(body);
      var season_regex = /(\d+) сезон/;
      var link_name_regex = /fl(\d+)/;
      ($('li.folder a.link-simple')).each(function(i, elem) {
        elem = $(elem);
        var season_number = season_regex.exec(elem.text());
        season_number = season_number ? season_number[1] : null;
        if (season_number) {
          var id = link_name_regex.exec(elem.attr('name'))[1];
          var season = serial.find_or_create_season(season_number);
          season.fsto = {
            folder_id: id
          };
        }
      });
    });
  },

  getTranslation: function(season) {
    return request({
      url: Fsto.getFullUrl(season.parent()),
      qs: Fsto.commonQueryParams(season.parent(), season.fsto.folder_id)
    })
    .then(function(body) {
      var $, elem, elem_id, link_name_regex, _ref;

      $ = cheerio.load(body);
      link_name_regex = /fl(\d+)/;
      elem = $('li.folder a.link-subtype.m-en');
      elem_id = (_ref = link_name_regex.exec(elem.attr('name'))) != null ? _ref[1] : void 0;
      if (elem_id == null) {
        throw new Error('cannot parse body' + season.parent().name + season.number);
      }
      season.fsto.en_folder_id = elem_id;
    });
  },

  getEpisodes: function(season) {
    return request({
      url: Fsto.getFullUrl(season.parent()),
      qs: Fsto.commonQueryParams(season.parent(), season.fsto.en_folder_id)
    })
    .then(function(body) {
      var file_id_from_link_regex = /file=(\d+)/;
      var episodes_from_text = /Серия (\d+)/;
      var $ = cheerio.load(body);
      var qualities = ['hdtvrip', '720', '1080'];
      for (var _i = 0, _len = qualities.length; _i < _len; _i++) {
        var quality = qualities[_i];
        ($("li.video-" + quality + " a.b-file-new__link-material")).each(function(i, elem) {
          var episode, episode_number, file_id, _ref1, _ref2;
          elem = $(elem);
          var file_id = file_id_from_link_regex.exec(elem.attr('href'))[1];
          var episode_number = episodes_from_text.exec(elem.text())[1];
          if (episode_number) {
            var episode = season.find_or_create_episode(episode_number);
            episode.fsto.files.push({
              quality: quality,
              file_id: file_id
            });
          }
        });
      }
    });
  },

  getLink: function(file) {
    if ((file.last_updated) && new Date - file.last_updated < 60000) {
      return Promise.resolve();
    }
    return fsto_common.get_link({
      fs_file: file,
      serial: file.ownerDocument(),
      season: file.parent().parent()
    });
  },

  updateLinks: function(serial) {
    var i, j, k, season, episode, file, promise = Promise.resolve();
    for (i = 0; i < serial.seasons.length; i++) {
      season = this.seasons[i];
      for (j = 0; j < season.episodes.length; j++) {
        episode = season.episodes[j];
        for (k = 0; k < episode.fsto.files.length; k++) {
          file = episode.fsto.files[k];
          promise = promise.then(get_link.bind(null, file));
        }
      }
    }
    return promise;
  },


  serialFromUrl: function(url, model) {
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
  },

  serialFromUrls = function(urls, model) {
    var promises = urls.map(function(url) {
      return Fsto.serialFromUrl(url, model);
    });
    return Promise.all(promises);
  };
};

