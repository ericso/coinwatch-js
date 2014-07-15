var Marionette = require('backbone.marionette'),
	NavBar = require('./navBar');

var plumbing = require('../plumbing');

module.exports = Marionette.Layout.extend({
	template: require('../../templates/appLayout.hbs'),
	
	regions: {
		nav: '#nav',
		content: '#content'
	},

	onShow: function() {
		this.nav.show(new NavBar({ collection: this.collection }));
	}
});
