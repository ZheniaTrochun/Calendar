
<!-- Component for visualise day -->

<template lang="html">
  <div>

    <table>
      <tbody>
        <tr v-for="i in 24" :key="i">
          <td class="bordered" v-if="items && items[i-1]">
            <plan :plan="items[i-1]" :online="online"></plan>
          </td>
          <td class="planAdder bordered" v-else>
            <v-btn class="indigo addBtn" @click.native.stop="openModal(i-1)">
              <v-icon light>add</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- modal dialog for adding new plan -->
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-row>
          <v-card-title>User Profile</v-card-title>
        </v-card-row>
        <v-card-row>
          <v-card-text>

            <v-text-field label="Name" required v-model="name"></v-text-field>
            <v-text-field label="Descrition" v-model="description"></v-text-field>
            <v-text-field label="Start Time" required v-model="time"></v-text-field>
            <v-text-field label="Duration" required type="number" hint="duration in format like 2.5 hours" v-model="duration"></v-text-field>

          </v-card-text>
        </v-card-row>
        <v-card-row actions>
          <v-btn class="blue--text darken-1" flat @click.native="clearForm()">Close</v-btn>
          <v-btn class="blue--text darken-1" flat @click.native="savePlan()">Save</v-btn>
        </v-card-row>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import dao from '../dao/LocalStorageConnector.js';
  import PlanComponent from './Plan.vue';
  import Plan from '../model/PlannedEvent.js';

  export default {
    props: {
      date: {
        required: true
      },
      items: {
        required: true
      },
      online: {
        required: true
      }
    },
    components: {
      'plan': PlanComponent
    },
    data: function() {
      return {
        name: '',
        description: '',
        time: '',
        duration: '',
        dialog: false
      }
    },
    methods: {
      openModal(i) {
        this.dialog = true;
        this.time = i + ':00';
      },
      // method for saving plan in dao
      savePlan() {
        if(!this.name || !this.time || this.duration <= 0 ||
            +this.time.split(':')[0] < 0 || +this.time.split(':')[0] > 23 ||
              +this.time.split(':')[1] < 0 || +this.time.split(':')[1] >= 60) {
          this.clearForm();
          return;
        }

        const newPlan = new Plan(this.name, this.description ? this.description : '-',
            new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate(), this.time.split(':')[0], this.time.split(':')[1], 0),
                this.duration);
        dao.addPlan(newPlan, this.online);
        this.items[newPlan.date.getHours()] = newPlan;

        this.clearForm();
      },
      // method for refreshing dialog data
      clearForm() {
        this.name = '',
        this.description = '',
        this.time = '',
        this.duration = '',
        this.dialog = false
      },
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

  td {
    width: 15%;
    height: 75px;
    position: relative;
  }

  .addBtn {
    display: none;
    margin: auto;
  }

  .planAdder:hover .addBtn {
    display: block;
    width: 100%;
    height: 73px;
  }

  .bordered {
    border: 1px solid lightgrey;
  }
</style>
