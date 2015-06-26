
var xmlbuilder = require('xmlbuilder');

function XmlRpc(methodName, params) {
  var root = xmlbuilder.create('methodCall');
  root.ele('methodName', {}, methodName);
  var xmlParams = root.ele('params');

  params = params || [];
  for(var param of params) {
    if (typeof param === 'string') {
      xmlParams.ele('param')
      .ele('value')
      .ele('string', {}, param);
    } else if (param) {
      var array = xmlParams.ele('param')
      .ele('value')
      .ele('array')
      .ele('data')
      .ele('value')
      .ele('struct');
      for(var k in param) {
        var member = array.ele('member');
        member.ele('name', {}, k);
        member.ele('value')
        .ele('string', {}, param[k]);
      }
    }
  }

  return root.end();  
}

module.exports = XmlRpc;