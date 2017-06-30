exports = module.exports = function(challengeHandler) {
  var express = require('express');
  var router = new express.Router();
  
  router.post('/challenge', challengeHandler);
  
  return router;
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/http/oauth2/MFAService';
exports['@require'] = [
  './handlers/challenge'
];
