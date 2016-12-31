exports = module.exports = function(verify) {
  var TokenError = require('oauth2orize-mfa').TokenError;
  
  return function issueToken(client, user, otp, scope, body, authInfo, cb) {
    console.log('OAUTH 2.0 VERIFY OTP');
    console.log(otp)
    
    // TODO: Put user and deviceID here
    verify(undefined, undefined, otp, function(err, ok) {
      if (err) { return cb(err); }
      if (!ok) {
        return cb(new TokenError('Invalid one time password', 'invalid_grant'));
      }
      return cb(null, 'some-access-token-goes-here');
    });
  };
};

exports['@require'] = [
  'http://schemas.authnomicon.org/js/login/mfa/opt/authy/otp/verify'
  //'http://schemas.authnomicon.org/js/login/mfa/opt/duo/otp/verify'
  //'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/otp/verify'
];
