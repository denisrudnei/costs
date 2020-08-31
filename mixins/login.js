import userSettings from '@/graphql/query/userSettings'
export default {
  methods: {
    afterLogin() {
      this.$apollo
        .query({
          query: userSettings,
        })
        .then((response) => {
          const { currency, locale } = response.data.UserSettings
          this.$store.commit('settings/setCurrency', currency)
          this.$store.commit('settings/setLocale', locale)
        })
    },
  },
}
