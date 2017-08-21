
<!-- Component for month vith nav visualisation, holds MonthTable component -->
<template lang="html">
  <div>

    <v-layout row wrap>
      <v-flex xs3>
        <v-btn class="deep-purple navBtn" router :href="prevMonth()">
          <v-icon light x-large>arrow_back</v-icon>
        </v-btn>
      </v-flex>
      <v-flex xs6>
        <v-card class="deep-purple">
          <v-card-text>
            <h5>{{ date.toLocaleString("en-US", options).split(' ')[0] + ' ' + year }}</h5>
            <v-btn icon @click.native.stop="rightDrawer = !rightDrawer" class="listBtn">
              <v-icon x-large>list</v-icon>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs3>
        <v-btn class="deep-purple navBtn" router :href="nextMonth()">
          <v-icon light x-large>arrow_forward</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-container fluid>
      <month-table :date="date"></month-table>
    </v-container>

<!-- list of plans for this month -->
    <v-navigation-drawer temporary :right="true" v-model="rightDrawer" style="z-index: 1002;">
      <v-list>
        <v-list-item>
          <v-list-tile>
            <v-list-tile-title>List of planned events</v-list-tile-title>
          </v-list-tile>
        </v-list-item>
        <v-list-item v-for="item in getAllPlansByMonth()">
          <v-list-tile>
            <v-list-tile-title>
              {{ showPlan(item) }}
            </v-list-tile-title>
          </v-list-tile>
        </v-list-item>
      </v-list>

    </v-navigation-drawer>

  </div>
</template>

<script>
  import MonthTable from './MonthTable.vue';
  import dao from '../dao/LocalStorageConnector.js';

  export default {
    props: {
      dateStr: {
        required: true
      }
    },
    components: {
      'month-table': MonthTable
    },
    data: function() {
      return {
        rightDrawer: false,
        options: {
            year: 'numeric',
            month: 'long'
          }
      };
    },
    computed: {
      date() {
        return new Date(Date.parse(this.dateStr));
      },
      year() {
        return this.date.getFullYear();
      },
      month() {
        return this.date.getMonth();
      }
    },
    methods: {
      // methods for month navigation
      prevMonth() {
        return '/month/' + new Date(this.year, this.month - 1, 1).toString();
      },
      nextMonth() {
        return '/month/' + new Date(this.year, this.month + 1, 1).toString();
      },

      // gets plans from dao for list of plans
      getAllPlansByMonth() {
        return dao.getAllPlansByMonth(this.date);
      },

      // shows plan in formatted form
      showPlan(item) {
        if(typeof(item.date.getDate) !== 'function')
          item.date = new Date(Date.parse(item.date));
        return item.date.toLocaleString("en-US", this.options).split(' ')[0] +
            ' ' + item.date.getDate() + ' - ' + item.name + ' (' + item.date.getHours() + ':' + item.date.getMinutes() + ')';
      }
    }
  }
</script>

<style lang="css">
  a {
    display: flex;
    width: 100%;
    color: black;
    text-decoration: none;
  }

  h6 {
    color: white;
  }

  .day {
    flex-basis: 14.285%;
    max-width: 14.285%;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .dayCard {
    min-height: 75px;
  }

  .dayHeaders {
    margin-top: 50px;
    margin-bottom: 30px;
  }

  .navBtn {
    width: 100%;
    margin: 0;
    height: 68px;
  }

  .month .deep-purple {
    position: relative;
  }

  .listBtn {
    position: absolute;
    right: 10px;
    top: 10px;
  }

  .navigation-drawer--right a.list__tile:hover, .navigation-drawer--right .list__tile--highlighted {
    background-color: transparent;
    cursor: default;
  }

  a {
    cursor: default;
  }

  .list__item {
    cursor: default;
  }
</style>
