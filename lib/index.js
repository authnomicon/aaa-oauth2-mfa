exports = module.exports = {
  'otp/grant': require('./otp/grant'),
  'oob/grant': require('./oob/grant')
};

exports.load = function(id) {
  try {
    return require('./' + id);
  } catch (ex) {
    if (ex.code == 'MODULE_NOT_FOUND') { return; }
    throw ex;
  }
};
