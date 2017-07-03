exports = module.exports = function() {
  
  return function translate(ctx, options, cb) {
    var claims = {}
     
    console.log('BIND THIS!');
    console.log(ctx);
    
    // TODO: Put some at_hash of the mfa_token...
    claims.aty = ctx.type;
    claims.ctx = ctx.context;
    return cb(null, claims);
  };
};

exports['@implements'] = 'http://i.bixbyjs.org/tokens/translateContextFunc';
exports['@dialect'] = 'http://schemas.authnomicon.org/tokens/jwt/mfa-bind';
