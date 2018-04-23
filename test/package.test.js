/* global describe, it */

var expect = require('chai').expect;


describe('@authnomicon/oauth2-mfa', function() {
  
  describe('package.json', function() {
    var json = require('../package.json');
    
    it('should have assembly metadata', function() {
      expect(json.assembly.namespace).to.equal('org.authnomicon/oauth2/mfa');
      
      expect(json.assembly.components).to.have.length(11);
      expect(json.assembly.components).to.include('http/challenge');
      expect(json.assembly.components).to.include('http/association');
      expect(json.assembly.components).to.include('http/middleware/mfarequired');
      expect(json.assembly.components).to.include('oob/authenticator');
      expect(json.assembly.components).to.include('oob/grant');
      expect(json.assembly.components).to.include('otp/grant');
      expect(json.assembly.components).to.include('recovery/grant');
      expect(json.assembly.components).to.include('tokens/oob-code/interpret');
      expect(json.assembly.components).to.include('tokens/oob-code/translate');
      expect(json.assembly.components).to.include('tokens/session/interpret');
      expect(json.assembly.components).to.include('tokens/session/translate');
    });
  });
  
  it('should throw if required', function() {
    expect(function() {
      var pkg = require('..');
    }).to.throw(Error).with.property('code', 'MODULE_NOT_FOUND');
  });
  
});
