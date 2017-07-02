exports = module.exports = function() {
  
  return function interpret(tkn, options, cb) {
    console.log('INTERPRET TOKEN!');
    console.log(tkn);
    
    var claims = tkn.claims;
    if (!claims.ctx) {
      // The claims within this token cannot be interpreted in accordance with the
      // MFA OOB code dialect.
      return cb();
    }
    
    var params = {};
    params.context = claims.ctx;
        
    return cb(null, params);
  };
};

exports['@implements'] = 'http://i.bixbyjs.org/tokens/interpretClaimsFunc';
exports['@dialect'] = 'http://schemas.authnomicon.org/tokens/jwt/mfa-bind';
