exports = module.exports = function(parse, oobAssociate, Tokens) {
  
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
    
    oobAssociate(req.user, { channel: 'auth0' }, function(err, params) {
      if (err) { return next(err); }
      
      var ctx = {};
      // TODO: Remove these, hash with MFA/access token
      ctx.user = req.user;
      ctx.client = req.user;
      /*
      ctx.audience = [ {
        id: 'http://localhost/mfa',
        secret: 'some-secret-shared-with-oauth-authorization-server'
      } ];
      */
      ctx.audience = [ {
        id: 'http://localhost/token',
        //secret: 'some-shared-with-rs-s3cr1t-asdfasdfaieraadsfiasdfasd'
        secret: 'some-secret-shared-with-oauth-authorization-server'
      } ];
      ctx.challenge = {
        method: 'authn',
        authenticator: { id: params.providedID }, // TODO: Create authenticator record
        transactionID: params.transactionID
      }
      // TODO: Use vectors of trust to indicate this?
      // https://tools.ietf.org/html/draft-richer-vectors-of-trust-00
      ctx.enroll = true;
    
      var opt = {};
      opt.dialect = 'http://schemas.authnomicon.org/tokens/jwt/mfa-oob-code';
      //opt.dialect = 'http://schemas.authnomicon.org/tokens/jwt/mfa-bind';
      // TODO: Make this confidential
      opt.confidential = false;
    
      // TODO: Ensure that code has a TTL of 10 minutes
      Tokens.cipher(ctx, opt, function(err, code) {
        console.log(err);
        console.log(code);
        
        if (err) { return next(err); }
        
        var body = {};
        body.authenticator_type = 'oob';
        body.barcode_uri = params.barcodeURL;
        body.oob_code = code;
        return res.json(body);
      });
      
      /*
      var body = {};
      body.authenticator_type = 'oob';
      body.secret = params.secret;
      body.url = params.url;
      
      return res.json(body);
      */
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
  'http://schemas.authnomicon.org/js/security/authentication/oob/associate',
  //'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/associate',
  'http://i.bixbyjs.org/tokens'
];
