exports = module.exports = function(createHandler) {
  var express = require('express');
  var router = new express.Router();
  
  router.post('/associate', createHandler);
  
  return router;
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/http/oauth2/mfa/AssociationService';
exports['@require'] = [
  './handlers/association/create'
];
