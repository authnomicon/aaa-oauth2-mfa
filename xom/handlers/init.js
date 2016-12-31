exports = module.exports = function(challenge, authenticators) {
  
  function initialize(req, res, next) {
    console.log('CHALLENGE IT:');
    console.log(req.body);
    console.log(req.params);
    
    req.locals = req.locals || {};
    next();
  }
  
  function loadAuthenticator(req, res, next) {
    authenticators.get(req.user, req.params.id, function(err, authenticator) {
      if (err) { return next(err); }
      
      console.log(authenticator);
      req.locals.authenticator = authenticator;
      next();
    });
  }
  
  function handle(req, res, next) {
    
    
    
    //challenge({ id: 1 }, req.params.id, function(err, params) {
    challenge(req.locals.authenticator, { type: 'otp' }, function(err, params) {
      if (err) { return next(err); }
      
      params = params || { type: 'otp' };
      res.locals.params = params;
      next();
    });
  }
  
  function respond(req, res, next) {
    var params = res.locals.params;
    
    var body = {}
    body.mfa_type = params.type;
    
    switch (params.type) {
    case 'otp':
      break;
    case 'oob':
      body.oob_code = params.transactionID;
      break;
    }
    
    
    console.log('RESPOND WITH BODY:');
    console.log(body);
    
    res.json(body);
  }


  return [
    require('body-parser').urlencoded({ extended: false }),
    initialize,
    loadAuthenticator,
    handle,
    respond
  ];
  
};

exports['@require'] = [
  'http://schemas.authnomicon.org/js/login/mfa/opt/authy/challenge',
  //'http://schemas.authnomicon.org/js/login/mfa/opt/duo/challenge',
  //'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/challenge',
  'http://schemas.authnomicon.org/js/login/mfa/opt/authy/UserAuthenticatorsDirectory'
];
