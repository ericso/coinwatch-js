/* jshint -W030 */
var Price = require('../../models/prices'),
  User = require('../../models/users');

describe('Models', function() {

  describe('Price', function() {
    var schema = Price.schema.paths;

    it('should exist', function() {
      expect(Price).to.exist;
    });

    it('should have "timeStamp" field of type "Date"', function() {
      console.log(JSON.stringify(schema.timeStamp, null, 2));

      expect(schema.timeStamp).to.exist;
      expect(schema.timeStamp.instance).to.equal('Date');
    });

    it('should have "buyPrice" field of type "Number"', function() {
      console.log(JSON.stringify(schema.buyPrice, null, 2));

      expect(schema.buyPrice).to.exist;
      expect(schema.buyPrice.instance).to.equal('Number');
    });

    it('should have "sellPrice" field of type "Number"', function() {
      console.log(JSON.stringify(schema.sellPrice, null, 2));

      expect(schema.sellPrice).to.exist;
      expect(schema.sellPrice.instance).to.equal('Number');
    });
  });

  describe('User', function() {
    var schema = User.schema.paths;

    it('should exist', function() {
      expect(User).to.exist;
    });

    it('should have "username" field of type "String"', function() {
      expect(schema.username).to.exist;
      expect(schema.username.instance).to.equal('String');
    });

    it('should have "password" field of type "String"', function() {
      expect(schema.password).to.exist;
      expect(schema.password.instance).to.equal('String');
    });

    it('should have "gravatar" field of type "String"', function() {
      expect(schema.gravatar).to.exist;
      expect(schema.gravatar.instance).to.equal('String');
    });

    it('should have "loginAttempts" field of type "Number"', function() {
      expect(schema.loginAttempts).to.exist;
      expect(schema.loginAttempts.instance).to.equal('Number');
    });

    it('should have "lockUntil" field of type "Number"', function() {
      expect(schema.lockUntil).to.exist;
      expect(schema.lockUntil.instance).to.equal('Number');
    });

    it('should have "coinbase.lowerThreshold" field of type "Number"', function() {
      expect(schema.coinbase.lowerThreshold).to.exist;
      expect(schema.coinbase.lowerThreshold.instance).to.equal('Number');
    });

    it('should have "sms" field of type "String"', function() {
      expect(schema.sms).to.exist;
      expect(schema.sms.instance).to.equal('String');
    });
  });
});
