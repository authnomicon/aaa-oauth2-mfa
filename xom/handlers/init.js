exports = module.exports = function(issueCb) {
  var Client = require('duo_api').Client;
  
  var I_KEY = process.env['DUO_IKEY'];
  var S_KEY = process.env['DUO_SKEY'];
  var HOST = process.env['DUO_HOST'];
  
  
  
  var client = new Client(I_KEY, S_KEY, HOST)
  
  
  
  function fetch(req, res, next) {
    var opts = {
      async: true,
      username: 'johndoe',
      factor: 'push',
      device: 'DPRUQZGBXHA350Q2NOKB'
    }
    
    client.jsonApiCall('POST', '/auth/v2/auth', opts, function(data) {
      console.log(data);
      
      if (data.stat == 'OK') {
        console.log(data.response.devices);
        
        res.locals.pushCode = data.response.txid;
        
      }
      
      /*
{ response: { txid: '57b1b00c-7e6c-4c46-b488-d0817820e4fa' },
  stat: 'OK' }
      */
      
      
      
      next();
    })
  }
  
  function list(req, res, next) {
    console.log('DO IT!');
    res.json({
      push_code: res.locals.pushCode
    })
  }


  return [
    fetch,
    list
  ];
  
};

exports['@require'] = [
];
