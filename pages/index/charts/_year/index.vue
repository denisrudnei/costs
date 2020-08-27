<template>
  <v-row>
    <v-col>
      <v-tabs>
        <v-tab v-for="month in months" :key="month" @click="setMonth(month)">
          {{ month }}
        </v-tab>
      </v-tabs>
      <nuxt-child />
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: mapGetters({
    months: 'dates/getMonths',
  }),
  methods: {
    setMonth(month) {
      const { year } = this.$route.params
      this.$store.commit('dates/setYear', {
        value: year,
        months: this.months,
      })
      this.$store.commit('dates/setMonth', month)
      this.$router.push({
        path: `/charts/${year}/${month}`,
      })
    },
  },
}
</script>

<style></style>
