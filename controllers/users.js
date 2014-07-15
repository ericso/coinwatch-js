/*
*   Server-side
*   Prices API
*/

var User = require('../models/users'),
  md5 = require('MD5'),
  _  = require('underscore');

module.exports = {
  // index: function(req, res) {
  //  User.find({}, function(err, data) {
  //    res.json(data);
  //  });
  // },

  getById: function(req, res) {
    User.find({ _id: req.params.id }, function(err, user) {
      if (err) {
        res.json(401, {error: 'User not found.'});
      } else {
        res.json(user);
      }
    });
  },

  getByUsername: function(req, res) {
    User.findOne({ username: req.params.username }, function(err, user) {
      if (err) {
        res.json(401, {error: 'User not found.'});
      } else {
        res.json(user);
      }
    });
  },

  login: function(req, res) {
    // attempt to authenticate user
    User.getAuthenticated(req.body.username, req.body.password, function(err, user, reason) {
      if (err) {
        console.log('unknown error during login');
        res.json(401, {error: 'unknown error during login'});
      }

      // login was successful if we have a user
      if (user) {
        // handle login success
        user.password = null;
        console.log('user ' + user.username + ' logged in');
        res.json(200, user);
      }

      // otherwise we can determine why we failed
      var reasons = User.failedLogin;
      switch (reason) {
        case reasons.NOT_FOUND:
          // @TODO send back error codes
          res.json(401, {error: 'login failed: user not found'});
        case reasons.PASSWORD_INCORRECT:
          // note: these cases are usually treated the same - don't tell
          // the user *why* the login failed, only that it did
          res.json(401, {error: 'login failed: incorrect password'});
          break;
        case reasons.MAX_ATTEMPTS:
          // send email or otherwise notify user that account is
          // temporarily locked
          res.json(401, {error: 'login failed: exceeded max attemps... please wait a while before logging in'});
          break;
      }
    });
  },

  add: function(req, res) {
    var newUser = new User(req.body);

    // Check if email/username exists
    User.findOne({ username: newUser.username }, function(err, user) {
      if (user == null) {
        // User not found, create a new user
        newUser.gravatar = md5(newUser.username);
        newUser.save(function(err, user) {
          if (err) {
            res.json(401, {error: 'Error adding user.'});
          } else {
            user.password = null;
            console.log('user ' + user.username + ' signed up');
            res.json(200, user);
          }
        });
      } else {
        res.json(401, {error: 'Username exists. Please use a different email/username.'});
      }
    });
  },

  // update: function(req, res) {
  //  // User.update({ _id: req.body.id }, req.body, function(err, numberUpdated, raw) {
  //  var toUpdate = {
  //    username: req.body.username
  //  }
  //  User.update({ username: req.body.oldUsername }, toUpdate, function(err, numberUpdated, raw) {
  //    if (err) {
  //      res.json(401, { error: 'Contact not found.' });
  //    } else {
  //      res.json(200, { 'numberUpdated': numberUpdated, 'raw response': raw });
  //    }
  //  });
  // },
  update: function(req, res) {
    var username = req.body.username;
    var lowerThreshold = req.body.lowerThreshold;
    var upperThreshold = req.body.upperThreshold;
    var lowerThresholdCheck = req.body.lowerThresholdCheck;
    var upperThresholdCheck = req.body.upperThresholdCheck;
    var sms = req.body.sms;

    User.findOne({ username: username }, function (err, modifiedUser) {
      if (err) {
        res.json(404, { error: 'User not found.'});
      } else {
        modifiedUser.set('coinbase.lowerThreshold', lowerThreshold);
        modifiedUser.set('coinbase.upperThreshold', upperThreshold);
        modifiedUser.set('coinbase.lowerNotification', lowerThresholdCheck);
        modifiedUser.set('coinbase.upperNotification', upperThresholdCheck);
        modifiedUser.set('sms', sms);
        modifiedUser.save(function(err, user) {
          user.password = null;
          console.log('user ' + user.username + ' updated');
          res.json(200, user);
        });
      }
    });
  },

  delete: function(req, res) {
    User.findOne({ _id: req.params.id }, function(err, user) {
      if (err) {
        res.json(401, {error: 'User not found.'});
      } else {
        user.remove(function(err, user){
          res.json(200, {status: 'Success'});
        })
      }
    });
  },

  setLowerThreshold: function(req, res) {
    console.log('Setting lower threshold to $' + req.params.price);
    BTC_LOWER_THRESHOLD = req.params.price;
    res.send('Setting lower threshold to $' + BTC_LOWER_THRESHOLD);
  },

  setUpperThreshold: function(req, res) {
    console.log('Setting upper threshold to $' + req.params.price);
    BTC_UPPER_THRESHOLD = req.params.price;
    res.send('Setting upper threshold to $' + BTC_UPPER_THRESHOLD);
  },

  getThresholds: function(req, res) {
    res.send('<p>Lower: ' + BTC_LOWER_THRESHOLD + '</p><p>Upper: ' + BTC_UPPER_THRESHOLD + '</p>');
  },

  getCurrent: function(req, res) {
    db.collection('prices', function(err, collection) {
      collection.find().sort({time:-1}).toArray(function(err, items) {
        var d = new Date(items[0].time);
        res.send('Current price: $' + items[0].value + ' at ' + d);
      });
    });
  }
};
