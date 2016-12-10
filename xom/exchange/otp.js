exports = module.exports = function(issueCb) {
  var oauth2orize = require('oauth2orize-mfa');
  
  return oauth2orize.exchange.otp(issueCb);
}

exports['@implements'] = 'http://schema.modulate.io/js/aaa/oauth2/exchange';
exports['@type'] = 'http://auth0.com/oauth/grant-type/mfa-otp';
exports['@require'] = [ './otp/issuecb' ];
