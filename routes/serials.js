
var router = require('koa-router')();

var bodyParser = require('../lib/body_parser');
var controllers = require('../controllers');
var getSubtitles = require('../utils/getSubtitles');



router.get('/', function *() {
  this.body = yield controllers.getSerials();
})


router.get('/id/(:serial)', function *() {
  this.body = yield controllers.getSerial(this.params.serial)
});

router.get('/subtitles/convert', function *() {
  this.type = 'text/vtt';
  this.body = yield getSubtitles(this.request.query.url)
})

module.exports = router;
