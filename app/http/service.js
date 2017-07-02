exports = module.exports = function(challengeHandler, registrationService) {
  var express = require('express');
  var router = new express.Router();
  
  router.post('/challenge', challengeHandler);
  router.use('/register', registrationService);
  
  return router;
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/http/oauth2/mfa/Service';
exports['@require'] = [
  './handlers/challenge',
  './registration'
];
