
var chai = require('chai');

var controllers = require('../controllers');

describe.only('create serial', function() {

  this.timeout(30000);

  it('should create serial', function() {
    return controllers.createSerial({
      name: 'Silicon Valley',
      tmdbId: '60573',
      fstoUrl: 'http://fs.to/video/serials/i4FEzVjFywlkW1nvsajvVvy-silikonovaya-dolina.html'
    });
  })
})