<template>
  <v-row>
    <v-tabs>
      <v-tab to="/costs" exact>List</v-tab>
      <v-tab to="/costs/create">Create</v-tab>
      <v-tab to="/costs/spent-vs-profit">Spends vs Profits</v-tab>
    </v-tabs>
    <v-col>
      <nuxt-child />
    </v-col>
  </v-row>
</template>

<script>
import ggl from 'graphql-tag'
export default {
  data() {
    return {
      costs: [],
    }
  },
  created() {
    this.$apollo
      .query({
        query: ggl`
          query {
            Costs {
              id
              value
              type
              date
            }
          } `,
      })
      .then((response) => {
        this.costs = response.data.Costs
      })
  },
}
</script>

<style></style>
