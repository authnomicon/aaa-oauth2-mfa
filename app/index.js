exports = module.exports = {
  'otp/exchange': require('./otp/exchange'),
  'oob/exchange': require('./oob/exchange'),
  'recovery/exchange': require('./recovery/exchange'),
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
