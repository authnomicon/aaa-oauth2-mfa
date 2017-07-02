exports = module.exports = function(parse, mfaAssociate) {
  
  function restoreContext(req, res, next) {
    req.user = { id: '1' }
    next();
    
    // FIXME: Put this back
    /*
    Tokens.decipher(req.body.mfa_token, function(err, claims, issuer) {
      if (err) { return next(err); }
      
      authenticateToken(claims.subject, issuer, function(err, user) {
        if (err) { return next(err); }
        // TODO: 404, if no user
        
        req.client = req.user;
        req.user = user;
        next();
      });
    });
    */
  }
  
  function respond(req, res, next) {
    console.log('REGISTERING FOR MFA???');
    console.log(req.headers)
    console.log(req.body)
    console.log(req.user)
    
    mfaAssociate(req.user, function(err, params) {
      
      var body = {};
      body.authenticator_type = 'oob';
      body.secret = params.secret;
      body.url = params.url;
      
      return res.json(body);
    });
  }


  return [
    parse('application/json'),
    // TODO: Authenticate OAuth client
    restoreContext,
    respond
  ];
  
};

exports['@require'] = [
  'http://i.bixbyjs.org/http/middleware/parse',
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/associate'
];
