exports = module.exports = function(container, logger) {
  // Load modules.
  var AuthenticatorTypes = require('../lib/authenticatortypes');
  
  
  var registry = new AuthenticatorTypes();
  
  return Promise.resolve(registry)
    .then(function(registry) {
      // Register authenticator types.
      var typeComps = container.components('http://schemas.authnomicon.org/js/oauth2/mfa/AuthenticatorType');
    
      return Promise.all(typeComps.map(function(comp) { return comp.create(); } ))
        .then(function(types) {
          types.forEach(function(type, i) {
            registry.use(typeComps[i].a['@type'], type);
            logger.info('Loaded OAuth 2.0 MFA authenticator type: ' + typeComps[i].a['@type']);
          });
        })
        .then(function() {
          return registry;
        });
    })
    .then(function(registry) {
      return registry;
    });
};

exports['@singleton'] = true;
exports['@require'] = [ '!container', 'http://i.bixbyjs.org/Logger' ];
