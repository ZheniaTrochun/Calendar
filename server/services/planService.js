const User = require('../models/user').User;
const logger = require('logops');
const config = require('../config');

class PlanService {
  static getAllPlansForUser(username, res) {
    User.findOne({ username: username }, (err, user) => {
      if (err || !user) {
        logger.error(err);
        res.status(404).send();

      } else {
        res.send(user.plans);
      }
    });
  }

  static syncronizePlans(username, plans, res) {
    User.findOne({ username: username }, (err, user) => {
      if (err || !user) {
        logger.error(err);
        res.status(404).send();

      } else {
        if (!user.plannedEvents) user.plannedEvents = {};

        if (plans) {
          Object.keys(plans).forEach(key => {
            if (!user.plannedEvents[key]) {
              user.plannedEvents[key] = plans[key];
            }

            plans[key].forEach(item => {
              let index = -1;
              item.date = new Date(item.date);

              user.plannedEvents[key].forEach((userItem, i) => {
                userItem.date = new Date(userItem.date);

                if((item.name === userItem.name) &&
                      (item.date.getMinutes() == userItem.date.getMinutes()) &&
                            (item.date.getHours() == userItem.date.getHours())) {
                  index = i;
                }
              });

              if (index == -1) {
                user.plannedEvents[key].push(item);
              }
            });
          });
        }

        user.markModified('plannedEvents');

        user.save((err, updated) => {
          if (err) {
            logger.error(err);
            res.status(500).send();
          } else {

            res.send(updated.plannedEvents);
          }
        });
      }
    });
  }

  static deletePlanByIndex(username, date, index, res) {
    User.findOne({ username: username }, (err, user) => {

      if (err || !user || !user.plannedEvents[date] || (user.plannedEvents[date].length <= index)) {
        logger.error(err);
        res.status(404).send();

      } else {
        user.plannedEvents[date].splice(index, 1);

        user.markModified('plannedEvents');

        user.save((err, updated) => {
          if (err) {
            logger.error(err);
            res.status(500).send();
          }
        });
      }
    });
  }

  static addPlan(username, plan, res) {
    plan.date = new Date(plan.date);

    User.findOne({ username: username }, (err, user) => {
      if (err || !user) {
        logger.error(err);
        res.status(404).send();

      } else {
        if (!user.plannedEvents) user.plannedEvents = {};

        if(user.plannedEvents[plan.date.toDateString()])
          user.plannedEvents[plan.date.toDateString()].push(plan);
        else
          user.plannedEvents[plan.date.toDateString()] = [plan];

        user.markModified('plannedEvents');

        user.save((err, updated) => {
          if (err) {
            logger.error(err);
            res.status(500).send();
          } else {

            res.status(200).send();
          }
        });

      }
    });
  }

  static updatePlan(username, newPlans, res) {
    User.findOne({ username: username }, (err, user) => {
      if (err || !user) {
        logger.error(err);
        res.status(404).send();

      } else {

        user.plannedEvents = newPlans;

        user.markModified('plannedEvents');

        user.save((err, updated) => {
          if (err) {
            logger.error(err);
            res.status(500).send();
          } else {
            
            res.status(200).send();
          }
        });

      }
    });
  }
};

module.exports = PlanService;
