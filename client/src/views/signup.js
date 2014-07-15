var Marionette = require('backbone.marionette');
var plumbing = require('../plumbing');

module.exports = SignupView = Marionette.ItemView.extend({
	template: require('../../templates/signup.hbs'),
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
		this.model.signup().fail(function(resp, textStatus, jqXHR) {
			// Display Bootstrap alert that signup failed
			plumbing.showAlert('alert-area', 'danger', 'Error: signup failed. Please try again.');
			console.error(resp);
		});
	},

	onRender: function() {
		this.$el.attr('role', 'form');
	},
});
