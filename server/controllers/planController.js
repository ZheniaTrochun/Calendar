const User = require('../models/user').User;
const PlanService = require('../services/planService');
const jwt = require('jsonwebtoken');
const config = require('../config');
const logger = require('logops');

class PlanController {
  static getAllPlansForUser(req, res) {
    jwt.verify(req.headers.authorization.split(' ')[1], config.get('secret'), (err, decoded) => {
      if (err) {
        logger.error(err);
        res.status(404).send();
      } else {
        PlanService.getAllPlansForUser(decoded.username, res);
      }
    });
  }

  static syncronizePlans(req, res) {
    // console.log(req.body);
    jwt.verify(req.headers.authorization.split(' ')[1], config.get('secret'), (err, decoded) => {
      if (err) {
        logger.error(err);
        res.status(404).send();
      } else {
        console.log(decoded.username, req.body.plans);
        PlanService.syncronizePlans(decoded.username, req.body.plans, res);
      }
    });
  }

  static deletePlanByIndex(req, res) {
    jwt.verify(req.headers.authorization.split(' ')[1], config.get('secret'), (err, decoded) => {
      if (err) {
        logger.error(err);
        res.status(404).send();
      } else {
        PlanService.deletePlanByIndex(decoded.username, req.body.date, req.body.index, res);
      }
    });
  }

  static addPlan(req, res) {
    jwt.verify(req.headers.authorization.split(' ')[1], config.get('secret'), (err, decoded) => {
      if (err) {
        logger.error(err);
        res.status(404).send();
      } else {
        PlanService.addPlan(decoded.username, req.body.plan, res);
      }
    });
  }

  static updatePlan(req, res) {
    jwt.verify(req.headers.authorization.split(' ')[1], config.get('secret'), (err, decoded) => {
      if (err) {
        logger.error(err);
        res.status(404).send();
      } else {
        PlanService.updatePlan(decoded.username, req.body.newPlans, res);
      }
    });
  }
};

module.exports = PlanController;
