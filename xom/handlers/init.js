exports = module.exports = function(challenge) {
  
  function handle(req, res, next) {
    challenge({ id: 1 }, req.params.id, function(err, params) {
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
      body.oob_code = params.txid;
      break;
    }
    
    res.json(body);
  }


  return [
    handle,
    respond
  ];
  
};

exports['@require'] = [
  //'http://schemas.authnomicon.org/js/login/mfa/opt/authy/challenge'
  'http://schemas.authnomicon.org/js/login/mfa/opt/duo/challenge'
];
