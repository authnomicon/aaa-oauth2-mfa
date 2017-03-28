/* global describe, it */

var pkg = require('..');
var expect = require('chai').expect;


describe('@authnomicon/aaa-oauth2-mfa', function() {
  
  it('should export manifest', function() {
    expect(pkg).to.be.an('object');
    expect(Object.keys(pkg)).to.have.length(6);
    
    expect(pkg['otp/exchange']).to.be.a('function');
    expect(pkg['oob/exchange']).to.be.a('function');
    expect(pkg['recovery/exchange']).to.be.a('function');
    expect(pkg['tokens/oob-code/interpret']).to.be.a('function');
    expect(pkg['tokens/oob-code/translate']).to.be.a('function');
  });
  
});
