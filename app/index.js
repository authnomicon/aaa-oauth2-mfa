exports = module.exports = {
  'otp/grant': require('./otp/grant'),
  'oob/grant': require('./oob/grant'),
  'recovery/grant': require('./recovery/grant'),
  'tokens/dialects/jwt-oob-code/interpret': require('./tokens/dialects/jwt-oob-code/interpret'),
  'tokens/dialects/jwt-oob-code/translate': require('./tokens/dialects/jwt-oob-code/translate')
};

exports.load = function(id) {
  try {
    return require('./' + id);
  } catch (ex) {
    if (ex.code == 'MODULE_NOT_FOUND') { return; }
    throw ex;
  }
};
