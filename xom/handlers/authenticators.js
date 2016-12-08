exports = module.exports = function(issueCb) {
  var Client = require('duo_api').Client;
  
  var I_KEY = process.env['DUO_IKEY'];
  var S_KEY = process.env['DUO_SKEY'];
  var HOST = process.env['DUO_HOST'];
  
  
  
  var client = new Client(I_KEY, S_KEY, HOST)
  
  
  
  function fetch(req, res, next) {
    client.jsonApiCall('POST', '/auth/v2/preauth', { username: 'johndoe'}, function(data) {
      console.log(data);
      
      if (data.stat == 'OK') {
        console.log(data.response.devices);
      }
      
      next();
    })
  }
  
  function list(req, res, next) {
    console.log('DO IT!');
    res.json({
      foo: 'bar'
    })
  }


  return [
    fetch,
    list
  ];
  
};

exports['@require'] = [
];
