'use strict';

var xmlbuilder = require('xmlbuilder');
var xml2js = require('xml2js');
var requestPromise = require('request-promise');


function encodeValue(parent, value) {
  var type;
  if (value.xmlRpcType) {
    type = value.xmlRpcType;
    value = value.value;
  }
  if (typeof value === 'string') {
    type = 'string'
  }

  if (type) {
    parent.ele('param')
    .ele('value')
    .ele(type, {}, value);
    return;
  }

  var array = parent
  .ele('value')
  .ele('array')
  .ele('data')
  .ele('value')
  .ele('struct');

  for(var k in value) {
    var member = array.ele('member');
    member.ele('name', {}, k);
    encodeValue(member, value[k]);
  }
}

function getRequest(methodName, params) {
  var root = xmlbuilder.create('methodCall');
  root.ele('methodName', {}, methodName);
  var xmlParams = root.ele('params');

  params = params || [];
  for(var param of params) {
    var parent = xmlParams.ele('param');
    encodeValue(parent, param);
  }

  return root.end();  
}



function parseValue(value) {

  var result = value.string || value.double || value.int || value.boolean;
  if (result) return result[0];

  if (value.array) {
    return value.array[0].data[0].value.map(parseValue);
  }

  if (value.struct) {
    var params = value.struct[0].member;
    result = {};
    for (var param of params) {
      result[param.name[0]] = parseValue(param.value[0]);
    }
    return result;
  }
  return value;
}

function parseResponse(xml) {
  return new Promise(function(resolve, reject) {
    xml2js.parseString(xml, function(err, response) {
      var result = parseValue(response.methodResponse.params[0].param[0].value[0]);
      resolve(result);
    });
  })
}

class XmlRpc {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  request(methodName, params) {
    return requestPromise({
      url: this.baseUrl,
      method: "POST",
      form: getRequest(methodName, params)
    })
    .then(function(body) {
      return parseResponse(body);
    });
  }
}

module.exports = XmlRpc;