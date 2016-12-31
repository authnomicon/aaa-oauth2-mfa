exports = module.exports = function(issueCb, authenticateCb) {
  var oauth2orize = require('oauth2orize-mfa');
  
  return oauth2orize.exchange.otp({ passReqToCallback: true }, authenticateCb, issueCb);
}

exports['@implements'] = 'http://schema.modulate.io/js/aaa/oauth2/exchange';
exports['@type'] = 'http://auth0.com/oauth/grant-type/mfa-otp';
exports['@require'] = [ './otp/issuecb', './common/authenticate' ];
