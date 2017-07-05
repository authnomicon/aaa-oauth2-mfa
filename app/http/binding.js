exports = module.exports = function(associateHandler) {
  var express = require('express');
  var router = new express.Router();
  
  router.post('/associate', associateHandler);
  
  return router;
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/http/oauth2/mfa/BindingService';
exports['@require'] = [
  './handlers/binding/associate'
];
