exports = module.exports = function(parse, mfaRegister) {
  
  function respond(req, res, next) {
    console.log('REGISTERING FOR MFA???');
    console.log(req.headers)
    console.log(req.body)
    
    mfaRegister(function(err, out) {
      
      
    });
  }


  return [
    parse('application/json'),
    respond
  ];
  
};

exports['@require'] = [
  'http://i.bixbyjs.org/http/middleware/parse',
  'http://schemas.authnomicon.org/js/login/mfa/opt/duo/register'
];
