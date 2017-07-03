exports = module.exports = function(parse, mfaConfirm, otpVerify, Tokens) {
  
  function resumeSession(req, res, next) {
    console.log('!!! RESUME !!!');
    console.log(req.body);
    
    var opt = {};
    opt.dialect = 'http://schemas.authnomicon.org/tokens/jwt/mfa-bind';
    Tokens.decipher(req.body.bind_code, opt, function(err, claims, issuer) {
      //if (err) { return next(err); }
      
      console.log('DECIPHERED!')
      console.log(err);
      console.log(claims);
      
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
      
      // TODO: Also decode mfa_token
      req.user = { id: '1' }
      
      // TODO: Initialize middleware
      req.locals = {};
      req.locals.context = claims.context;
      
      next();
    });
  }
  
  function respond(req, res, next) {
    console.log('CONFIRMING FOR MFA???');
    console.log(req.headers)
    console.log(req.body)
    console.log(req.locals);
    
    var opts = req.locals.context;
    
    if (req.body.authenticator_type == 'otp') {
      console.log('TODO: enroll otp...');
      
      otpVerify({ _userID: 'twitter|1705' }, req.body.otp, { accessToken: req.locals.context.transactionToken }, function(err, ok) {
        console.log(err);
        console.log(ok);
      })
      
      return;
    }
    
    mfaConfirm(opts, function(err, ok) {
      console.log('!! CONFIRMED!');
      console.log(err);
      console.log(ok)
      
      if (err) { return next(err); }
      if (ok === undefined) {
        // TODO: Moutn oauth2 error middleware
        //return next(new TokenError('Authorization pending', 'authorization_pending'));
        return res.json({ error: 'operation_pending' })
      }
      if (!ok) {
        return res.json({ error: 'operation_denied' })
      }
      
      return res.json({ active: true });
    });
  }


  return [
    parse('application/json'),
    resumeSession,
    respond
  ];
  
};

exports['@require'] = [
  'http://i.bixbyjs.org/http/middleware/parse',
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/confirm',
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/otp/verify',
  'http://i.bixbyjs.org/tokens'
];
