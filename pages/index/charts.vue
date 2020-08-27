<template>
  <v-row>
    <v-col>
      <v-tabs>
        <v-tab
          v-for="year in years"
          :key="year.value"
          @click="selectMonths(year)"
        >
          {{ year.value }}
        </v-tab>
      </v-tabs>
      <nuxt-child />
    </v-col>
  </v-row>
</template>

<script>
import ggl from 'graphql-tag'
export default {
  data() {
    return {
      years: [],
    }
  },
  created() {
    this.$apollo
      .query({
        query: ggl`
        query {
          GetUsedDates {
            years {
              value
              months
            }
          }
        }
      `,
        fetchPolicy: 'no-cache',
      })
      .then((response) => {
        this.years = response.data.GetUsedDates.years.sort((a, b) =>
          a > b ? 1 : -1
        )
      })
  },
  methods: {
    selectMonths(year) {
      this.$store.commit(
        'dates/setMonths',
        year.months.sort((a, b) => (a > b ? 1 : -1))
      )
      this.$router.push({
        path: `/charts/${year.value}`,
      })
    },
  },
}
</script>

<style></style>
