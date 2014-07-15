var Marionette = require('backbone.marionette'),
	Controller = require('./controller'),
	Router = require('./router'),
	PricesCollection = require('./collections/prices'),
	UserModel = require('./models/user');

module.exports = App = function App() {};

/*** Override mixinTemplateHelpers for Handelbars templates ***/
Backbone.Marionette.ItemView.prototype.mixinTemplateHelpers = function(target) {
	var self = this;
	var templateHelpers = Marionette.getOption(self, "templateHelpers");
	var result = {};

	target = target || {};

	if (_.isFunction(templateHelpers)) {
		templateHelpers = templateHelpers.call(self);
	}

	// This _.each block is what we're adding
	_.each(templateHelpers, function(helper, index) {
		if (_.isFunction(helper)) {
			result[index] = helper.call(self);
		} else {
			result[index] = helper;
		}
	});

	return _.extend(target, result);
};

App.prototype.start = function() {
	App.core = new Marionette.Application();

	// add regions
	App.core.addRegions({
		appRegion: '#js-coinwatch-app'
	});

	App.core.on("initialize:before", function (options) {
		App.core.vent.trigger('app:log', 'App: Initializing');

		App.views = {};
		App.data = {};
		App.currentUser = new UserModel();
		App.currentUser.set('isAuthenticated', false);
		App.currentUser.set('username', null);

		// load up some initial data:
		var prices = new PricesCollection();
		prices.fetch({
			success: function() {
				App.data.prices = prices;
				App.core.vent.trigger('app:start');
			}
		});
	});

	App.core.vent.bind('app:start', function(options) {
		App.core.vent.trigger('app:log', 'App: Starting');
		
		if (Backbone.history) {
			App.controller = new Controller();
			App.router = new Router({ controller: App.controller });
			App.core.vent.trigger('app:log', 'App: Backbone.history starting');

			// // Render app layout
			// App.core.appRegion.show(new AppLayoutView());
			// rendering the app layout in controller
			
			Backbone.history.start();
		}

		// new up and views and render for base app here...
		App.core.vent.trigger('app:log', 'App: Done starting and running!');
	});

	// log in user
	App.core.vent.bind('user:login', function() {
		App.controller.home();
	});

	// logging to console
	App.core.vent.bind('app:log', function(msg) {
		console.log(msg);
	});

	App.core.start();
};
