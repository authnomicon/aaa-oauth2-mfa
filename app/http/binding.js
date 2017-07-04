exports = module.exports = function(associateHandler, bindHandler) {
  var express = require('express');
  var router = new express.Router();
  
  router.post('/associate', associateHandler);
  //router.post('/bind', bindHandler);
  
  return router;
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/http/oauth2/mfa/BindingService';
exports['@require'] = [
  './handlers/binding/associate',
  './handlers/binding/bind'
];
