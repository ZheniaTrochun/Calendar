

<!-- Component for year visualisation -->
<template lang="html">
  <div>

    <v-layout row wrap>
      <v-flex xs3>
        <v-btn class="pink navBtn" router :href="prevYear">
          <v-icon light x-large>arrow_back</v-icon>
        </v-btn>
      </v-flex>
      <v-flex xs6>
        <v-card class="pink">
          <v-card-text>
            <h5>{{ year }}</h5>
            <v-btn icon @click.native.stop="rightDrawer = !rightDrawer" class="listBtn">
              <v-icon x-large>list</v-icon>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs3>
        <v-btn class="pink navBtn" router :href="nextYear">
          <v-icon light x-large>arrow_forward</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout row wrap class="year">
      <v-flex sm6 v-for="i in 12" :key="i" class="monthInYear">
        <v-flex xs12>
          <v-btn light class="deep-purple monthBtn" router :href="monthLink(i)">
            <h5>{{ new Date(year, i-1, 1).toLocaleString("en-US", options).split(' ')[0] }}</h5>
          </v-btn>
        </v-flex>
        <month-table :date="new Date(year, i-1, 1)"></month-table>
      </v-flex>
    </v-layout>

    <!-- list of plans for this year -->
    <v-navigation-drawer temporary :right="true" v-model="rightDrawer" style="z-index: 1002;">
      <v-list>
        <v-list-item>
          <v-list-tile>
            <v-list-tile-title>List of planned events</v-list-tile-title>
          </v-list-tile>
        </v-list-item>

        <div v-for="i in 12">
          <v-list-item v-for="item in getAllPlansByMonth(i - 1)" :key="i">
            <v-list-tile>
              <v-list-tile-title>
                {{ showPlan(item) }}
              </v-list-tile-title>
            </v-list-tile>
          </v-list-item>
        </div>
      </v-list>
    </v-navigation-drawer>

  </div>
</template>

<script>
  import dao from '../dao/LocalStorageConnector.js';
  import MonthTable from './MonthTable.vue';

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
      date(){
        return new Date(Date.parse(this.dateStr));
      },
      year() {
        return this.date.getFullYear();
      },

      // link generators
      prevYear() {
        return '/year/' + new Date(this.year - 1, 0, 1);
      },
      nextYear() {
        return '/year/' + new Date(this.year + 1, 0, 1);
      }
    },
    methods: {
      // link to month generator
      monthLink(i) {
        return "/month/" + new Date(this.year, i-1, 1).toString();
      },

      // plans by month getter
      getAllPlansByMonth(i) {
        return dao.getAllPlansByMonth(new Date(this.year, i, 1));
      },
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
  .year .day {
    flex-basis: 14.285%;
    max-width: 14.285%;
    margin-top: 5px;
    margin-bottom: 5px;
    padding-left: 5px;
    padding-right: 5px;
  }

  .year .dayCard {
    min-height: 50px;
  }

  .year h5 {
    font-size: 20px;
  }

  .year h6 {
    margin-bottom: 12px;
    margin-top: 4px;
  }

  .year .card__text {
    padding: 10px;
  }

  .dayHeaders {
    margin-top: 50px;
    margin-bottom: 30px;
  }

  .year .monthInYear {
    padding-left: 25px;
    padding-right: 25px;
    text-align: center;
  }

  .year .monthLabel {
  }

  .year .monthBtn {
    margin-bottom: 5px;
    margin-top: 50px;
    width: 100%;
    height: 68px;
  }

  .year .dayHeaders {
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .pink {
    position: relative;
  }

</style>
