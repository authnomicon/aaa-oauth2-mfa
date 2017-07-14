/* global describe, it */

var expect = require('chai').expect;


describe('@authnomicon/aaa-oauth2-mfa', function() {
  
  describe('package.json', function() {
    var json = require('../package.json');
    
    it('should have assembly metadata', function() {
      expect(json.assembly.namespace).to.equal('oauth2/mfa');
      
      expect(json.assembly.components).to.have.length(7);
      expect(json.assembly.components).to.include('oob/exchange');
    });
  });
  
  it('should throw if required', function() {
    expect(function() {
      var pkg = require('..');
    }).to.throw(Error).with.property('code', 'MODULE_NOT_FOUND');
  });
  
});
