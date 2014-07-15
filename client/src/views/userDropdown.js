var Marionette = require('backbone.marionette');
	// User = require('../models/user');

module.exports = Marionette.ItemView.extend({
	template: require('../../templates/userDropdown.hbs'),

	tagName: 'ul',
	className: "nav navbar-nav navbar-right",

	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
	},

	isAuthtenticated: function() {
		return this.model.get('isAuthenticated');
	},

	username: function() {
		return this.model.get('username');
	}
	
});
