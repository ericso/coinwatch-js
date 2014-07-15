var home = require('../controllers/home'),
  prices = require('../controllers/prices'),
  users = require('../controllers/users');

module.exports.initialize = function(app) {
  app.get('/', home.index);

  // Prices
  app.get('/api/prices', prices.index);
  app.get('/api/prices/:id', prices.getById);
  // app.post('/api/prices', prices.add);
  // app.put('/api/prices', prices.update);
  // app.delete('/api/prices/:id', prices.delete);

  // Users
  // app.get('/api/users', users.index);
  app.get('/api/users/:id', users.getById);
  app.get('/api/users/username/:username', users.getByUsername);
  app.post('/api/users', users.add);
  app.post('/api/users/login', users.login);

  // app.put('/api/users', users.update);
  app.post('/api/users/update', users.update);

  app.delete('/api/users/:id', users.delete);
};
