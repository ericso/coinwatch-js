var Backbone = require('backbone');
var plumbing = require('../plumbing');

module.exports = UserModel = Backbone.Model.extend({

	idAttribute: '_id',

	urlRoot: 'api/users',
	
	signup: function() {
		return Backbone.ajax({
			url: _.result(this, 'url'),
			type: 'post',
			contentType: 'application/json',
			data: JSON.stringify(this.pick('username', 'password')),
			dataType: 'json'
		})
		.done(_.bind(function(resp, textStatus, jqXHR) {
			this.unset('password');
			this.set('isAuthenticated', true);

			this.set('gravatar', resp.gravatar);
			this.set('coinbase', resp.coinbase);
			// this.set('sms', resp.sms);

			App.core.vent.trigger('app:log', 'User model: Signed up and logged in.');
			App.core.vent.trigger('user:login');
		}, this));
	},

	authenticate: function() {
		return Backbone.ajax({
			url: _.result(this, 'url') + '/login',
			type: 'post',
			contentType: 'application/json',
			data: JSON.stringify(this.pick('username', 'password')),
			dataType: 'json'
		})
		.done(_.bind(function(resp, textStatus, jqXHR) {
			this.unset('password');
			this.set('isAuthenticated', true);

			this.set('gravatar', resp.gravatar);
			this.set('coinbase', resp.coinbase);
			this.set('sms', resp.sms);
			// this.model = resp;

			// User model announces to app we're logged in
			App.core.vent.trigger('app:log', 'User model: Logged in.');
			App.core.vent.trigger('user:login');
		}, this))
		.fail(function(resp, textStatus, jqXH) {
			plumbing.showAlert('alert-area', 'danger', 'Error: login failed. Please try again');
			console.error('login failed');
			console.error(resp);
		});
	},

	update: function() {
		return Backbone.ajax({
			url: _.result(this, 'url') + '/update',
			type: 'post',
			contentType: 'application/json',
			data: JSON.stringify(this.pick('username', 'sms', 'lowerThreshold', 'upperThreshold', 'lowerThresholdCheck', 'upperThresholdCheck')),
			dataType: 'json'
		})
		.done(_.bind(function(resp, textStatus, jqXHR) {
			// Set user model with updated info from server
			this.set('gravatar', resp.gravatar);
			this.set('coinbase', resp.coinbase);
			this.set('sms', resp.sms);

			App.core.vent.trigger('app:log', 'User model: profile updated.');
			plumbing.showAlert('alert-area', 'success', 'Thresholds updated.');
		}, this))
		.fail(function(resp, textStatus, jqXH) {
			plumbing.showAlert('alert-area', 'danger', 'Error: profile update failed.');
			console.error(resp);
		});
	},
});
