exports = module.exports = function() {
  var TokenError = require('oauth2orize-mfa').TokenError;
  
  var Client = require('duo_api').Client;
  
  var I_KEY = process.env['DUO_IKEY'];
  var S_KEY = process.env['DUO_SKEY'];
  var HOST = process.env['DUO_HOST'];
  
  
  
  var dclient = new Client(I_KEY, S_KEY, HOST);
  var txnid = '57b1b00c-7e6c-4c46-b488-d0817820e4fa';
  /*
{ code: 40002,
  message: 'Invalid request parameters',
  message_detail: 'txid',
  stat: 'FAIL' }
  */
  
  
  return function issueToken(client, pushCode, scope, body, authInfo, cb) {
    console.log('Verify the MFA txn/code, etc...');
    console.log(body);
    
    dclient.jsonApiCall('GET', '/auth/v2/auth_status', { txid: pushCode }, function(data) {
      console.log(data);
      
      //if (data.stat == 'OK') {
      //  console.log(data.response.devices);
      //}
      
/*
{ response: 
   { result: 'waiting',
     status: 'pushed',
     status_msg: 'Pushed a login request to your device...' },
  stat: 'OK' }
*/
      
      /*
{ response: 
   { result: 'allow',
     status: 'allow',
     status_msg: 'Success. Logging you in...' },
  stat: 'OK' }
      */
      
      /*
{ response: 
   { result: 'deny',
     status: 'deny',
     status_msg: 'Login request denied.' },
      */
      
      // when factor is sms
/*
{ response: 
   { result: 'deny',
     status: 'sent',
     status_msg: 'New SMS passcodes sent.' },
  stat: 'OK' }
*/
      
      if (data.stat == 'OK') {
        if (data.response.result == 'waiting') {
          return cb(new TokenError('Authorization pending', 'authorization_pending'));
        } else if (data.response.result == 'deny') {
          return cb(new TokenError('Authorization denied', 'invalid_grant'));
        } else if (data.response.result == 'allow') {
          return cb(null, 'some-access-token-goes-here');
        }
      }
    });
    
    
    //return cb(null, '74tq5miHKB', '94248');
  };
};


exports['@require'] = [
];
