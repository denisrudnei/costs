<template>
  <v-app dark>
    <v-app-bar app clipped-left fixed>
      <v-btn icon @click="toggleDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <v-btn v-if="drawer" icon @click="toggleMini">
        <v-icon>{{ mini ? 'mdi-chevron-right' : 'mdi-chevron-left' }}</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
      v-if="logged"
      v-model="drawer"
      :mini-variant="mini"
      app
      clipped
      fixed
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="isAdmin" to="/admin">
          <v-list-item-action>
            <v-icon>mdi-database-settings</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            Admin
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="logout">
          <v-list-item-action>
            <v-icon>mdi-exit-to-app</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Logout </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer fixed app>
      <span>&copy; 2020</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';
import login from '@/mixins/login';
import drawer from '@/mixins/drawer';

export default {
  mixins: [
    login,
    drawer,
  ],
  data() {
    return {
      clipped: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-home',
          title: 'Home',
          to: '/',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Costs',
          to: '/costs',
        },
        {
          icon: 'mdi-axis-arrow',
          title: 'Forecasts',
          to: '/forecasts',
        },
        {
          icon: 'mdi-currency-usd',
          title: 'Loans',
          to: '/loans',
        },
        {
          icon: 'mdi-table-clock',
          title: 'Work Schedule',
          to: '/work-schedule',
        },
        {
          icon: 'mdi-cog',
          title: 'Settings',
          to: '/settings',
        },
        {
          icon: 'mdi-connection',
          title: 'Connection',
          to: '/connection',
        },
      ],
      miniVariant: false,
    };
  },
  computed: {
    isAdmin() {
      return this.logged && this.user.role === 'ADMIN';
    },
    ...mapGetters({
      logged: 'auth/getLoggedIn',
      user: 'auth/getUser',
    }),
  },
  mounted() {
    if (this.onMobile) this.drawer = false;
  },
  created() {
    if (this.logged) {
      this.afterLogin();
    }
  },
  methods: {
    toggleDrawer() {
      this.$store.commit('screen/setDrawer', !this.drawer);
    },
    toggleMini() {
      this.$store.commit('screen/setMini', !this.mini);
    },
    logout() {
      this.$auth.logout();
    },
  },
};
</script>
