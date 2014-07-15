var Backbone = require('backbone'),
    PriceModel = require('../models/price');

module.exports = PricesCollection = Backbone.Collection.extend({
    model:  PriceModel,
    url: '/api/prices?latest=true'
});
