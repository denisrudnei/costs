<template>
  <v-app dark>
    <v-navigation-drawer clipped fixed app>
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
import ggl from 'graphql-tag'
export default {
  data() {
    return {
      clipped: false,
      drawer: true,
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
    }
  },
  created() {
    this.$apollo
      .query({
        query: ggl`
        query {
          UserSettings {
            locale
            currency
          }
        }
      `,
      })
      .then((response) => {
        const { currency, locale } = response.data.UserSettings
        this.$store.commit('settings/setCurrency', currency)
        this.$store.commit('settings/setLocale', locale)
      })
  },
  methods: {
    logout() {
      this.$auth.logout()
    },
  },
}
</script>
