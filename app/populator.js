/**
 *  Sets a loop to query Coinbase for current buy price and perform analytics
 */

var ncb = require('./ncb.js'),
  twilio = require('./twilio.js'),
  Promise = require('es6-promise').Promise;

// models
var Price = require('../models/prices'),
  User = require('../models/users');

// Constants
// Intervals in milliseconds
var QUERY_INTERVAL = 10000; // Default query (for prices) set at 10 seconds (10000 ms)
var SMS_RESET_INTERVAL = 1800000; // Default sms reset at 30 minutes (1800000 ms)
var TIME_WINDOW = 86400000; // Time in milliseconds of price window; set for 1 day

// High and low alert thresholds for BTC price
BTC_LOWER_THRESHOLD = 200;
BTC_LOWER_SENT = false;
BTC_UPPER_THRESHOLD = 1000;
BTC_UPPER_SENT = false;
var BTC_PERCENTAGE_THRESHOLD = 0.3; // 30% change in value

function startPopulator(interval) {
  // var interval = (typeof interval !== 'undefined') ? interval : QUERY_INTERVAL;
  var interval = interval || QUERY_INTERVAL;

  // loop to get buy and sell prices, store in db
  setInterval(function () {
    var getBuyPrice = ncb.current_price(1, 'buy').then(function(response) {
      return response;
    });
    var getSellPrice = ncb.current_price(1, 'sell').then(function(response) {
      return response;
    });

    Promise.all([getBuyPrice, getSellPrice]).then(function(responses) {
      // Get a timestamp
      var now = new Date();
      console.log(now + ' -- BTC buy: $' + responses[0] + ' sell: $' + responses[1]);

      // Insert the price into the db
      var newPrice = new Price({ // Create a Price model
        timeStamp: now,
        buyPrice: responses[0],
        sellPrice: responses[1]
      });
      newPrice.save(function(err, newPrice) { // Save the model to the database
        console.log('successfully inserted price: ' + newPrice);
      });

      // Perform calculations on prices in the time window
      calculationsOnPrices(TIME_WINDOW);
    }, function(error) {
      console.log(error);
    });
  }, interval);
}

function calculationsOnPrices(timeWindow) {
  // Query for all prices in the last day
  var d = new Date();

  Price.find({
    timeStamp: { $lte: d, $gte: d.valueOf()-timeWindow } // Get results from start of current hour to current time.
  }, function (err, prices) {
    if (err) {
      return handleError(err);
    }
    // console.log(prices);

    // Arrays to hold values for buy and sell price analysis
    var averages = [];
    var stdDevs = [];

    var sums = [];
    sums[0] = 0;
    sums[1] = 0;

    var sumDiffSqs = [];
    sumDiffSqs[0] = 0;
    sumDiffSqs[1] = 0;

    var falling = [];
    falling[0] = false;
    falling[1] = false;

    var count = 0;

    var priceHistory = prices,
      pricesLength = priceHistory.length;

    // Calculate average of prices in the time window
    for (var i=0; i<pricesLength; i++) {
      sums[0] += Number(priceHistory[i].buyPrice);
      sums[1] += Number(priceHistory[i].sellPrice);
      count++;
    }

    averages[0] = sums[0]/count;
    averages[1] = sums[1]/count;

    // Calculate standard deviation
    for (var i=1; i<pricesLength; i++) {
      sumDiffSqs[0] += Math.pow(Number(priceHistory[i].buyPrice-averages[0]), 2);
      sumDiffSqs[1] += Math.pow(Number(priceHistory[i].sellPrice-averages[1]), 2);
    }
    stdDevs[0] = Math.sqrt(sumDiffSqs[0]/count);
    stdDevs[1] = Math.sqrt(sumDiffSqs[1]/count);

    if (pricesLength>0) {
      console.log('window count: ' + count);
      console.log('sum buy: ' + sums[0]);
      console.log('sum sell: ' + sums[1]);
      console.log('average buy: ' + averages[0]);
      console.log('average sell: ' + averages[1]);
      console.log('standard deviation buy: ' + stdDevs[0]);
      console.log('standard deviation sell: ' + stdDevs[1]);
      console.log('current buy price: ' + priceHistory[pricesLength-1].buyPrice);
      console.log('current sell price: ' + priceHistory[pricesLength-1].sellPrice);

      // Check to see if the price is falling
      if ((pricesLength > 1) && (Number(priceHistory[pricesLength-1].buyPrice)-Number(priceHistory[pricesLength-2].buyPrice) < 0)) {
        falling[0] = true;
      }
      if ((pricesLength > 1) && (Number(priceHistory[pricesLength-1].sellPrice)-Number(priceHistory[pricesLength-2].sellPrice) < 0)) {
        falling[1] = true;
      }

      // Message to be sent
      var d = new Date(priceHistory[0].timeStamp);
      var msg = d + ' -- BTC buy: $' + priceHistory[pricesLength-1].buyPrice;
      msg += ' | sell: $' + priceHistory[pricesLength-1].sellPrice;

      // Find all users with lower notification set
      User.find({
        'coinbase.lowerNotification': true
      }, function (err, users) {
        var userLength = users.length;

        // Loop through each user and send notifications
        for (var i=0; i<userLength; i++) {
          if ((Number(priceHistory[pricesLength-1].buyPrice) < users[i].coinbase.lowerThreshold) && falling[1] && !users[i].coinbase.lowerSent && users[i].sms !== undefined) {
            // Send an SMS text message
            console.log('********************** SENDING SMS - Low');
            twilio.sendMessage(users[i].sms, msg + ' and falling').then(function(response) {
              console.log('from: ' + response.from);
              console.log('to: ' + response.to);
              console.log('msg: ' + response.body);

              // remove '+1' from to sms number
              var toNumber = response.to;
              if (toNumber.charAt(0) == '+') {
                toNumber = toNumber.slice(2);
              }

              // find the user with this sms number
              User.findOne({ sms: toNumber }, function (err, user) {
                if (!err) {
                  user.coinbase.lowerSent = true;
                  user.save();
                  console.log('updated lowerSent');
                } else {
                  console.log(err);
                }
              });
            }, function(err) {
              console.log(err);
            });
          }
        }
      });
      // Find all users with upper notification set
      User.find({
        'coinbase.upperNotification': true
      }, function (err, users) {
        var userLength = users.length;
        for (var i=0; i<userLength; i++) {
          if ((Number(priceHistory[pricesLength-1].sellPrice) > users[i].coinbase.upperThreshold) && falling[1] && !users[i].coinbase.upperSent && users[i].sms !== undefined) {
            // Send an SMS text message
            console.log('********************** SENDING SMS - High');
            twilio.sendMessage(users[i].sms, msg + ' and falling').then(function(response) {
              console.log('from: ' + response.from);
              console.log('to: ' + response.to);
              console.log('msg: ' + response.body);

              // remove '+1' from to sms number
              var toNumber = response.to;
              if (toNumber.charAt(0) == '+') {
                toNumber = toNumber.slice(2);
              }

              // find the user with this sms number
              User.findOne({ sms: toNumber }, function (err, user) {
                if (!err) {
                  user.coinbase.upperSent = true;
                  user.save();
                  console.log('updated upperSent');
                } else {
                  console.log(err);
                }
              });
            }, function(err) {
              console.log(err);
            });
          }
        }
      });

      // If the difference of the current price with the average is greater than *percentage* of the average
      // var change = Math.abs(Number(priceHistory[pricesLength-1].sellPrice)-averages[1]);
      // if (change > Number(BTC_PERCENTAGE_THRESHOLD*averages[1])) {
      //  // Send an SMS text message
      //  console.log('********************** SENDING SMS - Percentage Change');
      //  twilio.sendMessage(msg + ' -- buy price change: $' + change);
      // }
    }
  });
};

// Every so often, reset the SMS sent flags
function startResetSentFlags(interval) {
  // var interval = (typeof interval !== 'undefined') ? interval : SMS_RESET_INTERVAL;
  var interval = interval || SMS_RESET_INTERVAL;

  setInterval(function() {
    // Find all users where sent flags are set
    User.find({
        $or: [ { 'coinbase.lowerSent': true }, { 'coinbase.upperSent': true } ]
      }, function (err, users) {
        var userLength = users.length;
        for (var i=0; i<userLength; i++) {
          users[i].set('coinbase.lowerSent', false);
          users[i].set('coinbase.upperSent', false);
          users[i].save(function(err, user) {
            if (!err) {
              console.log('sent flags for user ' + user.username + ' reset to false');
            } else {
              console.log(err);
            }
          });
        }
      });
  }, interval);
}

module.exports = {
  startPopulator: startPopulator,
  startResetSentFlags: startResetSentFlags
}