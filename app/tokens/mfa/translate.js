exports = module.exports = function() {
  
  return function translate(ctx, options, cb) {
    var claims = {};
    
    if (ctx.user) {
      claims.sub = ctx.user.id;
    }
    if (ctx.client) {
      // https://tools.ietf.org/html/draft-ietf-oauth-token-exchange-07#section-4.3
      claims.cid = ctx.client.id;
    }
    
    if (ctx.request) {
      claims.req = {};
      // TODO: Make these not arrays, if possible
      if (ctx.request.scope) {
        claims.req.scp = ctx.request.scope;
      }
      if (ctx.request.audience) {
        claims.req.aud = ctx.request.audience;
      }
    }
    
    return cb(null, claims);
  };
};

exports['@implements'] = 'http://i.bixbyjs.org/tokens/translateContextFunc';
exports['@dialect'] = 'http://schemas.authnomicon.org/jwt/mfa';
