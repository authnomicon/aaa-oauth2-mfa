exports = module.exports = function() {
  var Constants = require('../../../lib/constants');
  
  
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
    
    if (ctx.authN) {
      claims.amr = ctx.authN.methods.map(function(m) { return Constants.AUTHN_METHODS_TO_AMR_MAP[m]; });
    }
    
    return cb(null, claims);
  };
};

exports['@implements'] = 'http://i.bixbyjs.org/tokens/translateContextFunc';
exports['@dialect'] = 'http://schemas.authnomicon.org/jwt/oauth-session';
