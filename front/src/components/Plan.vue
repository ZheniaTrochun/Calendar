

<!-- Component for simple plan visualisation -->
<template lang="html">
  <div v-if="mutablePlan">

    <div class="planRoot deep-purple" :style="{top : (((mutablePlan.date.getMinutes()) / 60) * 75) + 'px', height : (mutablePlan.duration * 75) + 'px'}">
      <div class="planHolder" :style="{height : (mutablePlan.duration * 75) + 'px'}">
        <h5>{{ mutablePlan.name }}</h5>
        <p>
          {{ mutablePlan.description }}
        </p>

        <v-btn floating small class="cyan editBtn" @click.native.stop="dialog = !dialog">
          <v-icon light>edit</v-icon>
        </v-btn>

        <v-btn floating small class="deep-orange deleteBtn" @click.native.stop="deletePlan()">
          <v-icon light>delete</v-icon>
        </v-btn>
      </div>
    </div>

<!-- dialog with form for update plan -->
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-row>
          <v-card-title>User Profile</v-card-title>
        </v-card-row>
        <v-card-row>
          <v-card-text>
            <v-text-field label="Name" required v-model="plan.name" disabled></v-text-field>
            <v-text-field label="Descrition" v-model="description"></v-text-field>
            <v-text-field label="Start Time" required v-model="time"></v-text-field>
            <v-text-field label="Duration" required type="number" hint="example of helper text only on focus" v-model="duration"></v-text-field>
          </v-card-text>
        </v-card-row>
        <v-card-row actions>
          <v-btn class="blue--text darken-1" flat @click.native="clearForm()">Close</v-btn>
          <v-btn class="blue--text darken-1" flat @click.native="updatePlan()">Update</v-btn>
        </v-card-row>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
  import dao from '../dao/LocalStorageConnector.js';
  import Plan from '../model/PlannedEvent.js';

  export default {
    name: 'plan',
    props: {
      plan: {
        required: true
      }
    },
    data: function() {
      return {
        name: this.plan.name,
        mutablePlan: this.plan,
        dialog: false,
        description: this.plan.description,
        time: this.plan.date.getHours() + ':' + this.plan.date.getMinutes(),
        duration: this.plan.duration
      }
    },
    methods: {

      clearForm() {
        this.dialog = false;
        this.description = this.plan.description;
        this.time = this.plan.date.getHours() + ':' + this.plan.date.getMinutes();
        this.duration = this.plan.duration;
      },

      // accepter for update dialog
      updatePlan() {
        if(!this.name || !this.time || this.duration <= 0 ||
            +this.time.split(':')[0] < 0 || +this.time.split(':')[0] > 23 ||
              +this.time.split(':')[1] < 0 || +this.time.split(':')[1] >= 60) {

          this.clearForm();
          return;
        }

        const newPlan = new Plan(this.plan.name, this.description,
          new Date(this.plan.date.getFullYear(), this.plan.date.getMonth(), this.plan.date.getDate(), this.time.split(':')[0], this.time.split(':')[1], 0), this.duration);
        dao.updatePlan(this.plan, newPlan);

        console.log('updateTest');

        this.mutablePlan = newPlan;

        this.clearForm();
      },

      // plan remover
      deletePlan() {
        dao.removePlan(this.mutablePlan);
        this.mutablePlan = null;
      }
    }
  }
</script>


<style lang="css">
  .planRoot {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;
  }

  h5 {
    margin-left: 5px;
    margin-bottom: 5px;
    color: white !important;
  }

  .planHolder {
    width: 100%;
    max-width: 300px;
    color: white !important;
    position: relative;
  }

  .planHolder p {
    padding-left: 10px;
  }

  .editBtn {
    display: none;
    position: absolute;
    bottom: 0;
    right: 0;
  }

  .deleteBtn {
    display: none;
    position: absolute;
    bottom: 0;
    right: left;
  }

  .planHolder:hover .editBtn, .planHolder:hover .deleteBtn {
    display: block;
  }
</style>
