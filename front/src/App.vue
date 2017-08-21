

<!-- Root component of application -->
<template>
  <v-app>
    <v-navigation-drawer persistent v-model="drawer" style="z-index: 1001;">
      <v-list>
        <v-list-item v-for="(item, i) in items" :key="i">
          <v-list-tile value="true" router :href="item.to">
            <v-list-tile-action>
              <v-icon light v-html="item.icon"></v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-text="item.title"></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed style="z-index: 1000;">
      <v-toolbar-side-icon @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>

      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>

      <login-buttons></login-buttons>

    </v-toolbar>
    <main>
      <v-container fluid>
        <router-view keep-alive></router-view>
      </v-container>
    </main>


    <v-footer :fixed="fixed">
      <span>&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
  import LoginButtons from './components/LoginButtons.vue';

  export default {
    components: {
      'login-buttons': LoginButtons
    },
    
    data () {
      return {
        right: true,
        drawer: true,
        rightDrawer: false,
        fixed: false,
        items: [
          { icon: 'bubble_chart', title: 'Week', to: '/week/' +
           new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - new Date().getDay() + 1).toString() },
          { icon: 'bubble_chart', title: 'Month', to: '/month/' + new Date().toString() },
          { icon: 'bubble_chart', title: 'Year', to: '/year/' + new Date().toString() }
        ],
        miniVariant: false,
        title: 'Calendar'
      }
    }
  }
</script>

<style lang="stylus">
  @import './stylus/main'
</style>
