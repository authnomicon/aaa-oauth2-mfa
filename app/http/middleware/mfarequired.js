exports = module.exports = function(Tokens) {

  
  return function() {
    return function(err, req, res, next) {
      if (err.code !== 'mfa_required') {
        return next(err);
      }
      
      console.log('HANDLE MFA ERROR!');
      
      var ctx = {};
      ctx.user = err.user;
      ctx.client = req.user;
      ctx.request = err.request;
      ctx.authN = err.context;
      
      ctx.audience = [ {
        id: 'http://localhost/authorization_code',
        secret: 'some-secret-shared-with-oauth-authorization-server'
      } ];
      /*
      ctx.audience = [ {
        id: 'http://localhost/mfa',
        secret: 'some-secret-shared-with-oauth-authorization-server'
        //secret: 'some-shared-with-rs-s3cr1t-asdfasdfaieraadsfiasdfasd'
      } ];
      */
      //ctx.permissions = [ { resource: resources[0], scope: decision.allowed } ];
      
      var opt = {};
      opt.dialect = 'http://schemas.authnomicon.org/jwt/oauth-session';
      // TODO: Make this confidential
      opt.confidential = false;
      
      // TODO: Ensure that code has a TTL of 10 minutes
      Tokens.cipher(ctx, opt, function(ierr, mfaToken) {
        if (ierr) { return next(ierr); }
        
        var e = {};
        e.error = 'mfa_required';
        if (err.message) { e.error_description = err.message; }
        if (err.uri) { e.error_uri = err.uri; }
        e.mfa_token = mfaToken;
      
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify(e));
      });
    };
  };
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/oauth2/http/middleware/mfaRequiredErrorHandler';
exports['@require'] = [
  'http://i.bixbyjs.org/tokens'
];
