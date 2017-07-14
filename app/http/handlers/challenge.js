exports = module.exports = function(Types, oobChallenge, Authenticators, issueToken, initialize, parse, authenticate, authenticateToken, Tokens) {
  var merge = require('utils-merge');
  
  
  function resumeSession(req, res, next) {
    Tokens.decipher(req.body.mfa_token, function(err, claims, issuer) {
      if (err) { return next(err); }
      
      // FIXME: Put this back
      /*
      authenticateToken(claims.subject, issuer, function(err, user) {
        if (err) { return next(err); }
        // TODO: 404, if no user
        
        req.client = req.user;
        req.user = user;
        next();
      });
      */
      
      req.user = { id: '1' }
      next();
    });
  }
  
  
  function list(req, res, next) {
    // TODO: Pass the user record here.
    Authenticators.list(req.user, function(err, authenticators) {
      if (err) { return next(err); }
      res.locals.authenticators = authenticators;
      
      if (!authenticators || authenticators.length == 0 || authenticators[0].active === false) {
        // TODO: Make this a better error.
        res.json({ error: 'enrollment_required' });
        return;
      }
      
      next();
    });
  }
  
  function obtainType(req, res, next) {
    try {
      req.locals.type = Types.obtainAuthenticator('oob');
    } catch (ex) {
      // TODO: next() this as a AuthorizationError of appropriate type
      return next(ex);
    }
    next();
  }
  
  function challengeAuthenticator(req, res, next) {
    var type = req.locals.type;
    var authnr = res.locals.authenticators[0];
    
    function challenged(err, params) {
      if (err) { return next(err); }
      res.locals.params = params;
      next();
    }
    
    var arity = type.challenge.length;
    switch (arity) {
    case 3:
      return type.challenge(authnr, req.body, challenged);
    default:
      return type.challenge(authnr, challenged);
    }
  }
  
  function respond(req, res, next) {
    var body = {};
    merge(body, res.locals.params);
    
    res.json(body);
  }


  return [
    initialize(),
    parse('application/x-www-form-urlencoded'),
    authenticate(['client_secret_basic', 'client_secret_post', 'none']),
    resumeSession,
    list,
    obtainType,
    challengeAuthenticator,
    respond,
  ];
  
};

exports['@require'] = [
  '../../authenticatortypes',
  //'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/challenge',
  'http://schemas.authnomicon.org/js/security/authentication/oob/challenge',
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/UserAuthenticatorsDirectory',
  'http://schemas.authnomicon.org/js/aaa/oauth2/util/issueToken',
  'http://i.bixbyjs.org/http/middleware/initialize',
  'http://i.bixbyjs.org/http/middleware/parse',
  'http://i.bixbyjs.org/http/middleware/authenticate',
  'http://i.bixbyjs.org/security/authentication/token/authenticate',
  'http://i.bixbyjs.org/tokens'
  //'http://schemas.authnomicon.org/js/login/mfa/opt/duo/CredentialDirectory'
  //'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/UserAuthenticatorsDirectory'
];
