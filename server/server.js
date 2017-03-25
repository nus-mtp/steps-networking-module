import currentdb from './currentdb';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const config = require('./config.json');

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

const authCheckMiddleware = require('./middleware/auth-check');

app.use('/api', authCheckMiddleware);

const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

const userRoutes = require('./routes/user');
const eventRoutes = require('./routes/event');
const exhibitionRoutes = require('./routes/exhibition');
const attendanceRoutes = require('./routes/attendance');
const commentRoutes = require('./routes/comment');
const messageRoutes = require('./routes/message');

app.use('/user', userRoutes);
app.use('/event', eventRoutes);
app.use('/exhibition', exhibitionRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/comment', commentRoutes);
app.use('/message', messageRoutes);

const db = require('./database/mongodbScripts/accessMongoDB').connect(
    config[currentdb].username, config[currentdb].password, config[currentdb].host,
    config[currentdb].port, config[currentdb].database, 30,
    (err) => {
      if (err) {
        throw err;
      }

      app.locals.db = db;

      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: false }));
      app.use(passport.initialize());

      const localSignUpStrategy = require('./passport/local-signup')(db);
      const localLoginStrategy = require('./passport/local-login')(db);

      passport.use('local-signup', localSignUpStrategy);
      passport.use('local-login', localLoginStrategy);

      app.listen(process.env.PORT || port, () => {
        const listeningPort = process.env.PORT || port;
        console.log(`Running on ${listeningPort}`);
      });
    });
