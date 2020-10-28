<template>
  <v-app dark>
    <v-app-bar app clipped-left fixed>
      <v-btn icon @click="toggleDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
      v-if="logged"
      :value="drawer"
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
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
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
          icon: 'mdi-cog',
          title: 'Settings',
          to: '/settings',
        },
      ],
      miniVariant: false,
    };
  },
  computed: mapGetters({
    logged: 'auth/getLoggedIn',
  }),
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
    logout() {
      this.$auth.logout();
    },
  },
};
</script>
