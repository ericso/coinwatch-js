var Marionette = require('backbone.marionette');

module.exports = PriceDetailsView = Marionette.ItemView.extend({
	template: require('../../templates/price_details.hbs'),
	events: {
		'click a.back': 'goBack'
	},

	goBack: function(e) {
		e.preventDefault();
		window.App.controller.home();
	}
});
