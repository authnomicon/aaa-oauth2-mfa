function AuthenticatorTypes() {
  this._types = {};
}

AuthenticatorTypes.prototype.use = function(type, authnr) {
  this._types[type] = authnr;
};

AuthenticatorTypes.prototype.obtainAuthenticator = function(type) {
  var authnr = this._types[type];
  if (!authnr) { throw new Error('Authenticator type "' + type + '" is not supported'); }
  return authnr;
};


module.exports = AuthenticatorTypes;
