

var cheerio = require('cheerio');
var request = require('request-promise');

var get = function() {
  return request({
    url: 'http://fs.to/video/serials/view_iframe/iMb0cUQyusQCvXDNKahvLa',
    qs: {
      play: 1,
      file: 3328586
    }
  })
  .then(function(body) {
    var $ = cheerio.load(body);

    var files = [];
    
    $('.b-aplayer__popup-series-episodes > ul > li > a').each(function(i, elem) {
      var episode = JSON.parse(elem.attribs['data-file']);
      files.push("http://fs.to" + episode.url);
    });

    return files;
  });
};

get()
.then(function(result) {
  console.log(result.join('\n'));
})
