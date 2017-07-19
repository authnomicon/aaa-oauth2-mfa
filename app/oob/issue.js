exports = module.exports = function(verify, authenticators, Tokens) {
  var hash = require('oidc-token-hash');
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
  
  
  return function issueToken(client, user, oobCode, mfaToken, body, authInfo, clientAuthInfo, cb) {
    console.log('Verify the MFA txn/code, etc...');
    console.log(client);
    console.log(user);
    console.log(oobCode);
    console.log(mfaToken);
    console.log(body);
    console.log(authInfo);
    console.log(clientAuthInfo);
    //return;
    
    // TODO: Decode the oob code to determine the authenticator ID, context
    
    
    Tokens.decipher(oobCode, { dialect: 'http://schemas.authnomicon.org/jwt/oob-code' }, function(err, claims) {
      console.log('INTERPRETED!');
      console.log(err);
      console.log(claims);
      //return;
      
      if (err) { return cb(err); }
      
      // TODO: Add support for binding via session ID, and require either that or hash-based
      
      if (!hash.valid(claims.mfaTokenHash, mfaToken)) {
        return cb(new TokenError('OOB code not bound to MFA token', 'invalid_grant'));
      }
      
      
      // TODO: Switch based on challenge method.
      
      var authenticatorID = '0';
      var context = {};
  
      // TODO: Just need authenticator ID here, depending on challenge type (authn, m-of-n, etc)
      authenticators.get(user.id, claims.challenge.authenticator.id, function(err, authenticator) {
        if (err) { return cb(err); }
  
        var transactionID = undefined;
        var opts = { context: context };
        if (body.binding_code) {
          opts.secret = body.binding_code;
        }
  
        var opts = {};
        if (claims.enroll) {
          opts.enroll = true;
        }
        
        verify(authenticator, claims.challenge.transactionID, opts, function(err, ok) {
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
      
    });
    
    
    return;
  };
};


exports['@require'] = [
  //'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/oob/verify'
  //'http://schemas.authnomicon.org/js/login/mfa/opt/duo/oob/verify',
  'http://schemas.authnomicon.org/js/security/authentication/oob/verify',
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/UserAuthenticatorsDirectory',
  'http://i.bixbyjs.org/tokens'
];
