

<!-- Component for week visualisation -->
<template lang="html">
  <v-container fluid>

    <v-layout row wrap class="week">
      <v-flex xs3>
        <v-btn class="deep-purple navBtn" router :href="prevWeek">
          <v-icon light x-large>arrow_back</v-icon>
        </v-btn>
      </v-flex>
      <v-flex xs6>
        <v-card class="deep-purple">
          <v-card-text>
            <h5>
              {{ date.toDateString().split(' ')[1] + date.toDateString().split(' ')[2] }}
             -
             {{ dateEnd.toDateString().split(' ')[1] + dateEnd.toDateString().split(' ')[2] }}
            </h5>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs3>
        <v-btn class="deep-purple navBtn" router :href="nextWeek">
          <v-icon light x-large>arrow_forward</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>

    <table>

      <thead>
        <tr>
          <th>
            <v-card class="grey dateHeader">
              <v-card-text>
                Time
              </v-card-text>
            </v-card>
          </th>
          <th v-for="item in dates">
            <v-card class="primary dateHeader">
              <v-card-text>
                {{ item.toDateString().split(' ')[0] + item.toDateString().split(' ')[1] + item.toDateString().split(' ')[2] }}
              </v-card-text>
            </v-card>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>
            <tr class="timeCell" v-for="i in 24">
              <p>
                {{ (i - 1) + ':00' }}
              </p>
            </tr>
          </td>
          <td v-for="item in dates">
            <day :date="item" :items="fillTableAllEventsByDate(item)" :online="online"></day>
          </td>
        </tr>
      </tbody>

    </table>

    <v-snackbar
      :timeout="6000"
      :success="online"
      :error="!online"
      :bottom="true"
      v-model="snackbar"
    >
      {{ online ? 'Connected to Internet!' : 'Oops, connection lost :(' }}
      <v-btn dark flat @click.native="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
  import dao from '../dao/LocalStorageConnector.js';
  import DayTable from './DayTable.vue';

  export default {
    props: {
      dateStr: {
        required: true
      }
    },

    components: {
      'day': DayTable
    },

    data() {
      return {
        online: true,
        snackbar: false
      }
    },

    mounted() {
      window.addEventListener('online', this.networkChange);
      window.addEventListener('offline', this.networkChange);
    },

    methods: {
      networkChange(e) {
        this.online = (e.type == 'online');
        this.snackbar = true;
      },

      // method for gettind plans by date from dao
      fillTableAllEventsByDate(date) {
        const itemsFromDao = {};
        const plans = dao.getAllPlansByDate(date);

        const tmpDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 21, 30 , 0);

        if(plans) {
          plans.forEach((e) => {

            if(typeof(e.date.getHours) !== 'function'){
              e.date = new Date(Date.parse(e.date));
            }

            const i = e.date.getHours();
            itemsFromDao[e.date.getHours()] = e;
          });
        }

        return itemsFromDao;
      }
    },

    computed: {
      date() {
        return new Date(Date.parse(this.dateStr));
      },
      dateEnd() {
        return new Date(this.year, this.month, this.currDate + 6);
      },

      // calculator for array of dates with one for every day in week
      dates() {
        const res = new Array();

        for(let i = 0; i < 7; i++)
          res.push(new Date(this.year, this.month, this.currDate + i));

        return res;
      },
      year() {
        return this.date.getFullYear();
      },
      month() {
        return this.date.getMonth();
      },
      currDate() {
        return this.date.getDate();
      },

      // link generators
      prevWeek() {
        return '/week/' + new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate() - 7);
      },
      nextWeek() {
        return '/week/' + new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate() + 7);
      }
    }
  }

</script>

<style lang="css">
  table {
    width: 100%;
  }

  tr {
    width: 100%;
  }

  th {
    color: white;
  }

  td {
    width: 10% !important;
  }

  .timeCell {
    padding-top: 30px;
    height: 75px;
  }

  .timeCell p {
    margin-top: 30px;
    margin-left: 30px;
  }

  .dateHeader {
    margin-bottom: 20px;
  }

  .week {
    margin-bottom: 40px;
  }
</style>
