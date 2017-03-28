/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../app/recovery/exchange');


describe('recovery/exchange', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://schemas.authnomicon.org/js/aaa/oauth2/exchange');
    expect(factory['@type']).to.equal('http://auth0.com/oauth/grant-type/mfa-recovery-code');
  });
  
});
