const express = require('express');
const expressLogging = require('express-logging');
const logger = require('logops');
const config = require('./config');
const User = require('./models/user').User;
const bodyParser = require('body-parser');
const UserService = require('./services/userService');
const PlanController = require('./controllers/planController');
const passport = require('passport');
const Strategy = require('passport-http-bearer').Strategy;
const jwt = require('jsonwebtoken');

const UserController = require('./controllers/userController');

passport.use(new Strategy((token, cb) => {
  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) {
      logger.error(err);
      cb(err);
    }

    User.findOne({ username: decoded.username }, (err, user) => {
      if (err) {
        logger.error(err);
        cb(err);
      }

      cb(null, user);
    });
  });
}));

const app = express();

const port = config.get("port");

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,authorization');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

  next();
})

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(expressLogging(logger));

// app.get('/', passport.authenticate('bearer', { session: false }), (req, res) => {
//   console.log('done');
// });

app.post('/login', (req, res) => {
  UserController.login(req, res);
});

app.post('/syncronizePlans', passport.authenticate('bearer', { session: false }), PlanController.syncronizePlans);

app.post('/deletePlan', passport.authenticate('bearer', { session: false }), PlanController.deletePlanByIndex);

app.post('/addPlan', passport.authenticate('bearer', { session: false }), PlanController.addPlan);

app.post('/updatePlan', passport.authenticate('bearer', { session: false }), PlanController.updatePlan);

app.listen(port, () => {
  console.log(`App listening on port ${ port }`);
});
