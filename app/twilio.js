/**
 * Module for interacting with Twilio
 */

 var Promise = require('es6-promise').Promise;

// Number setup on Twillio account
var FROM_SMS = '+18127164426';

// Twillio creds
TWILIO_ACCOUNT_SID = 'XXXX';
TWILIO_AUTH_TOKEN = 'XXXX';

// require the Twilio module and create a REST client
var twilio_client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// sendMessages returns a JS promise
function sendMessage(number, message) {
  // Create message options hash
  var msgOpts = {
    to: number,
    from: FROM_SMS,
    body: message
  };

  return new Promise(function(resolve, reject) {
    // Send sms using Twilio client
    twilio_client.sendMessage(msgOpts, function(err, resp) {
      if (err) {
        reject(Error(err));
      } else {
        resolve(resp);
      }
    });
  });

}

module.exports = {
  sendMessage: sendMessage
}
