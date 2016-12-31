exports = module.exports = function(issueCb, authenticate) {
  var oauth2orize = require('oauth2orize-mfa');
  
  return oauth2orize.exchange.oob({ passReqToCallback: true }, authenticate, issueCb);
}

exports['@implements'] = 'http://schema.modulate.io/js/aaa/oauth2/exchange';
exports['@type'] = 'http://auth0.com/oauth/grant-type/2fa-oob';
exports['@require'] = [
  './push/issuecb',
  './common/authenticate'
];
