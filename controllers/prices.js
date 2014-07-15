/*
*   Server-side
*   Prices API
*/

var Price = require('../models/prices');

module.exports = {
  index: function(req, res) {
    // var range = 0;
    // if ((req.query.wstart !== 'undefined') && (req.query.wend !== 'undefined')) {
    //   // wstart and wend are epoch time in milliseconds
    //   range = wstart - wend;
    //   // @TODO finish logic for querying a range
    // }

    var conditions = {};
    var fields = {};
    var options = {};

    if (req.query.latest == 'true') {
      options['sort'] = {'timeStamp': -1};
      options['limit'] = 1;
    } else if (req.query.oldest == 'true') {
      options['sort'] = {'timeStamp': 1};
      options['limit'] = 1;
    }

    Price.find(conditions, fields, options, function(err, data) {
      res.json(data);
    });
  },
  getById: function(req, res) {
    var conditions = { _id: req.params.id };
    Price.find(conditions, function(err, price) {
      if (err) {
        res.json({error: 'Price not found.'});
      } else {
        res.json(price);
      }
    });
  }
};
