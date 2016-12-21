exports = module.exports = function(challenge) {
  
  function handle(req, res, next) {
    console.log('CHALLENGE IT:');
    console.log(req.body);
    
    //challenge({ id: 1 }, req.params.id, function(err, params) {
    challenge({ id: 1 }, req.params.id, { type: 'oob' }, function(err, params) {
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
    handle,
    respond
  ];
  
};

exports['@require'] = [
  //'http://schemas.authnomicon.org/js/login/mfa/opt/authy/challenge'
  //'http://schemas.authnomicon.org/js/login/mfa/opt/duo/challenge'
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/challenge'
];
