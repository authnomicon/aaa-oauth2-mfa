exports = module.exports = function(Types, Authenticators, issueToken, authenticateToken, initialize, parse, authenticate, Tokens) {
  var merge = require('utils-merge');
  
  
  function restoreSession(req, res, next) {
    var token = req.body.mfa_token;
    
    Tokens.decipher(token, { dialect: 'http://schemas.authnomicon.org/jwt/oauth-session' }, function(err, ctx) {
      if (err) { return next(err); }
      
      // TODO: Check that the client is the same as that in ctx.
      
      req.oauth2 = {};
      
      // The HTTP credentials authenticate the OAuth client, and the subject of
      // the token identifies the entity which is authorizing access.
      req.oauth2.client = req.user;
      req.user = ctx.subject;
      
      req.oauth2.req = ctx.request;
      next();
    });
  }
  
  function loadAuthenticators(req, res, next) {
    // TODO: Pass the user record here.
    Authenticators.list(req.user, function(err, authnrs) {
      if (err) { return next(err); }
      res.locals.authnrs = authnrs;
      
      if (!authnrs || authnrs.length == 0 || authnrs[0].active === false) {
        // TODO: Make this a better error.
        res.json({ error: 'enrollment_required' });
        return;
      }
      
      next();
    });
  }
  
  function selectAuthenticator(req, res, next) {
    req.locals.authnr = res.locals.authnrs[0];
    next();
  }
  
  function obtainInterface(req, res, next) {
    // TODO: Iterate over authenticator types property to get this (for fallbacks to OTP, etc)
    
    try {
      req.locals.iface = Types.obtainAuthenticator('oob');
    } catch (ex) {
      // TODO: next() this as a AuthorizationError of appropriate type
      return next(ex);
    }
    next();
  }
  
  function challengeAuthenticator(req, res, next) {
    var iface = req.locals.iface;
    var authnr = req.locals.authnr;
    
    function challenged(err, params) {
      if (err) { return next(err); }
      res.locals.params = params;
      next();
    }
    
    var arity = iface.challenge.length;
    switch (arity) {
    case 3:
      return iface.challenge(authnr, req.body, challenged);
    default:
      return iface.challenge(authnr, challenged);
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
    restoreSession,
    loadAuthenticators,
    selectAuthenticator,
    obtainInterface,
    challengeAuthenticator,
    respond,
  ];
  
};

exports['@require'] = [
  '../../authenticatortypes',
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/UserAuthenticatorsDirectory',
  'http://schemas.authnomicon.org/js/aaa/oauth2/util/issueToken',
  'http://i.bixbyjs.org/security/authentication/token/authenticate',
  'http://i.bixbyjs.org/http/middleware/initialize',
  'http://i.bixbyjs.org/http/middleware/parse',
  'http://i.bixbyjs.org/http/middleware/authenticate',
  'http://i.bixbyjs.org/tokens'
];
