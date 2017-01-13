exports = module.exports = function(verify) {
  
  return function authenticate(req, token, cb) {
    console.log('OAUTH 2.0 AUTHENTICATE 2FA');
    console.log(token);
    
    return cb(null, { id: 1, username: 'johndoe' })
  };
};

exports['@require'] = [];
