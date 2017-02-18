exports = module.exports = function(challenge, Authenticators, authenticator, authenticateToken, Tokens) {
  
  // TODO: Authenticate this based on access token (Bearer)
  
  function resumeSession(req, res, next) {
    console.log('RESUMING SESSION...');
    console.log(req.user);
    console.log(req.body);
    
    // TODO: Fix all this business
    Tokens.unseal(req.body.mfa_token, function(err, tok) {
      console.log('GOT IT!');
      console.log(err);
      console.log(tok);
      
      if (err) { return next(err); }
      
      Tokens.interpret(tok, function(err, params) {
        console.log('INTERPRETED');
        console.log(err);
        console.log(params);
        
        authenticateToken(params.subject, tok.header.issuer, function(err, user) {
          console.log('AUTHENTICATED!');
          console.log(err);
          console.log(user);
          
          req.client = req.user;
          req.user = user;
          next();
        });
        
      });
    });
    
    // TODO: Make an `entity` option to authenticate to set that.
    //req.client = req.user;
    //req.user = { id: '1', username: 'joe' }
    //next();
  }
  
  
  function list(req, res, next) {
    // TODO: Pass the user record here.
    Authenticators.list(req.user, function(err, authenticators) {
      if (err) { return next(err); }
      res.locals.authenticators = authenticators;
      next();
    });
  }
  
  function respond(req, res, next) {
    // TODO: Strip an private properties prefixed by underscore
    
    console.log('CONTINUE MFA!');
    console.log(res.locals.authenticators);
    
    var authnr = res.locals.authenticators[0];
    challenge(authnr, function(err, params, ctx) {
      if (err) { return next(err); }
      
      console.log(params)
      console.log(ctx);
      
      params = params || { type: 'otp' };
      ctx = ctx || {};
      
      res.locals.params = params;
      res.locals.code = ctx.transactionID || '1234';
      next();
    });
    
    //res.json({
    //  credentials: res.locals.credentials
    //});
  }
  
  function respond2(req, res, next) {
    var params = res.locals.params;
    
    var body = {}
    body.mfa_type = params.type;
    
    switch (params.type) {
    case 'otp':
      break;
    case 'oob':
      body.oob_code = res.locals.code;
      if (params.confirmation) {
        body.confirmation_channel = params.confirmation.channel;
      }
      break;
    }
    
    
    console.log('RESPOND WITH BODY:');
    console.log(body);
    
    res.json(body);
  }


  return [
    require('body-parser').urlencoded({ extended: false }),
    authenticator.authenticate(['client_secret_basic', 'client_secret_post', 'none'], { session: false, failWithError: true }),
    resumeSession,
    list,
    respond,
    respond2
  ];
  
};

exports['@require'] = [
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/challenge',
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/UserAuthenticatorsDirectory',
  'http://i.bixbyjs.org/http/Authenticator',
  'http://i.bixbyjs.org/aaa/token/authenticate',
  'http://i.bixbyjs.org/tokens'
  //'http://schemas.authnomicon.org/js/login/mfa/opt/duo/CredentialDirectory'
  //'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/UserAuthenticatorsDirectory'
];
