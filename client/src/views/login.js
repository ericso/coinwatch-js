var Marionette = require('backbone.marionette');

module.exports = LoginView = Marionette.ItemView.extend({
	template: require('../../templates/login.hbs'),
	tagName: 'form',
	className: 'form-inline',

	events: {
		'click button.back': 'goBack',
		'submit': 'doSubmit'
	},
	
	goBack: function(event) {
		event.preventDefault();
		window.App.controller.home();
	},

	doSubmit: function(event) {
		event.preventDefault();
		var username = this.$('#username').val();
		var password = this.$('#password').val();
		this.model.set({
			username: username,
			password: password
		});
		this.model.authenticate();
	},

	onRender: function() {
		this.$el.attr('role', 'form');
	},
});
