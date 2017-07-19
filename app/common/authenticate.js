exports = module.exports = function(authenticate) {
  
  return function(req, token, cb) {
    authenticate(token, { dialect: 'http://schemas.authnomicon.org/jwt/oauth-session' }, function(err, tkn, ctx) {
      if (err) { return cb(err); }
      
      // TODO: Check token binding hashes, if any, or any other confirmation methods.
      
      return cb(null, ctx.subject, ctx.authN);
    });
  };
};

exports['@require'] = [
  'http://i.bixbyjs.org/security/authentication/token/authenticate'
];
