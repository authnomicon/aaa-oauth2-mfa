exports = module.exports = function() {
  
  return function interpret(tkn, options, cb) {
    var claims = tkn.claims;
    if (!claims.chl) {
      // The claims within this token cannot be interpreted in accordance with the
      // MFA OOB code dialect.
      return cb();
    }
    
    var ctx = {};
    
    // TODO: MFA Token hash
    
    ctx.challenge = {};
    
    if (claims.chl.aid) {
      ctx.challenge.method = 'authn';
      ctx.challenge.authenticator = { id: claims.chl.aid };
      ctx.challenge.transactionID = claims.chl.ati;
    }
    if (claims.mt_hash) {
      ctx.mfaTokenHash = claims.mt_hash;
    }
    
    if (claims.enroll) {
      ctx.enroll = true;
    }
    
    return cb(null, ctx);
  };
};

exports['@implements'] = 'http://i.bixbyjs.org/tokens/interpretClaimsFunc';
exports['@dialect'] = 'http://schemas.authnomicon.org/jwt/oob-code';
