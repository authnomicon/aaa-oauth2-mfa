function AuthenticatorTypes() {
  this._types = {};
}

AuthenticatorTypes.prototype.use = function(type, iface) {
  this._types[type] = iface;
};

AuthenticatorTypes.prototype.obtainAuthenticator =
AuthenticatorTypes.prototype.obtainInterface = function(type) {
  var iface = this._types[type];
  if (!iface) { throw new Error('Authenticator type "' + type + '" is not supported'); }
  return iface;
};


module.exports = AuthenticatorTypes;
