var Marionette = require('backbone.marionette');

module.exports = Router = Marionette.AppRouter.extend({
    appRoutes: {
        '' : 'home',
        'details/:id': 'details',
        'signup': 'signup',
        'login': 'login',
        'logout': 'logout',
        'profile': 'profile'
    }
});
