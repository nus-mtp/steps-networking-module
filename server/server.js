var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var passport = require('passport');
var config = require('./config.json');

require('./models').connect(config.dbUri);

var app = express();
var port = 3000;

app.use(express.static(path.join(__dirname, '/../dist')));
app.use('/css', express.static(__dirname + '/../node_modules/bootstrap/dist/css'));  // redirect CSS bootstrap

app.get('/',function(req,res){
  res.sendFile('index.html');   //It will find and locate index.html from View or Scripts
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

var localSignUpStrategy = require('./passport/local-signup');
var localLoginStrategy = require('./passport/local-login');
passport.use('local-signup', localSignUpStrategy);
passport.use('local-login', localLoginStrategy);

const authCheckMiddleware = require('./middleware/auth-check');
app.use('/api', authCheckMiddleware);

var authRoutes = require('./routes/auth');
var apiRoutes = require('./routes/api');
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

app.listen(port);

console.log("Running at Port 3000");
