var Backbone = require('backbone');

module.exports = PriceModel = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: 'api/prices'
});
