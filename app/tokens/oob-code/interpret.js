exports = module.exports = function() {
  
  return function interpret(tok, options, cb) {
    var claims = tok.claims;
    if (!claims.chl) {
      // The claims within this token cannot be interpreted in accordance with the
      // MFA OOB code dialect.
      return cb();
    }
    
    var params = {};
    /*
    params.subject = { id: claims.sub };
    params.client = { id: claims.cid };
    */
    
    // TODO: MFA Token hash
    
    params.challenge = {};
    
    if (claims.chl.aid) {
      params.challenge.method = 'authn';
      params.challenge.authenticator = { id: claims.chl.aid };
      params.challenge.transactionID = claims.chl.ati;
    }
    
    if (claims.enroll) {
      params.enroll = true;
    }
    
    return cb(null, params);
  };
};

exports['@implements'] = 'http://i.bixbyjs.org/tokens/interpretClaimsFunc';
exports['@dialect'] = 'http://schemas.authnomicon.org/jwt/oob-code';
