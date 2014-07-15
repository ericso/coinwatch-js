var Marionette = require('backbone.marionette');
	// UserDropdown = require('./userDropdown');

module.exports = Marionette.Layout.extend({
	template: require('../../templates/navBar.hbs'),

	regions: {
		userDropdown: '#user-dropdown'
	},

	tagName: 'nav',
	className: 'navbar navbar-inverse',

	onRender: function() {
		this.$el.attr('role', 'navigation');
	},

	onShow: function() {
		this.userDropdown.show(window.App.views.userDropdownView);
	},

	initialize: function() {
		this.listenTo(this.collection, 'change', this.render);
	},

	buyPrice: function() {
		return this.collection.get('buyPrice');
	},

	timeStamp: function() {
		return this.collection.get('timeStamp');
	}

});
