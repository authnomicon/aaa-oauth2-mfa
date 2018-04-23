exports = module.exports = function(issue, authenticate) {
  var oauth2orize = require('oauth2orize-mfa');
  
  return oauth2orize.exchange.oob({ passReqToCallback: true }, authenticate, issue);
}

exports['@implements'] = 'http://schemas.authnomicon.org/js/oauth2/grantType';
exports['@type'] = 'http://auth0.com/oauth/grant-type/mfa-oob';
exports['@require'] = [
  './issue',
  '../common/authenticate'
];
