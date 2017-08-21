const jwt = require('jsonwebtoken');
const User = require('../models/user').User;
const logger = require('logops');
const config = require('../config');

class UserService {
  static register(username, password, res) {
    const user = new User({
      username: username,
      password: password
    });

    user.save((err, user) => {
      if (err || !user) {
        logger.error(err);
        res.status(500).send('Incorrect user data');

      } else {
        res.status(200).send('Success!');
      }
    });
  }

  static login(username, password, res) {
    User.findOne({ username: username }, (err, user) => {
      if (err || !user) {
        const user = new User({
          username: username,
          password: password
        });

        user.save((err, user) => {
          if (err || !user) {
            logger.error(err);
            res.status(500).send('Incorrect user data');

          } else {
            jwt.sign({ username: user.username }, config.get('secret'), { expiresIn: '30d' }, function(err, token) {

              if (err) {
                logger.error(err);
                res.status(404).send('Not found');

              } else {
                logger.info(`Created token ${ token }`);
                // res.writeHead(200, { 'Authorization': 'Bearer ' + token });
                // res.write({ token: token, username: username });
                res.send({ token: token, username: username });
              }

            });
            // res.status(200).send('Success!');
          }
        });
        // logger.error(err);
        // return res.status(404).send('User not found');
      } else {

        if(user.checkPassword(password)) {
          jwt.sign({ username: user.username }, config.get('secret'), { expiresIn: '30d' }, function(err, token) {

            if (err) {
              logger.error(err);
              res.status(404).send('Not found');

            } else {
              logger.info(`Created token ${ token }`);
              // res.writeHead(200, { 'Authorization': 'Bearer ' + token });
              // res.write({ token: token, username: username });
              res.send({ token: token, username: username });
            }

          });

        } else {
          logger.error('Invalid user data!');
          res.status(404).send('Invalid password');
        }
      }
    });

  }


}

module.exports = UserService;
