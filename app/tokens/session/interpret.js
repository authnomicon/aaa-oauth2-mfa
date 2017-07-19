exports = module.exports = function() {
  
  return function interpret(tkn, options, cb) {
    var claims = tkn.claims;
    if (!(claims.iss || claims.sub || claims.aud)) {
      // not a dialect we understand
      return cb();
    }
    
    var ctx = {};
    ctx.subject = { id: claims.sub };
    ctx.client = { id: claims.cid };
    
    if (claims.req) {
      ctx.request = {};
      ctx.request.scope = claims.req.scp;
      ctx.request.audience = claims.req.aud;
    }
    
    return cb(null, ctx);
  };
};

exports['@implements'] = 'http://i.bixbyjs.org/tokens/interpretClaimsFunc';
exports['@dialect'] = 'http://schemas.authnomicon.org/jwt/oauth-session';
