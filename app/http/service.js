exports = module.exports = function(challengeHandler, bindingService) {
  var express = require('express');
  var router = new express.Router();
  
  router.post('/challenge', challengeHandler);
  
  // POST /associate
  // POST /bind
  router.use('/', bindingService);
  
  return router;
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/http/oauth2/mfa/Service';
exports['@require'] = [
  './handlers/challenge',
  './binding'
];
