/* global describe, it */

var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../app/oob/grant');


describe('oob/grant', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://schemas.authnomicon.org/js/oauth2/grantType');
    expect(factory['@type']).to.equal('http://auth0.com/oauth/grant-type/mfa-oob');
  });
  
  describe('creating grant', function() {
    var oobSpy = sinon.stub();
    var issue = function(){};
    var authenticate = function(){};
    
    var factory = $require('../../app/oob/grant',
      { 'oauth2orize-mfa': { exchange: { oob: oobSpy } } });
    var exchange = factory(issue, authenticate);
    
    it('should create exchange', function() {
      expect(oobSpy).to.have.been.calledOnce;
      expect(oobSpy).to.have.been.calledWithExactly({ passReqToCallback: true }, authenticate, issue);
    });
  });
  
});
