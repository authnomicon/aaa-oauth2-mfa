exports = module.exports = function(challenge, associate, Tokens) {
  
  return {
    
    associate: function(user, body, cb) {
      console.log('OOB ASSOC');
      console.log(user);
      console.log(body);
      
      associate(user, { channel: 'auth0' }, function(err, authnr, txid, rparams) {
        console.log('ASSOCIATED');
        console.log(err);
        console.log(authnr);
        console.log(txid);
        console.log(rparams);
        
        
        if (err) { return cb(err); }
        
        var ctx = {};
        // TODO: Remove these, hash with MFA token
        //ctx.user = req.user;
        //ctx.client = req.user;
        ctx.audience = [ {
          id: 'http://localhost/token',
          //secret: 'some-shared-with-rs-s3cr1t-asdfasdfaieraadsfiasdfasd'
          secret: 'some-secret-shared-with-oauth-authorization-server'
        } ];
        ctx.challenge = {
          method: 'authn',
          authenticator: authnr,
          transactionID: txid
        }
        // TODO: Use vectors of trust to indicate this?
        // https://tools.ietf.org/html/draft-richer-vectors-of-trust-00
        ctx.enroll = true;
      
        var opt = {};
        opt.dialect = 'http://schemas.authnomicon.org/tokens/jwt/mfa-oob-code';
        // TODO: Make this confidential
        opt.confidential = false;
    
        // TODO: Ensure that code has a TTL of 10 minutes
        Tokens.cipher(ctx, opt, function(err, oobCode) {
          if (err) { return cb(err); }
          
          var params = {
            authenticator_type: 'oob',
            oob_code: oobCode,
          }
          params.barcode_uri = rparams.barcodeURL;
          
          // TODO: Implement channel binding support
          /*
          if (params.binding) {
            body.binding_method = params.binding.method;
          }
          */
          
          return cb(null, params);
        });
      });
    },  // associate
    
    challenge: function(authnr, body, cb) {
      
      challenge(authnr, function(err, txid) {
        if (err) { return cb(err); }
        
        var ctx = {};
        // TODO: Remove these, hash with MFA token
        //ctx.user = req.user;
        //ctx.client = req.user;
        ctx.audience = [ {
          id: 'http://localhost/token',
          //secret: 'some-shared-with-rs-s3cr1t-asdfasdfaieraadsfiasdfasd'
          secret: 'some-secret-shared-with-oauth-authorization-server'
        } ];
        ctx.challenge = {
          method: 'authn',
          authenticator: authnr,
          transactionID: txid
        }
      
        var opt = {};
        opt.dialect = 'http://schemas.authnomicon.org/tokens/jwt/mfa-oob-code';
        // TODO: Make this confidential
        opt.confidential = false;
    
        // TODO: Ensure that code has a TTL of 10 minutes
        Tokens.cipher(ctx, opt, function(err, oobCode) {
          if (err) { return cb(err); }
          
          var params = {
            challenge_type: 'oob',
            oob_code: oobCode
          }
          
          // TODO: Implement channel binding support
          /*
          if (params.binding) {
            body.binding_method = params.binding.method;
          }
          */
          
          return cb(null, params);
        });
      });
    } // challenge
    
  };
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/oauth2/mfa/authenticatorType';
exports['@type'] = 'oob';
exports['@require'] = [
  'http://schemas.authnomicon.org/js/security/authentication/oob/challenge',
  'http://schemas.authnomicon.org/js/security/authentication/oob/associate',
  'http://i.bixbyjs.org/tokens'
];
