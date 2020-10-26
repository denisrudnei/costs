<template>
  <v-app dark>
    <v-app-bar v-if="logged && onMobile" app clipped-left fixed>
      <v-btn icon @click="drawer = !drawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
      v-if="logged"
      v-model="drawer"
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

export default {
  mixins: [login],
  data() {
    return {
      clipped: false,
      fixed: false,
      drawer: true,
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
  computed: {
    onMobile() {
      return ['sm', 'xs'].includes(this.breakpoint);
    },
    breakpoint() {
      return this.$vuetify.breakpoint.name;
    },
    ...mapGetters({
      logged: 'auth/getLoggedIn',
    }),
  },
  created() {
    if (this.onMobile) this.drawer = false;
    if (this.logged) {
      this.afterLogin();
    }
  },
  methods: {
    logout() {
      this.$auth.logout();
    },
  },
};
</script>
