exports = module.exports = function() {
  
  
  return function translate(ctx, options, cb) {
    console.log('TRANSLATE TO OOB CODE JWT!');
    console.log(ctx);
    console.log(options)
    
    var claims = {}
      , chal, i, len;
    
    if (ctx.user) {
      claims.sub = ctx.user.id;
    }
    
    if (ctx.client) {
      // https://tools.ietf.org/html/draft-ietf-oauth-token-exchange-07#section-4.3
      claims.cid = ctx.client.id;
    }
    
    if (ctx.challenge) {
      chal = ctx.challenge;
      switch (chal.method) {
      case 'authn':
        claims.chl = {};
        claims.chl.aid = chal.authenticator.id;
        claims.chl.ati = chal.transactionID;
        break;
      default:
        // TODO: throw error;
      }
    }
    
    
    // https://tools.ietf.org/html/draft-ietf-oauth-token-exchange-07#section-4.2
    
    
    return cb(null, claims);
  };
};

exports['@implements'] = 'http://i.bixbyjs.org/tokens/translate';
exports['@dialect'] = 'http://schemas.authnomicon.org/oauth/token-type/jwt-mfa-token';
