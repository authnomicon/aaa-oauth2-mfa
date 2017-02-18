exports = module.exports = function(verify, authenticators) {
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
  
  
  return function issueToken(client, user, oobCode, scope, body, onefaInfo, authInfo, cb) {
    console.log('Verify the MFA txn/code, etc...');
    console.log(body);
    
    // TODO: Decode the oob code to determine the authenticator ID, context
    
    var authenticatorID = '0';
    var context = {};
    
    authenticators.get(user, authenticatorID, function(err, authenticator) {
      if (err) { return cb(err); }
    
      var transactionID = undefined;
      var opts = { context: context };
      if (body.confirmation_code) {
        opts.secret = body.confirmation_code;
      }
    
    
      // TODO: Put user and deviceID here
      verify(authenticator, context.transactionID, opts, function(err, ok) {
        console.log(err)
        console.log(ok)
      
        if (err) { return cb(err); }
        if (ok === undefined) {
          return cb(new TokenError('Authorization pending', 'authorization_pending'));
        }
        if (!ok) {
          return cb(new TokenError('Authorization denied', 'invalid_grant'));
        }
        return cb(null, 'some-access-token-goes-here');
      });
    });
  };
};


exports['@require'] = [
  //'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/oob/verify'
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/oob/verify',
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/UserAuthenticatorsDirectory'
];
