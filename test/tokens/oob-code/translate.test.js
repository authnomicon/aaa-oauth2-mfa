/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../app/tokens/oob-code/translate');


describe('tokens/oob-code/translate', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://i.bixbyjs.org/tokens/translateContextFunc');
    expect(factory['@dialect']).to.equal('http://schemas.authnomicon.org/tokens/jwt/mfa-oob-code');
  });
  
});
