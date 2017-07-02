exports = module.exports = function(parse, mfaConfirm) {
  
  function respond(req, res, next) {
    console.log('CONFIRMING FOR MFA???');
    console.log(req.headers)
    console.log(req.body)
    
    var opts = {};
    
    mfaConfirm(opts, function(err, out) {
      
      
    });
  }


  return [
    parse('application/json'),
    respond
  ];
  
};

exports['@require'] = [
  'http://i.bixbyjs.org/http/middleware/parse',
  'http://schemas.authnomicon.org/js/login/mfa/opt/duo/confirm'
];
