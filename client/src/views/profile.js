var Marionette = require('backbone.marionette');
var plumbing = require('../plumbing');

module.exports = LoginView = Marionette.ItemView.extend({
	template: require('../../templates/profile.hbs'),
	tagName: 'form',
	className: 'form-horizontal',

	events: {
		'submit': 'doSubmit'
	},

	doSubmit: function(event) {
		event.preventDefault();
		
		// Get the logged in user
		var username = this.model.get('username');

		var sms = this.$('#sms').val();

		var lowerThreshold = this.$('#lowerThreshold').val();
		var upperThreshold = this.$('#upperThreshold').val();

		var lowerCheck = this.$("#lowerNotification input").is(":checked");
		var upperCheck = this.$("#upperNotification input").is(":checked");

		this.model.set({
			username: username,
			sms: sms,
			lowerThreshold: lowerThreshold,
			upperThreshold: upperThreshold,
			lowerThresholdCheck: lowerCheck,
			upperThresholdCheck: upperCheck,
		});
		this.model.update();
	},

	onRender: function() {
		this.$el.attr('role', 'form');
	},

	// For filling in non-model values
	templateHelpers: {
		lowerThresholdVal: function() {
			return this.model.get('coinbase').lowerThreshold;
		},
		upperThresholdVal: function() {
			return this.model.get('coinbase').upperThreshold;
		},
		lowerChecked: function() {
			return this.model.get('coinbase').lowerNotification ? 'checked' : '';
		},
		upperChecked: function() {
			return this.model.get('coinbase').upperNotification ? 'checked' : '';
		},
	}
});
