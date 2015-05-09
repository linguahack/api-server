
var fsto = {};
var utils = require('./utils');
var request = require('request-promise');
module.exports = fsto;

fsto.get_link = function(params) {
  var serial = params.serial, season = params.season, fs_file = params.fs_file;
  return request({
    url: serial.fsto.player_url,
    qs: {
      play: 1,
      file: fs_file.file_id
    }
  })
  .then(function(body) {
    var javascript_playlist_regexp = /onUserViewing[\s\S]*playlist: (\[[^\[]*?\])/m;
    var text = javascript_playlist_regexp.exec(body);
    text = text ? text[1] : null;
    if (!text) {
      var javascript_playlist_regexp2 = /onUserViewing[\s\S]*playlist: (\[[^"]*?("[^"]*?"[^"]*?)*?\])/m;
      text = javascript_playlist_regexp2.exec(body)[1];
    }
    if (!text) {
      throw new Error('cannot parse body');
    }
    var json = utils.jsonify(text);
    var playlist_parsed = JSON.parse(json);
    var episodes_fromdb = season.episodes;
    var e_fromdb, e_parsed, file;
    for (var i = 0; i < playlist_parsed.length; i++) {
      e_parsed = playlist_parsed[i];
      e_fromdb = episodes_fromdb.filter(function(e_fromdb) {
        return e_parsed.fsData.file_series === e_fromdb.number.toString();
      });
      if (e_fromdb.length > 0) {
        file = e_fromdb[0].fsto.files.filter(function(file) {
          return e_parsed.fsData.file_quality === file.quality;
        });
        file[0].link = e_parsed.fsData.download_url;
        file[0].last_updated = new Date;
      }
    }
  }.bind(this));
};

