/**
 * Module for interacting with Coinbase
 * modified to use promises
 */

var HotTap = require('hottap').hottap,
  _ = require('underscore'),
  Promise = require('es6-promise').Promise;

var base_url = 'https://coinbase.com/api/v1/';

module.exports = {
  current_price: function(amount, mode) {
    // Queries coinbase api for current price
    // amount: (Int) amount of bitcoins
    // mode: (String) buy or sell
    var url = base_url + 'prices/' + mode + '?qty=' + amount;
    return new Promise(function(resolve, reject) {
      HotTap(url).request('GET', function(err, response) {
        if (err) {
          reject(Error(err));
        } else if (response.status != 200) {
          reject(Error('invalid status ' + response.status + ' received'));
        } else {
          var json = JSON.parse(response.body);
          if (_.isUndefined(json.amount) || _.isUndefined(json.currency) ) {
            reject(Error('invalid response received'));
          } else {
            if (json.currency != 'USD') {
              reject(Error('invalid currency received'));
            } else {
              resolve(json.amount);
            }
          }
        }
      });
    });
  },

  balance: function(api_key) {
    var url = base_url + 'account/balance?api_key=' + api_key;
    return new Promise(function(resolve, reject) {
      HotTap(url).request('GET', function(err, response) {
        if (err) {
          reject(Error(err));
        } else if (response.status != 200) {
          reject(Error('invalid status ' + response.status + ' received'));
        } else {
          var json = JSON.parse(response.body);
          if (_.isUndefined(json.amount) || _.isUndefined(json.currency) ) {
            reject(Error('invalid response received'));
          } else {
            if (json.currency != 'USD') {
              reject(Error('invalid currency received'));
            } else {
              resolve(json.amount);
            }
          }
        }
      });
    });
  },

  send_btc: function(api_key, email, amount, note) {
    var url = base_url + 'transactions/send_money?api_key=' + api_key;
    var o_body = {
      transaction : {
        to : email,
        amount : amount,
        note : note
      }
    };
    return new Promise(function(resolve, reject) {
      HotTap(url).request( "POST", { "Content-Type" : "application/json" }, JSON.stringify(o_body), function(err, response) {
        if (err) {
          reject(Error(err));
        } else if (response.status != 200) {
          reject(Error('invalid status ' + response.status + ' received'));
        } else {
          var json = JSON.parse(response.body);
          if (_.isUndefined(json.success)) {
            reject(Error('invalid response received (no success)'));
          } else {
            if (!json.success) {
              reject(Error(JSON.stringify(json.errors)));
            } else {
              if (_.isUndefined(json.transaction.id)) {
                reject(Error('invalid response received (no transaction id)'));
              }
              return resolve(json.transaction.id);
            }
          }
        }
      });
    });
  }
}
