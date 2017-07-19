exports = module.exports = function() {
  var Constants = require('../../../lib/constants');
  
  
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
    
    if (claims.amr) {
      ctx.authN = ctx.authN || {};
      ctx.authN.methods = claims.amr.map(function(m) { return Constants.AMR_TO_AUTHN_METHODS_MAP[m]; });
    }
    
    return cb(null, ctx);
  };
};

exports['@implements'] = 'http://i.bixbyjs.org/tokens/interpretClaimsFunc';
exports['@dialect'] = 'http://schemas.authnomicon.org/jwt/oauth-session';
