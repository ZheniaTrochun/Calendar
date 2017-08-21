import Vue from "vue";
import Router from "vue-router";
import WeekTable from "../components/WeekTable.vue";
import MonthTable from "../components/MonthTable.vue";
import Month from "../components/Month.vue";
import Year from "../components/Year.vue";
import Home from "../components/Home.vue";


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/week/:dateStr',
      name: 'WeekTable',
      component: WeekTable,
      props: true,
      keepAlive: true
    },
    {
      path: '/month/:dateStr',
      name: 'Month',
      component: Month,
      props: true,
      keepAlive: true
    },
    {
      path: '/year/:dateStr',
      name: 'Year',
      component: Year,
      props: true,
      keepAlive: true
    }
  ],
  mode: 'history'
})
