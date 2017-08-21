
<!-- Component for month calendar table visualisation -->
<template lang="html">
  <div>

    <v-layout row wrap class="dayHeaders">
      <div class="flex day">
        <v-card class="grey">
            <v-card-text>
                <h6>Mon</h6>
            </v-card-text>
        </v-card>
      </div>
      <div class="flex day">
        <v-card class="grey">
            <v-card-text>
                <h6>Tue</h6>
            </v-card-text>
        </v-card>
      </div>
      <div class="flex day">
        <v-card class="grey">
            <v-card-text>
                <h6>Wed</h6>
            </v-card-text>
        </v-card>
      </div>
      <div class="flex day">
        <v-card class="grey">
            <v-card-text>
                <h6>Thu</h6>
            </v-card-text>
        </v-card>
      </div>
      <div class="flex day">
        <v-card class="grey">
            <v-card-text>
                <h6>Fri</h6>
            </v-card-text>
        </v-card>
      </div>
      <div class="flex day">
        <v-card class="pink">
            <v-card-text>
                <h6>Sat</h6>
            </v-card-text>
        </v-card>
      </div>
      <div class="flex day">
        <v-card class="pink">
            <v-card-text>
                <h6>Sun</h6>
            </v-card-text>
        </v-card>
      </div>
    </v-layout>

<!-- Table with days -->
    <v-layout class="month" row wrap v-for="i in weeks" :key="i">
      <v-btn class="weekLink" wrap router :href="weekTableLink(i)">
        <div class="flex day" v-for="j in 7" :key="j">
          <v-card class="primary dayCard">
              <v-card-text>
                  <h5>{{ calculateDate() }}</h5>
              </v-card-text>
              <div class="topBorderedNumber pink" v-if="getNumberOfPlansByDate(tmpDateForCalendar) != 0">
                <p>
                  {{ getNumberOfPlansByDate(tmpDateForCalendar) }}
                </p>
              </div>
          </v-card>
        </div>
      </v-btn>
    </v-layout>

  </div>
</template>

<script>

  import dao from '../dao/LocalStorageConnector.js';

  export default {
    props: {
      date: {
        required: true
      }
    },
    name: 'month-table',
    data: function() {
      return {
        options: {
            year: 'numeric',
            month: 'long'
          }
      };
    },
    computed: {
      // calculates number of weeks in month
      weeks() {
        const dayThreshold = [ 5, 1, 5, 6, 5, 6, 5, 5, 6, 5, 6, 5 ];
        const firstDay = new Date(this.year, this.month, 1).getDay();
        const baseWeeks = (this.month == 1 ? 4 : 5);
        return baseWeeks + (firstDay >= dayThreshold[this.month] || firstDay == 0 ? 1 : 0);
      },

      // calculates date of day, that starts first week of month
      firstWeekStartDate() {
        const tmpDate = new Date(this.year, this.month, 0);
        tmpDate.setDate(tmpDate.getDate() - tmpDate.getDay());

        return tmpDate;
      },

      // temporary variable
      tmpDateForCalendar() {
        return new Date(this.firstWeekStartDate.getFullYear(), this.firstWeekStartDate.getMonth(), this.firstWeekStartDate.getDate());
      },

      year() {
        return this.date.getFullYear();
      },
      month() {
        return this.date.getMonth();
      }
    },
    methods: {
      // getter for link to current week
      weekTableLink(i) {
        return "/week/" + new Date(this.firstWeekStartDate.getFullYear(), this.firstWeekStartDate.getMonth(), this.firstWeekStartDate.getDate() + 7*(i-1) + 1).toString();
      },

      // increments date by 1 and returns it
      calculateDate(currDay) {
        this.tmpDateForCalendar.setDate(this.tmpDateForCalendar.getDate() + 1);

        return this.tmpDateForCalendar.getDate();
      },

      // getter for number of planned events from dao
      getNumberOfPlansByDate(tmpDateForCalendar) {
        return dao.getNumberOfPlansByDate(tmpDateForCalendar);
      }
    }
  }
</script>

<style lang="css">
  .weekLink {
    background-color: transparent;
    height: 75px;
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
    position: relative;
  }

  .dayHeaders {
    margin-top: 50px;
    margin-bottom: 30px;
  }

  .monthNavBtn {
    width: 100%;
    margin: 0;
    height: 68px;
  }

  .topBorderedNumber {
    text-align: center;
    color: white;
    height: 20px;
    width: 20px;
    border-radius: 100%;
    position: absolute !important;
    top: 0;
    right: 0;
  }

  .month .btn--raised {
    box-shadow: none;
  }

  .month .btn:hover {
    background-color: transparent !important;
  }
</style>
