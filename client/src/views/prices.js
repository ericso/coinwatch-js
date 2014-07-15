var Marionette = require('backbone.marionette');

var itemView = Marionette.ItemView.extend({
	template: require('../../templates/price_small.hbs'),
	tagName: 'div',
	className: 'price_small',
	
	events: {
		'click': 'showDetails'
	},

	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
	},
	showDetails: function() {
		window.App.core.vent.trigger('app:log', 'Prices View: showDetails hit.');
		window.App.controller.details(this.model.id);
	}
});

module.exports = CollectionView = Marionette.CollectionView.extend({
	
	initialize: function() {
		this.listenTo(this.collection, 'change', this.render);
	},
	
	itemView: itemView
});
