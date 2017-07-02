exports = module.exports = function(createHandler, confirmHandler) {
  var express = require('express');
  var router = new express.Router();
  
  router.post('/', createHandler);
  router.post('/confirm', confirmHandler);
  
  return router;
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/http/oauth2/mfa/RegistrationService';
exports['@require'] = [
  './handlers/registration/create',
  './handlers/registration/confirm'
];
