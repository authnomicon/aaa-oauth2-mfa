exports = module.exports = function(challengeHandler, bindingService) {
  var express = require('express');
  var router = new express.Router();
  
  router.post('/challenge', challengeHandler);
  
  return router;
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/http/oauth2/mfa/ChallengeService';
exports['@require'] = [
  './handlers/challenge',
  './association'
];
