exports = module.exports = function(verify, authenticators) {
  var TokenError = require('oauth2orize-mfa').TokenError;
  
  return function issueToken(client, user, otp, scope, body, authInfo, cb) {
    console.log('OAUTH 2.0 VERIFY OTP');
    console.log(otp)
    console.log(body);
    
    function proceed(err, authenticators) {
      var authenticator, type
        , i = 0;
        
      (function iter(err) {
        if (err) { return cb(err); }
        
        authenticator = authenticators[i++];
        if (!authenticator) {
          // Either the one-time password is invalid, or no authenticators
          // support one-time passwords.  The error is intentionally
          // non-specific, in order to avoid leaking details about what
          // authenticators (if any) the user has registered.
          return cb(new TokenError('Invalid one time password', 'invalid_grant'));
        }
        
        type = authenticator.type;
        if (typeof type == 'string') {
          type = [ type ];
        }
        if (type.indexOf('otp') == -1) {
          return iter();
        }
        
        verify(authenticator, otp, function(err, ok) {
          if (err) { return iter(err); }
          if (!ok) { return iter(); }
          return cb(null, 'some-access-token-goes-here');
        });
      })();
    }
    
    authenticators.list(user, proceed);
  };
};

exports['@require'] = [
  //'http://schemas.authnomicon.org/js/login/mfa/opt/authy/otp/verify',
  //'http://schemas.authnomicon.org/js/login/mfa/opt/duo/otp/verify',
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/otp/verify',
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/UserAuthenticatorsDirectory'
];
