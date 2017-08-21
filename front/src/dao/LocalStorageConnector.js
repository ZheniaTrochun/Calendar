'use strict';

import Plan from '../model/PlannedEvent.js';
import superagent from 'superagent';


// something similar to crud interface
// dao for HTML5 Local Storage
class LocalStorageConnector {

// method for getting object from local storage, or creating if none is present
  constructor() {
    this.syncronizePlans();
  }

  syncronizePlans() {
    this.calendarPlans = JSON.parse(localStorage.getItem('myCalendarData'));

    const inst = this;

    const token = this.getAccessToken();

    if (token) {
      superagent
        .post('http://localhost:8000/syncronizePlans')
        .send({ plans: inst.calendarPlans })
        .set('Authorization', 'Bearer ' + token)
        .end(function(err, res){

          if (!err) {
            inst.calendarPlans = res.body;
            localStorage.setItem('myCalendarData', res.body ? JSON.stringify(res.body) : {});
          }

        });
    }

    if(!this.calendarPlans) {
      console.log('empty storage');
      this.calendarPlans = {};
      localStorage.setItem('myCalendarData', JSON.stringify(this.calendarPlans));
    } else {
      console.log('obj in storage');
    }
  }

  saveAccessToken(token) {
    localStorage.removeItem('myCalendarAccessToken');
    localStorage.setItem('myCalendarAccessToken', token);
  }

  getAccessToken() {
    return localStorage.getItem('myCalendarAccessToken');
  }

  saveCurrentUser(username) {
    localStorage.removeItem('myCalendarCurrentUser');
    localStorage.setItem('myCalendarCurrentUser', username);
  }

  getCurrentUser() {
    return localStorage.getItem('myCalendarCurrentUser');
  }

// getter by month
  getAllPlansByMonth(date) {
    const res = [];
    const tmpDate = new Date(date.getFullYear(), date.getMonth(), 1);

    do {
      if (this.calendarPlans[tmpDate.toDateString()]) {
        for(let i = 0; i < this.calendarPlans[tmpDate.toDateString()].length; i++) {
          res.push(this.calendarPlans[tmpDate.toDateString()][i]);
        }
      }
      tmpDate.setDate(tmpDate.getDate() + 1);
    } while(tmpDate.getMonth() === date.getMonth());

    return res;
  }

// getter by date
  getAllPlansByDate(date) {
    return this.calendarPlans[date.toDateString()];
  }

// save method with checking plan duration and correct setting it in local storage
  addPlan(plan) {
    const tmpDate = new Date(plan.date.getFullYear(), plan.date.getMonth(),
            plan.date.getDate(), plan.date.getHours(), plan.date.getMinutes(), 0);
    tmpDate.setHours(tmpDate.getHours() + Math.floor(plan.duration));
    tmpDate.setMinutes(tmpDate.getMinutes() + (plan.duration - Math.floor(plan.duration)) * 60);

    if(tmpDate.getDate() != plan.date.getDate()) {

      const newPlan = new Plan(plan.name, plan.description,
        new Date(plan.date.getFullYear(), plan.date.getMonth(), plan.date.getDate() + 1, 0, 0, 0),
         ((24 - plan.date.getHours()) - (plan.date.getMinutes() / 60 - (plan.duration - Math.floor(plan.duration)))) );

      this.addPlan(newPlan);

      const planFormated = new Plan(plan.name, plan.description,
         new Date(plan.date.getFullYear(), plan.date.getMonth(), plan.date.getDate(), plan.date.getHours(), plan.date.getMinutes(), 0),
          plan.duration - newPlan.duration);

      plan.duration = plan.duration - newPlan.duration;
    }

    if(this.calendarPlans[plan.date.toDateString()])
      this.calendarPlans[plan.date.toDateString()].push(plan);
    else
      this.calendarPlans[plan.date.toDateString()] = [plan];


    const token = this.getAccessToken();

    if (token) {

      superagent
        .post('http://localhost:8000/addPlan')
        .send({ plan: plan })
        .set('Authorization', 'Bearer ' + token)
        .end(function(err, res){

          if (err) {
            console.error(err);
          }
        });
    }

    localStorage.removeItem('myCalendarData');
    localStorage.setItem('myCalendarData', JSON.stringify(this.calendarPlans));
  }

// method for plan removing from local storage
  removePlan(plan) {
    let deleteIndex = -1;

    this.calendarPlans[plan.date.toDateString()].forEach((item, i) => {

      item.date = new Date(item.date);
      if((item.name === plan.name) &&
            (item.date.getMinutes() == plan.date.getMinutes()) &&
                  (item.date.getHours() == plan.date.getHours())) {
        deleteIndex = i;
      }
    });

    if (deleteIndex != -1) {
      this.calendarPlans[plan.date.toDateString()].splice(deleteIndex, 1);

      const token = this.getAccessToken();

      if (token) {
        superagent
          .post('http://localhost:8000/deletePlan')
          .send({ index: deleteIndex, date: plan.date.toDateString() })
          .set('Authorization', 'Bearer ' + token)
          .end(function(err, res){

            if (err) {
              console.error(err);
            }
          });
      }

      localStorage.removeItem('myCalendarData');
      localStorage.setItem('myCalendarData', JSON.stringify(this.calendarPlans));
    }
  }

// method for updating plan
  updatePlan(oldPlan, newPlan) {

    this.calendarPlans = JSON.parse(localStorage.getItem('myCalendarData'));

    let index = -1;

    this.calendarPlans[oldPlan.date.toDateString()].forEach((item, i) => {
      item.date = new Date(item.date);
      if((item.name === oldPlan.name) &&
            (item.date.getMinutes() == oldPlan.date.getMinutes()) &&
                  (item.date.getHours() == oldPlan.date.getHours())) {
        index = i;
      }
    });

    if (index != -1) {
      this.calendarPlans[oldPlan.date.toDateString()][index] = newPlan;

      const inst = this;
      const token = this.getAccessToken();

      if (token) {
        superagent
          .post('http://localhost:8000/updatePlan')
          .send({ plans: inst.calendarPlans })
          .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlRlc3RlcjEyMyIsImlhdCI6MTUwMzI2NTAzMywiZXhwIjoxNTA1ODU3MDMzfQ.Ro8ksyquJ9BBpMDT_MjDoq29WH9VAC-AROcz5VbP2TQ')
          .end(function(err, res){
            if (err) {
              console.error(err);
            }
          });
      }

      localStorage.removeItem('myCalendarData');
      localStorage.setItem('myCalendarData', JSON.stringify(this.calendarPlans));
    }
  }

// number of plan in current day getter
  getNumberOfPlansByDate(date) {
    return this.calendarPlans[date.toDateString()] ? this.calendarPlans[date.toDateString()].length : 0;
  }
}

const dao = new LocalStorageConnector();

export default dao;
