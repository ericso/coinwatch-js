var express = require('express'),
  http = require('http'),
  path = require('path'),
  exphbs = require('express3-handlebars'),
  mongoose = require('mongoose');

var routes = require('./app/routes'),
  populator = require('./app/populator');

var app = express();

app.set('port', process.env.PORT || 3333);
app.set('views', __dirname + '/views');
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  layoutsDir: app.get('views') + '/layouts'
}));
app.set('view engine', 'handlebars');

app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('some-secret-value-here'));
app.use(app.router);
app.use('/', express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//connect to the db server:
mongoose.connect('mongodb://localhost/coinwatch');
mongoose.connection.on('open', function() {
  console.log("Connected to Mongoose in server.js");

  // check if the db is empty, if so seed it with some contacts:
  populator.startPopulator();
  populator.startResetSentFlags();
});

//routes list:
routes.initialize(app);

//finally boot up the server:
http.createServer(app).listen(app.get('port'), function() {
  console.log('Server up: http://localhost:' + app.get('port'));
});
