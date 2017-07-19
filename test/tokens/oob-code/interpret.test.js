/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../app/tokens/oob-code/interpret');


describe('tokens/oob-code/interpret', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://i.bixbyjs.org/tokens/interpretClaimsFunc');
    expect(factory['@dialect']).to.equal('http://schemas.authnomicon.org/jwt/oob-code');
  });
  
});
