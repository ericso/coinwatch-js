var Marionette = require('backbone.marionette'),
	PricesView = require('./views/prices'),
	PriceDetailsView = require('./views/price_details'),
	SignupView = require('./views/signup'),
	LoginView = require('./views/login'),
	ProfileView = require('./views/profile'),
	UserDropdownView = require('./views/userDropdown'),
	AppLayoutView = require('./views/appLayout');

module.exports = Controller = Marionette.Controller.extend({
	initialize: function() {
		App.core.vent.trigger('app:log', 'Controller: Initializing');
		window.App.views.pricesView = new PricesView({ collection: window.App.data.prices });
		window.App.views.userDropdownView = new UserDropdownView({ model: window.App.currentUser });

		// Render app layout
		App.core.appRegion.show(new AppLayoutView({ collection: window.App.data.prices }));
	},

	home: function() {
		App.core.vent.trigger('app:log', 'Controller: "Home" route hit.');
		var view = window.App.views.pricesView;

		// Render the price in the div with id=content
		App.core.appRegion.currentView.content.show(view);
		// this.renderView(view);
		window.App.router.navigate('#');
	},

	details: function(id) {
		App.core.vent.trigger('app:log', 'Controller: "Prices Details" route hit.');
		var view = new PricesDetailsView({ model: window.App.data.prices.get(id)});
		this.renderView(view);
		window.App.router.navigate('details/' + id);
	},

	signup: function() {
		App.core.vent.trigger('app:log', 'Controller: "Signup" route hit.');
		
		var view = new SignupView({ model: window.App.currentUser });
		App.core.appRegion.currentView.content.show(view);
		window.App.router.navigate('signup');
	},

	login: function() {
		App.core.vent.trigger('app:log', 'Controller: "Login" route hit.');
		
		var view = new LoginView({ model: window.App.currentUser });
		App.core.appRegion.currentView.content.show(view);
		window.App.router.navigate('login');
	},

	logout: function() {
		App.core.vent.trigger('app:log', 'Controller: "Logout" route hit.');
		
		window.App.currentUser.set('isAuthenticated', false);
		window.App.currentUser.unset('username');
		window.App.currentUser.unset('gravatar');
		window.App.currentUser.unset('coinbase');
		window.App.currentUser.unset('sms');

		var view = new LoginView({ model: window.App.currentUser });
		App.core.appRegion.currentView.content.show(view);
		window.App.router.navigate('login');
	},

	profile: function() {
		App.core.vent.trigger('app:log', 'Controller: "Profile" route hit.');

		var view = new ProfileView({ model: window.App.currentUser });
		App.core.appRegion.currentView.content.show(view);
		window.App.router.navigate('profile');
	},

	renderView: function(view) {
		this.destroyCurrentView(view);
		App.core.vent.trigger('app:log', 'Controller: Rendering new view.');
		$('#js-coinwatch-app').html(view.render().el);
	},

	destroyCurrentView: function(view) {
		if (!_.isUndefined(window.App.views.currentView)) {
			App.core.vent.trigger('app:log', 'Controller: Destroying existing view.');
			window.App.views.currentView.close();
		}
		window.App.views.currentView = view;
	}
});
