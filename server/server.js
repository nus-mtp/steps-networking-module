import currentdb from './currentdb';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const config = require('./config.json');

const db = require('./database/mongodbScripts/accessMongoDB').connect(config[currentdb].username,
                                                                    config[currentdb].password,
                                                                    config[currentdb].host,
                                                                    config[currentdb].port,
                                                                    config[currentdb].database);

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '/../dist')));
app.use('/css', express.static(path.join(`${__dirname}/../node_modules/bootstrap/dist/css`)));  // redirect CSS bootstrap
app.use('/js', express.static(path.join(`${__dirname}/../node_modules/bootstrap/dist/js`)));  // redirect js bootstrap
app.use('/tether', express.static(path.join(`${__dirname}/../node_modules/tether/dist/js`)));  // redirect tether
app.use('/jquery', express.static(path.join(`${__dirname}/../node_modules/jquery/dist`)));  // redirect jquery

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../app/index.html`));   // It will find and locate index.html from View or Scripts
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

const localSignUpStrategy = require('./passport/local-signup')(db);
const localLoginStrategy = require('./passport/local-login')(db);
passport.use('local-signup', localSignUpStrategy);
passport.use('local-login', localLoginStrategy);

const authCheckMiddleware = require('./middleware/auth-check');
app.use('/api', authCheckMiddleware);

const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

const userRoutes = require('./routes/user');
app.use('/user', userRoutes);

const eventRoutes = require('./routes/event');
app.use('/event', eventRoutes);

const exhibitionRoutes = require('./routes/exhibition');
app.use('/exhibition', exhibitionRoutes);

const attendanceRoutes = require('./routes/attendance');
app.use('/attendance', attendanceRoutes);

const commentRoutes = require('./routes/comment');
app.use('/comment', commentRoutes);

const messageRoutes = require('./routes/message');
app.use('/message', messageRoutes);

app.listen(process.env.PORT || port, () => {
  const listeningPort = process.env.PORT || port;
  console.log(`Running on ${listeningPort}`);
});
