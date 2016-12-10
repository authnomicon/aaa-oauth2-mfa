exports = module.exports = {
  'exchange/otp': require('./xom/exchange/otp'),
  'exchange/push': require('./xom/exchange/push')
};

exports.load = function(id) {
  try {
    return require('./xom/' + id);
  } catch (ex) {
    if (ex.code == 'MODULE_NOT_FOUND') { return; }
    throw ex;
  }
};
