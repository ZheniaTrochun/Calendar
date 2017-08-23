<template lang="html">
  <div class="">
    <v-btn class="white--text" secondary v-if="currentUser" @click.native="logout()">{{ currentUser }}</v-btn>
    <v-btn class="white--text" secondary v-else @click.native.stop="dialog = !dialog">Login</v-btn>
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-row>
          <v-card-title>Login</v-card-title>
        </v-card-row>

        <v-card-text>
          <v-card-row class="inputs">
            <v-text-field label="Enter your username" required v-model="username" counter></v-text-field>
          </v-card-row>

          <v-card-row class="inputs">
            <v-text-field
            name="input-10-1"
            label="Enter your password"
            v-model="password"
            :append-icon="e1 ? 'visibility_off' : 'visibility'"
            :append-icon-cb="() => (e1 = !e1)"
            :type="e1 ? 'password' : 'text'"
            counter
            required
            ></v-text-field>
          </v-card-row>

          <v-card-row class="inputs">
            <v-btn outline class="indigo--text center-button" large @click.native="login()">Log me in</v-btn>
          </v-card-row>
        </v-card-text>

    </v-card>
  </v-dialog>
  </div>
</template>

<script>
  import dao from '../dao/LocalStorageConnector.js';
  import superagent from 'superagent';
  import isOnline from 'is-online';

  export default {
    data() {
      return {
        e1: true,
        dialog: false,
        token: dao.getAccessToken(),
        currentUser: dao.getCurrentUser(),
        username: '',
        password: ''
      }
    },

    methods: {
      logout() {
        dao.saveAccessToken('');
        this.token = '';
        dao.saveCurrentUser('');
        this.currentUser = '';
      },

      login() {
        const username = this.username;
        const password = this.password;

        const inst = this;

        isOnline().then(online => {
          if (online) {
            
            superagent.post('http://localhost:8000/login')
            .send({ username: username, password: password })
            .end((err, res) => {

              inst.dialog = !inst.dialog;

              if (!err) {
                dao.saveAccessToken(res.body.token);
                dao.saveCurrentUser(res.body.username);

                inst.currentUser = res.body.username;
                inst.token = res.body.token;
                dao.syncronizePlans();
                inst.username = '';
                inst.password = '';
              }
            });
          }
        })

      }
    }
  }
</script>

<style lang="css">
  .inputs {
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .loginInputs {
    margin-top: 130px;
  }

  .center-button {
    padding-left: 50px;
    padding-right: 50px;
    margin: auto;
    display: block;
    margin-top: 32px;
  }
</style>
