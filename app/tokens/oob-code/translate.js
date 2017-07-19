exports = module.exports = function() {
  
  return function translate(ctx, options, cb) {
    var claims = {}
      , chal, i, len;
    
    /*
    if (ctx.user) {
      claims.sub = ctx.user.id;
    }
    if (ctx.client) {
      // https://tools.ietf.org/html/draft-ietf-oauth-token-exchange-07#section-4.3
      claims.cid = ctx.client.id;
    }
    */
      
    // TODO: Bind to MFA token, if possible
      
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
    
    if (ctx.enroll == true) {
      claims.enroll = true;
    }
    
    return cb(null, claims);
  };
};

exports['@implements'] = 'http://i.bixbyjs.org/tokens/translateContextFunc';
exports['@dialect'] = 'http://schemas.authnomicon.org/jwt/oob-code';
