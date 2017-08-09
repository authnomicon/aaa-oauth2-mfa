exports = module.exports = function(challengeHandler) {
  var express = require('express');
  var router = new express.Router();
  
  router.post('/challenge', challengeHandler);
  
  return router;
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/oauth2/http/MFAChallengeService';
exports['@require'] = [
  './handlers/challenge'
];
