exports = module.exports = function(credentialsDir) {
  
  // TODO: Authenticate this based on access token (Bearer)
  
  function list(req, res, next) {
    // TODO: Pass the user record here.
    credentialsDir.list({ id: '1' }, function(err, credentials) {
      if (err) { return next(err); }
      res.locals.credentials = credentials;
      next();
    });
  }
  
  function respond(req, res, next) {
    res.json({
      credentials: res.locals.credentials
    });
  }


  return [
    list,
    respond
  ];
  
};

exports['@require'] = [
  'http://schemas.authnomicon.org/js/login/mfa/opt/authy/UserAuthenticatorsDirectory'
  //'http://schemas.authnomicon.org/js/login/mfa/opt/duo/CredentialDirectory'
  //'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/UserAuthenticatorsDirectory'
];
