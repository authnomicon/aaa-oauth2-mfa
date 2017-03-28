/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../app/recovery/issue');


describe('recovery/issue', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@singleton']).to.be.undefined;
  });
  
});
